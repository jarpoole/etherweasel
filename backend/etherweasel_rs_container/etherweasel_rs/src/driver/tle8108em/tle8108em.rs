use spidev::{Spidev, SpidevTransfer};
use std::io;
use std::time::Duration;
use tokio::time::sleep;

const SWITCHING_TIME_MS: u64 = 500;

pub enum ChannelMode {
    CLEAR = 0b00,
    INPUT = 0b01,
    ON = 0b10,
    OFF = 0b11,
}

pub enum ChannelState {
    OK = 0b11,
    SCB = 0b10,
    OL = 0b01,
    SCG = 0b00,
}

pub async fn wait_for_switch() {
    sleep(Duration::from_millis(SWITCHING_TIME_MS)).await;
}

pub fn set_channel_modes(spi: &mut Spidev, modes: [ChannelMode; 8]) -> io::Result<u16> {
    transfer(spi, 0xAA00)
}

// TLE8108EM SPI interface is little endian
fn transfer(spi: &mut Spidev, payload: u16) -> io::Result<u16> {
    let tx_buf = payload.to_le_bytes();
    let mut rx_buf = [0; 2];

    println!("TX: {:?}", tx_buf);
    let mut transfer = SpidevTransfer::read_write(&tx_buf, &mut rx_buf);
    spi.transfer(&mut transfer)?;
    println!("RX: {:?}", rx_buf);

    Ok(u16::from_le_bytes(rx_buf))
}
