mod attack;
mod driver;

use addr::parse_dns_name;
use attack::{attack::Attack, sniff::Sniff};
use axum::{
    extract::Path,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};
use clap::{Parser, ValueEnum};
use dashmap::DashMap;
use driver::{
    docker_driver::{DockerDriver, DockerDriverConfig},
    driver::{DriverGuard, DriverMode},
    hardware_driver::HardwareDriver,
    mock_driver::MockDriver,
};
use futures::stream::TryStreamExt;
use libc;
use rtnetlink::{new_connection, Error};
use serde::{de::Error as DeError, Deserialize, Deserializer, Serialize};
use std::collections::HashMap;
use std::net::{Ipv4Addr, SocketAddr};
use std::sync::Arc;
use sysinfo::{CpuExt, CpuRefreshKind, NetworkData, NetworkExt, RefreshKind, System, SystemExt};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use tracing::{debug, error, info, warn, Level};
use uuid::Uuid;

use crate::attack::dns::Dns;

const SPI_INTERFACE: &str = "/dev/spidev0.0";

// Notice we listen on all interfaces here (0.0.0.0) instead
// of the standard localhost (127.0.0.1) because we would like
// the server to be accessible from the outside network
const API_PORT: u16 = 3000;
const API_ADDRESS: [u8; 4] = [0, 0, 0, 0];

#[derive(Debug, Clone, ValueEnum)]
enum Mode {
    ACTIVE,
    PASSIVE,
}

#[derive(Debug, Clone, ValueEnum)]
enum Driver {
    HARDWARE,
    MOCK,
    DOCKER,
}
#[derive(Parser)]
struct Cli {
    #[arg(short, long, default_value = "eth0,wlan0", value_delimiter = ',')]
    interfaces: Vec<String>,
    #[arg(
        short,
        long,
        default_value_t = Driver::HARDWARE,
        value_enum
    )]
    driver: Driver,
    #[arg(
        short,
        long,
        default_value_t = Mode::PASSIVE,
        value_enum
    )]
    mode: Mode,
    #[arg(
        short,
        long,
        help = "perform initial hardware discovery, configuration and exit"
    )]
    configure: bool,
    #[arg(short, long, action = clap::ArgAction::Count, help = "set the logging level")]
    verbose: u8,
}

#[derive(Clone)]
struct EthInterfaces(String, String);

type Attacks = Arc<DashMap<Uuid, Mutex<Box<dyn Attack + Send + Sync>>>>;

#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    // Handle CLI arguments
    let args = Cli::parse();
    let driver_guard: DriverGuard = Arc::new(Mutex::new(match args.driver {
        Driver::MOCK => Box::new(MockDriver::new()),
        Driver::DOCKER => Box::new(DockerDriver::new(DockerDriverConfig {
            ethernet_a: "ethmitmA",
            ethernet_b: "ethmitmB",
            interface_a: "tapA",
            interface_b: "tapB",
            bridge_a: "brA",
            bridge_b: "brB",
            bridge_ab: "brAB",
        })),
        Driver::HARDWARE => Box::new(HardwareDriver::new(SPI_INTERFACE)),
    }));
    let driver_mode = match args.mode {
        Mode::PASSIVE => DriverMode::PASSIVE,
        Mode::ACTIVE => DriverMode::ACTIVE,
    };
    let verbosity = match args.verbose {
        0 => Level::WARN,
        1 => Level::INFO,
        2 => Level::DEBUG,
        _ => Level::TRACE,
    };
    let eth_interfaces = EthInterfaces(
        String::from(&args.interfaces[0]),
        String::from(&args.interfaces[1]),
    );

    // Configure logging
    tracing_subscriber::fmt().with_max_level(verbosity).init();
    // Log the entire configuration
    debug!("mode: {:?}", args.mode);
    debug!("driver: {:?}", args.driver);
    debug!(
        "interface A: {:?}, interface B: {:?}",
        eth_interfaces.0, eth_interfaces.1
    );
    if args.interfaces.len() > 2 {
        warn!("Extra interfaces will be ignored");
    }
    info!("etherweasel_rs running...");

    // Configure the driver
    set_mode(driver_guard.clone(), driver_mode)
        .await
        .expect("Failed to set driver state");

    // Configure system monitoring
    let sys_info_guard = Arc::new(Mutex::new(System::new_with_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory()
            .with_networks()
            .with_networks_list(),
    )));

    // Configure interfaces
    set_promiscuous(eth_interfaces.0.as_str())
        .await
        .expect("failed to set promiscuous mode");
    set_promiscuous(eth_interfaces.1.as_str())
        .await
        .expect("failed to set promiscuous mode");

    // Create a map to store the state of the backend dns attacks
    let attacks: Attacks = Arc::new(DashMap::new());
    /*
    attacks.insert(
        Uuid::from_str("a428e5e2-a7b3-4c6d-adef-bab09c8307d5").unwrap(),
        Mutex::new(Box::new(Sniff { test: 0 })),
    );
    */

    //
    for device in pcap::Device::list().expect("device lookup failed") {
        println!("Found device! {:?}", device);
    }

    /*
    let iface = eth_interfaces.clone();
    thread::spawn(move || {
        dns_sniff::sniff(iface.0.as_str());
    });
    */

    // build our application with a route
    let app = Router::new()
        .route("/ping", get(ping))
        .route("/mode", get(get_mode_handler).post(set_mode_handler))
        .route("/performance", get(get_performance_stats))
        .route("/networking", get(get_networking))
        .route("/info", get(get_device_info))
        .route("/attack", post(create_attack_handler))
        .route("/attacks", get(get_attack_ids_handler))
        .route(
            "/attack/:id",
            get(get_attack_handler).delete(delete_attack_handler),
        )
        .route("/logs/:id", get(get_logs_handler))
        .layer(CorsLayer::very_permissive())
        .layer(Extension(driver_guard))
        .layer(Extension(eth_interfaces))
        .layer(Extension(attacks))
        .layer(Extension(sys_info_guard));

    let addr = SocketAddr::from((API_ADDRESS, API_PORT));
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
    info!("HTTP server listening on {}", addr);
}

async fn ping() -> impl IntoResponse {
    StatusCode::OK
}

#[derive(Deserialize, Debug)]
struct SetMode {
    mode: String,
}

#[axum::debug_handler]
async fn set_mode_handler(
    Extension(driver): Extension<DriverGuard>,
    Json(payload): Json<SetMode>,
) -> impl IntoResponse {
    match DriverMode::from(&payload.mode) {
        Ok(mode) => match set_mode(driver, mode).await {
            Ok(()) => StatusCode::OK,
            Err(()) => StatusCode::INTERNAL_SERVER_ERROR,
        },
        Err(()) => StatusCode::BAD_REQUEST,
    }
}
async fn set_mode(driver_guard: DriverGuard, mode: DriverMode) -> Result<(), ()> {
    debug!("Attempting to set mode to {:?}", mode);
    let mut driver = driver_guard.lock().await;
    match driver.set_mode(mode).await {
        Ok(()) => {
            debug!("Successfully set mode to {:?}", mode);
            Ok(())
        }
        Err(_) => {
            error!("Failed to set mode to {:?}", mode);
            Err(())
        }
    }
}

#[axum::debug_handler]
async fn get_mode_handler(Extension(driver_guard): Extension<DriverGuard>) -> impl IntoResponse {
    match get_mode(driver_guard).await {
        Ok(mode) => (StatusCode::OK, Json(mode)).into_response(),
        Err(()) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
async fn get_mode(driver_guard: DriverGuard) -> Result<DriverMode, ()> {
    debug!("Attempting to get mode");
    let driver = driver_guard.lock().await;
    match driver.get_mode().await {
        Ok(mode) => {
            debug!("Successfully got mode {:?}", mode);
            Ok(mode)
        }
        Err(_) => {
            error!("Failed to get mode");
            Err(())
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct PerformanceStats {
    free_memory: u64,
    total_memory: u64,
    cpu_frequency: u64,
    cpu_usage: f32,
}

#[axum::debug_handler]
async fn get_performance_stats(
    Extension(sys_info_guard): Extension<Arc<Mutex<System>>>,
) -> impl IntoResponse {
    let mut sys_info = sys_info_guard.lock().await;
    sys_info.refresh_all();
    (
        StatusCode::OK,
        Json(PerformanceStats {
            free_memory: sys_info.free_memory(),
            total_memory: sys_info.total_memory(),
            cpu_frequency: sys_info.global_cpu_info().frequency() * 1000000,
            cpu_usage: sys_info.global_cpu_info().cpu_usage(),
        }),
    )
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct HostNetworking {
    interface: String,
    mac_address: Option<String>,
    connected: bool,
    // RX statistics
    rx_bytes: u64,
    rx_packets: u64,
    // TX statistics
    tx_bytes: u64,
    tx_packets: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Networking {
    alice: HostNetworking,
    bob: HostNetworking,
}

#[axum::debug_handler]
async fn get_networking(
    Extension(sys_info_guard): Extension<Arc<Mutex<System>>>,
    Extension(interfaces): Extension<EthInterfaces>,
) -> impl IntoResponse {
    let mut sys_info = sys_info_guard.lock().await;
    sys_info.refresh_networks();
    let stats: HashMap<&String, &NetworkData> = sys_info.networks().into_iter().collect();
    if let (Some(alice_stats), Some(bob_stats), Ok(alice_link_up), Ok(bob_link_up)) = (
        stats.get(&interfaces.0),
        stats.get(&interfaces.1),
        is_up(&interfaces.0).await,
        is_up(&interfaces.1).await,
    ) {
        (
            StatusCode::OK,
            Json(Networking {
                alice: HostNetworking {
                    interface: interfaces.0,
                    mac_address: None,
                    connected: alice_link_up,
                    rx_bytes: alice_stats.total_received(),
                    rx_packets: alice_stats.total_packets_received(),
                    tx_bytes: alice_stats.total_transmitted(),
                    tx_packets: alice_stats.total_packets_transmitted(),
                },
                bob: HostNetworking {
                    interface: interfaces.1,
                    mac_address: None,
                    connected: bob_link_up,
                    rx_bytes: bob_stats.total_received(),
                    rx_packets: bob_stats.total_packets_received(),
                    tx_bytes: bob_stats.total_transmitted(),
                    tx_packets: bob_stats.total_packets_transmitted(),
                },
            }),
        )
            .into_response()
    } else {
        StatusCode::INTERNAL_SERVER_ERROR.into_response()
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DeviceInfo {
    name: Option<String>,
    os_name: Option<String>,
    os_version: Option<String>,
    kernel_version: Option<String>,
    uptime: u64,
}

#[axum::debug_handler]
async fn get_device_info(
    Extension(sys_info_guard): Extension<Arc<Mutex<System>>>,
) -> impl IntoResponse {
    let mut sys_info = sys_info_guard.lock().await;
    sys_info.refresh_all();
    (
        StatusCode::OK,
        Json(DeviceInfo {
            name: sys_info.host_name(),
            os_name: sys_info.name(),
            os_version: sys_info.os_version(),
            kernel_version: sys_info.kernel_version(),
            uptime: sys_info.uptime(),
        }),
    )
}

async fn set_promiscuous(interface: &str) -> Result<(), Error> {
    let (connection, handle, _) = new_connection().unwrap();
    let task = tokio::spawn(connection);
    let response = handle
        .link()
        .get()
        .match_name(interface.to_string().clone())
        .execute()
        .try_next()
        .await?
        .ok_or(Error::RequestFailed)?;
    handle
        .link()
        .set(response.header.index)
        .promiscuous(true)
        .execute()
        .await?;
    task.abort();
    Ok(())
}

async fn is_up(interface: &str) -> Result<bool, Error> {
    let (connection, handle, _) = new_connection().unwrap();
    let task = tokio::spawn(connection);
    let response = handle
        .link()
        .get()
        .match_name(interface.to_string().clone())
        .execute()
        .try_next()
        .await?
        .ok_or(Error::RequestFailed)?;
    task.abort();
    Ok(response.header.flags & libc::IFF_UP as u32 != 0)
}

#[derive(Deserialize, Debug)]
struct DnsAttackConfig {
    #[serde(deserialize_with = "validate_fqdn")]
    fqdn: String,
    ip: Ipv4Addr,
}

fn validate_fqdn<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    let string: String = Deserialize::deserialize(deserializer)?;
    info!("here");
    match parse_dns_name(&string) {
        Ok(addr) => Ok(addr.as_str().to_owned()),
        Err(_) => Err(DeError::custom("Invalid FQDN")),
    }
}

#[derive(Deserialize, Debug)]
struct SniffAttackConfig {}

#[derive(Deserialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
enum CreateAttack {
    //Dns { config: DnsAttackConfig },
    Sniff { config: SniffAttackConfig },
    Dns { config: DnsAttackConfig },
}

#[derive(Serialize, Debug)]
struct CreateAttackResponse {
    id: Uuid,
}

#[axum::debug_handler]
async fn create_attack_handler(
    Json(payload): Json<CreateAttack>,
    Extension(attacks): Extension<Attacks>,
    Extension(interfaces): Extension<EthInterfaces>,
) -> impl IntoResponse {
    match create_attack(payload, attacks, interfaces) {
        Ok(id) => (StatusCode::CREATED, Json(CreateAttackResponse { id })).into_response(),
        Err(()) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
fn create_attack(
    new_attack: CreateAttack,
    attacks: Attacks,
    interfaces: EthInterfaces,
) -> Result<Uuid, ()> {
    debug!("Attempting to create new attack {:?}", new_attack);
    let uuid = Uuid::new_v4();
    let mut attack: Box<dyn Attack + Send + Sync> = match new_attack {
        CreateAttack::Sniff { config } => {
            info!("creating sniff attack");
            Box::new(Sniff {
                interface1: interfaces.0,
                interface2: interfaces.1,
                concurrency: 2,
                tasks: vec![],
            })
        }
        CreateAttack::Dns { config } => {
            info!("creating dns attack");
            Box::new(Dns {
                interface1_name: interfaces.0,
                interface2_name: interfaces.1,
                domain_name: config.fqdn.to_string(),
                ip_address: config.ip,
                ..Default::default()
            })
        }
    };
    attack.start();
    attacks.insert(uuid, Mutex::new(attack));
    Ok(uuid)
}

#[axum::debug_handler]
async fn get_attack_ids_handler(Extension(attacks): Extension<Attacks>) -> impl IntoResponse {
    (StatusCode::OK, Json(get_attack_ids(attacks)))
}
fn get_attack_ids(attacks: Attacks) -> Vec<Uuid> {
    attacks.iter().map(|el| el.key().to_owned()).collect()
}

#[axum::debug_handler]
async fn get_attack_handler(Path(id): Path<Uuid>) -> impl IntoResponse {
    StatusCode::OK
}
#[axum::debug_handler]
async fn delete_attack_handler(
    Path(id): Path<Uuid>,
    Extension(attacks): Extension<Attacks>,
) -> impl IntoResponse {
    match delete_attack(id, attacks).await {
        Ok(()) => StatusCode::OK,
        Err(()) => StatusCode::NOT_FOUND,
    }
}
async fn delete_attack(id: Uuid, attacks: Attacks) -> Result<(), ()> {
    if let Some((_, attack_guard)) = attacks.remove(&id) {
        let mut attack = attack_guard.lock().await;
        attack.stop().unwrap_or(())
    }
    Err(())
}

#[axum::debug_handler]
async fn get_logs_handler(
    Path(id): Path<Uuid>,
    Extension(attacks): Extension<Attacks>,
) -> impl IntoResponse {
    match get_logs(id, attacks).await {
        Ok(logs) => (StatusCode::OK, Json(logs)).into_response(),
        Err(_) => StatusCode::BAD_REQUEST.into_response(),
    }
}

async fn get_logs(id: Uuid, attacks: Attacks) -> Result<Vec<Box<dyn erased_serde::Serialize>>, ()> {
    if let Some(attack_guard) = attacks.get(&id) {
        let attack = attack_guard.lock().await;
        Ok(attack.get_logs())
    } else {
        Err(())
    }
}
