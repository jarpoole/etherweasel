use super::driver::{Driver, DriverMode};
use async_trait::async_trait;

pub struct MockDriver {
    mode: DriverMode,
}

impl MockDriver {
    pub fn new() -> Self {
        Self {
            mode: DriverMode::DISCONNECTED,
        }
    }
}

#[async_trait]
impl Driver for MockDriver {
    async fn set_mode(&mut self, mode: DriverMode) -> Result<(), Box<dyn std::error::Error>> {
        self.mode = mode;
        Ok(())
    }
    async fn get_mode(&self) -> Result<DriverMode, ()> {
        Ok(self.mode)
    }
}
