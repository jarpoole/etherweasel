use super::driver::{Driver, DriverMode};
use async_trait::async_trait;
use futures::stream::TryStreamExt;
use rtnetlink::{new_connection, Error, Handle};

pub struct DockerDriver {
    mode: DriverMode,
}

impl DockerDriver {
    pub fn new() -> Self {
        Self {
            mode: DriverMode::DISCONNECTED,
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
            set_interface_master(&handle, "ethmitmA", "brA").await?;
            set_interface_master(&handle, "tapA", "brA").await?;
            // Bridge veth and tap B
            set_interface_master(&handle, "ethmitmB", "brB").await?;
            set_interface_master(&handle, "tapB", "brB").await?;
            // Bring both taps up
            set_interface_up(&handle, "tabA").await?;
            set_interface_up(&handle, "tabB").await?;
            // Update the local state
            self.mode = DriverMode::ACTIVE;
        } else {
            set_interface_nomaster(&handle, "tapA").await?;
            set_interface_nomaster(&handle, "tapB").await?;
            set_interface_master(&handle, "ethmitmA", "brAB").await?;
            set_interface_master(&handle, "ethmitmB", "brAB").await?;
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
