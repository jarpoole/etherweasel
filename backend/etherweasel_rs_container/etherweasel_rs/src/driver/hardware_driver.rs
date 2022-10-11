use super::driver::{Driver, DriverMode};
use async_trait::async_trait;

pub struct HardwareDriver {}

#[async_trait]
impl Driver for HardwareDriver {
    async fn set_mode(&self, mode: DriverMode) -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }
    async fn get_mode(&self) -> Result<DriverMode, ()> {
        Ok(DriverMode::DISCONNECTED)
    }
}
