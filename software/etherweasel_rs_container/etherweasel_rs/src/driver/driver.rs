use async_trait::async_trait;
use serde::Serialize;
use std::sync::Arc;
use tokio::sync::Mutex;

pub type DriverGuard = Arc<Mutex<Box<dyn Driver + Send + Sync>>>;

#[derive(Debug, Eq, PartialEq, Clone, Copy, Serialize)]
pub enum DriverMode {
    DISCONNECTED, // Default
    ACTIVE,
    PASSIVE,
}

impl DriverMode {
    pub fn from(mode: &str) -> Result<DriverMode, ()> {
        match mode {
            "active" => Ok(DriverMode::ACTIVE),
            "passive" => Ok(DriverMode::PASSIVE),
            _ => Err(()),
        }
    }
}

#[async_trait]
pub trait Driver {
    async fn set_mode(&mut self, mode: DriverMode) -> Result<(), Box<dyn std::error::Error>>;
    async fn get_mode(&self) -> Result<DriverMode, ()>;
}
