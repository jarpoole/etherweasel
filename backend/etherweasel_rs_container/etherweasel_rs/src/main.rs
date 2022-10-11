mod dns_sniff;
mod driver;

use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};
use clap::Parser;
use driver::driver::{Driver, DriverMode};
use driver::hardware_driver::HardwareDriver;
use driver::mock_driver::MockDriver;
//use serde::{Deserialize, Serialize};
use std::env;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::Mutex;

struct State {}

#[derive(Parser)]
struct Cli {
    #[arg(short = 'd', long = "driver")]
    driver: String,
    #[arg(short = 'm', long = "mode")]
    mode: String,
}

#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    // Handle CLI arguments
    let args = Cli::parse();
    let driver: Box<dyn Driver + Send + Sync> = match args.driver.as_str() {
        "mock" => Box::new(MockDriver::new()),
        "hardware" => Box::new(HardwareDriver {}),
        &_ => panic!("invalid driver"),
    };
    println!(
        "etherweasel_rs is running in '{}' mode using the '{}' driver",
        args.mode, args.driver
    );

    // Configure the driver
    driver.set_mode(DriverMode::PASSIVE).await;

    //dns_sniff::start("eth0");

    // initialize tracing
    tracing_subscriber::fmt::init();

    // build our application with a route
    let app = Router::new()
        .route("/ping", get(ping))
        .route("/mode", post(set_mode))
        .layer(Extension(Arc::new(Mutex::new(driver))));

    // Notice we listen on all interfaces here (0.0.0.0) instead
    // of the standard localhost (127.0.0.1) because we would like
    // the server to be accessible from outside the docker container
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
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

#[axum::debug_handler]
async fn set_mode(
    Extension(driver): Extension<Arc<Mutex<Box<dyn Driver + Send + Sync>>>>,
) -> impl IntoResponse {
    let mut d = driver.lock().await;
    d.get_mode().await;
    //let mode = "hello world";
    let mode = {};
    (StatusCode::CREATED, Json(mode))
}

/*
async fn create_user(
    // this argument tells axum to parse the request body
    // as JSON into a `CreateUser` type
    Json(payload): Json<CreateUser>,
) -> impl IntoResponse {
    // insert your application logic here
    let user = User {
        id: 1337,
        username: payload.username,
    };

    // this will be converted into a JSON response
    // with a status code of `201 Created`
    (StatusCode::CREATED, Json(user))
}

// the input to our `create_user` handler
#[derive(Deserialize)]
struct CreateUser {
    username: String,
}

// the output to our `create_user` handler
#[derive(Serialize)]
struct User {
    id: u64,
    username: String,
}
*/
