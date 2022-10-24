use super::{
    driver::{Driver, DriverMode},
    tle8108em::tle8108em,
};
use async_trait::async_trait;
use spidev::{SpiModeFlags, Spidev, SpidevOptions, SpidevTransfer};

use std::io;

pub struct HardwareDriver {
    handle: Spidev,
}

impl HardwareDriver {
    pub fn new(path: &str) -> Self {
        let mut handle = Spidev::open(path).unwrap();
        let options = SpidevOptions::new()
            .bits_per_word(8)
            .max_speed_hz(20_000)
            .mode(SpiModeFlags::SPI_MODE_0)
            .build();
        handle.configure(&options).unwrap();
        Self { handle }
    }
}

#[async_trait]
impl Driver for HardwareDriver {
    async fn set_mode(&mut self, mode: DriverMode) -> Result<(), Box<dyn std::error::Error>> {
        tle8108em::set_channel_modes(
            &mut self.handle,
            [
                tle8108em::ChannelMode::ON,
                tle8108em::ChannelMode::ON,
                tle8108em::ChannelMode::ON,
                tle8108em::ChannelMode::ON,
                tle8108em::ChannelMode::ON,
                tle8108em::ChannelMode::ON,
                tle8108em::ChannelMode::ON,
                tle8108em::ChannelMode::ON,
            ],
        );
        tle8108em::wait_for_switch().await;
        Ok(())
    }
    async fn get_mode(&self) -> Result<DriverMode, ()> {
        Ok(DriverMode::DISCONNECTED)
    }
}
