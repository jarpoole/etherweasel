use super::{
    driver::{Driver, DriverMode},
    tle8108em::tle8108em::{Channel, ChannelMode, TLE8108EM},
};
use async_trait::async_trait;
use std::time::Duration;

// EC2-5TNU relay datasheet specifies 2ms operating time
const SWITCHING_TIME_MS: u64 = 10;

const BLUE_ACTIVE: Channel = Channel::CH4;
const BLUE_PASSIVE: Channel = Channel::CH8;
const ORANGE_ACTIVE: Channel = Channel::CH3;
const ORANGE_PASSIVE: Channel = Channel::CH7;
const GREEN_ACTIVE: Channel = Channel::CH2;
const GREEN_PASSIVE: Channel = Channel::CH6;
const BROWN_ACTIVE: Channel = Channel::CH1;
const BROWN_PASSIVE: Channel = Channel::CH5;

pub struct HardwareDriver {
    tle8108em: TLE8108EM,
    mode: DriverMode,
}

impl HardwareDriver {
    pub fn new(path: &str) -> Self {
        Self {
            mode: DriverMode::DISCONNECTED,
            tle8108em: TLE8108EM::new(path),
        }
    }
}

#[async_trait]
impl Driver for HardwareDriver {
    async fn set_mode(&mut self, mode: DriverMode) -> Result<(), Box<dyn std::error::Error>> {
        if mode == DriverMode::ACTIVE {
            self.tle8108em
                .reset_channels()
                .set_channel(BLUE_ACTIVE, ChannelMode::ON)
                .set_channel(ORANGE_ACTIVE, ChannelMode::ON)
                .set_channel(GREEN_ACTIVE, ChannelMode::ON)
                .set_channel(BROWN_ACTIVE, ChannelMode::ON)
                .update()?;
            wait_for_switch().await;
            self.tle8108em.reset_channels().update()?;
            self.mode = DriverMode::ACTIVE;
        } else {
            self.tle8108em
                .reset_channels()
                .set_channel(BLUE_PASSIVE, ChannelMode::ON)
                .set_channel(ORANGE_PASSIVE, ChannelMode::ON)
                .set_channel(GREEN_PASSIVE, ChannelMode::ON)
                .set_channel(BROWN_PASSIVE, ChannelMode::ON)
                .update()?;
            wait_for_switch().await;
            self.tle8108em.reset_channels().update()?;
            self.mode = DriverMode::PASSIVE;
        }
        Ok(())
    }
    async fn get_mode(&self) -> Result<DriverMode, ()> {
        Ok(self.mode)
    }
}

async fn wait_for_switch() {
    sleep(Duration::from_millis(SWITCHING_TIME_MS)).await;
}
