use super::driver::{Driver, DriverMode};
use async_trait::async_trait;
use futures::stream::TryStreamExt;
use rtnetlink::{new_connection, Error, Handle};

pub struct DockerDriverConfig {
    pub ethernet_a: &'static str,
    pub ethernet_b: &'static str,
    pub interface_a: &'static str,
    pub interface_b: &'static str,
    pub bridge_a: &'static str,
    pub bridge_b: &'static str,
    pub bridge_ab: &'static str,
}

pub struct DockerDriver {
    config: DockerDriverConfig,
    mode: DriverMode,
}

impl DockerDriver {
    pub fn new(config: DockerDriverConfig) -> Self {
        Self {
            mode: DriverMode::DISCONNECTED,
            config,
        }
    }
}

#[async_trait]
impl Driver for DockerDriver {
    async fn set_mode(&mut self, mode: DriverMode) -> Result<(), Box<dyn std::error::Error>> {
        // Setup
        let (connection, handle, _) = new_connection().unwrap();
        let task = tokio::spawn(connection);

        if mode == DriverMode::ACTIVE {
            // Bridge veth and tap A
            set_interface_master(&handle, self.config.ethernet_a, self.config.bridge_a).await?;
            set_interface_master(&handle, self.config.interface_a, self.config.bridge_a).await?;
            // Bridge veth and tap B
            set_interface_master(&handle, self.config.ethernet_b, self.config.bridge_b).await?;
            set_interface_master(&handle, self.config.interface_b, self.config.bridge_b).await?;
            // Bring both taps up
            set_interface_up(&handle, self.config.interface_a).await?;
            set_interface_up(&handle, self.config.interface_b).await?;
            // Update the local state
            self.mode = DriverMode::ACTIVE;
        } else {
            set_interface_nomaster(&handle, self.config.interface_a).await?;
            set_interface_nomaster(&handle, self.config.interface_b).await?;
            set_interface_master(&handle, self.config.ethernet_a, self.config.bridge_ab).await?;
            set_interface_master(&handle, self.config.ethernet_b, self.config.bridge_ab).await?;
            self.mode = DriverMode::PASSIVE;
        }

        // Cleanup
        task.abort();
        Ok(())
    }
    async fn get_mode(&self) -> Result<DriverMode, ()> {
        Ok(self.mode)
    }
}

async fn set_interface_master(handle: &Handle, interface: &str, master: &str) -> Result<(), Error> {
    let interface_index = get_interface_index(&handle, interface).await?;
    let master_index = get_interface_index(&handle, master).await?;
    handle
        .link()
        .set(interface_index)
        .master(master_index)
        .execute()
        .await?;
    Ok(())
}

async fn set_interface_up(handle: &Handle, interface: &str) -> Result<(), Error> {
    let interface_index = get_interface_index(&handle, interface).await?;
    handle.link().set(interface_index).up().execute().await?;
    Ok(())
}

async fn set_interface_nomaster(handle: &Handle, interface: &str) -> Result<(), Error> {
    let interface_index = get_interface_index(&handle, interface).await?;
    handle
        .link()
        .set(interface_index)
        .nomaster()
        .execute()
        .await?;
    Ok(())
}

async fn get_interface_index(handle: &Handle, name: &str) -> Result<u32, Error> {
    let response = handle
        .link()
        .get()
        .match_name(name.to_string().clone())
        .execute()
        .try_next()
        .await?
        .ok_or(Error::RequestFailed)?;
    Ok(response.header.index)
}
