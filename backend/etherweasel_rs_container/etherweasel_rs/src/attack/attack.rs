use async_trait::async_trait;
use erased_serde::Serialize as ErasedSerialize;

#[async_trait]
pub trait Attack {
    fn get_type(&self) -> String;
    fn get_config(&self) -> Box<dyn ErasedSerialize>;
    fn get_logs(&self) -> Vec<Box<dyn ErasedSerialize>>;
    fn start(&mut self) -> ();
    fn stop(&mut self) -> Result<(), Box<dyn std::error::Error>>;
}
