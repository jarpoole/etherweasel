use async_trait::async_trait;

#[derive(Debug, Eq, PartialEq)]
pub enum DriverMode {
    DISCONNECTED, // Default
    ACTIVE,
    PASSIVE,
}

#[async_trait]
pub trait Driver {
    async fn set_mode(&self, mode: DriverMode) -> Result<(), Box<dyn std::error::Error>>;
    async fn get_mode(&self) -> Result<DriverMode, ()>;
}
