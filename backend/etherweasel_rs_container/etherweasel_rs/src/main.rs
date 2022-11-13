mod dns_sniff;
mod driver;
use rtnetlink::{new_connection, Error, Handle};
use futures::stream::TryStreamExt;
use std::thread;

use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};
use clap::{Parser, ValueEnum};
use driver::{
    docker_driver::{DockerDriver,DockerDriverConfig},
    driver::{DriverGuard, DriverMode},
    hardware_driver::HardwareDriver,
    mock_driver::MockDriver,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use sysinfo::{CpuExt, CpuRefreshKind, RefreshKind, System, SystemExt};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use std::collections::HashMap;

use tracing::{debug, error, info, span, warn, Level};

const SPI_INTERFACE: &str = "/dev/spidev0.0";

// Notice we listen on all interfaces here (0.0.0.0) instead
// of the standard localhost (127.0.0.1) because we would like
// the server to be accessible from the outside network
const API_PORT: u16 = 3000;
const API_ADDRESS: [u8; 4] = [0,0,0,0];

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
    #[arg(short, long, default_value = "eth0,wlan0",value_delimiter=',')]
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
        long , 
        default_value_t = Mode::PASSIVE,
        value_enum
    )]
    mode: Mode,
    #[arg(short, long, help = "perform initial hardware discovery, configuration and exit")]
    configure: bool,
    #[arg(short, long, action = clap::ArgAction::Count, help = "set the logging level")]
    verbose: u8,
}

struct DnsAttack {
    workers: Vec<String>,
}

#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {

    // Handle CLI arguments
    let args = Cli::parse();
    let driver_guard: DriverGuard = Arc::new(Mutex::new(match args.driver {
        Driver::MOCK => Box::new(MockDriver::new()),
        Driver::DOCKER => Box::new(DockerDriver::new(
            DockerDriverConfig{
                ethernet_a: "ethmitmA",
                ethernet_b: "ethmitmB",
                interface_a: "tapA",
                interface_b: "tapB",
                bridge_a: "brA",
                bridge_b: "brB",
                bridge_ab: "brAB",
            }
        )),
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
    let eth_interface_a = String::from(&args.interfaces[0]); 
    let eth_interface_b = String::from(&args.interfaces[1]); 

    // Configure logging 
    tracing_subscriber::fmt().with_max_level(verbosity).init();
    // Log the entire configuration
    debug!("mode: {:?}",args.mode);
    debug!("driver: {:?}",args.driver);
    debug!("interface A: {:?}, interface B: {:?}",eth_interface_a,eth_interface_b);
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
    set_promiscuous(eth_interface_a.as_str()).await.expect("failed to set promiscuous mode");
    set_promiscuous(eth_interface_b.as_str()).await.expect("failed to set promiscuous mode");

    // Create a map to store the state of the backend dns attacks
    let mut dns_attacks: HashMap<String,DnsAttack>= HashMap::new();


    //
    for device in pcap::Device::list().expect("device lookup failed") {
        println!("Found device! {:?}", device);
    }
    thread::spawn(move || {
        dns_sniff::sniff(eth_interface_a.as_str());
    });

    // build our application with a route
    let app = Router::new()
        .route("/ping", get(ping))
        .route("/mode", get(get_mode_handler))
        .route("/mode", post(set_mode_handler))
        .route("/performance", get(get_performance_stats))
        .route("/info", get(get_device_info))
        .layer(CorsLayer::very_permissive())
        .layer(Extension(driver_guard))
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