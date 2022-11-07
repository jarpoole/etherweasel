mod dns_sniff;
mod driver;

use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};
use clap::Parser;
use driver::driver::{DriverGuard, DriverMode};
use driver::hardware_driver::HardwareDriver;
use driver::mock_driver::MockDriver;
use serde::{Deserialize, Serialize};
use std::env;
use std::net::SocketAddr;
use std::sync::Arc;
use sysinfo::{CpuExt, CpuRefreshKind, RefreshKind, System, SystemExt};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;

const SPI_INTERFACE: &str = "/dev/spidev0.0";
const API_PORT: u16 = 3000;

#[derive(Parser)]
struct Cli {
    #[arg(short = 'd', long = "driver", default_value = "hardware")]
    driver: String,
    #[arg(short = 'm', long = "mode", default_value = "passive")]
    mode: String,
}

#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    // Handle CLI arguments
    let args = Cli::parse();
    let driver_guard: DriverGuard = Arc::new(Mutex::new(match args.driver.as_str() {
        "mock" => Box::new(MockDriver::new()),
        "hardware" => Box::new(HardwareDriver::new(SPI_INTERFACE)),
        &_ => panic!("invalid driver"),
    }));
    let mode = match DriverMode::from(&args.mode) {
        Ok(mode) => mode,
        Err(_) => panic!("invalid mode"),
    };
    println!(
        "etherweasel_rs is running in '{}' mode using the '{}' driver",
        args.mode, args.driver
    );

    // Configure the driver
    set_mode(driver_guard.clone(), mode).await;

    //dns_sniff::start("eth0");
    for device in pcap::Device::list().expect("device lookup failed") {
        println!("Found device! {:?}", device);
    }

    //
    let sys_info_guard = Arc::new(Mutex::new(System::new_with_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory()
            .with_networks()
            .with_networks_list(),
    )));

    // initialize tracing
    tracing_subscriber::fmt::init();

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

    // Notice we listen on all interfaces here (0.0.0.0) instead
    // of the standard localhost (127.0.0.1) because we would like
    // the server to be accessible from the outside network
    let addr = SocketAddr::from(([0, 0, 0, 0], API_PORT));
    tracing::debug!("listening on {}", addr);
    println!("Started server");
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
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
    println!("Attempting to set mode to {:?}", mode);
    let mut driver = driver_guard.lock().await;
    match driver.set_mode(mode).await {
        Ok(()) => {
            println!("Successfully set mode to {:?}", mode);
            Ok(())
        }
        Err(_) => {
            println!("Failed to set mode to {:?}", mode);
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
    println!("Attempting to get mode");
    let driver = driver_guard.lock().await;
    match driver.get_mode().await {
        Ok(mode) => {
            println!("Successfully got mode {:?}", mode);
            Ok(mode)
        }
        Err(_) => {
            println!("Failed to get mode");
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
