use spidev::{SpiModeFlags, Spidev, SpidevOptions, SpidevTransfer};
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
pub enum ChannelDiag {
    OK = 0b11,
    SCB = 0b10,
    OL = 0b01,
    SCG = 0b00,
}
pub struct ChannelStates<T> {
    ch1: T,
    ch2: T,
    ch3: T,
    ch4: T,
    ch5: T,
    ch6: T,
    ch7: T,
    ch8: T,
}
impl<T> ChannelStates<T> {
    pub fn reset() -> Self {
        Self {ch1: ChannelMode::OFF,
        ch2: ChannelMode::OFF,
        ch3: ChannelMode::OFF,
        ch4: ChannelMode::OFF,
        ch5: ChannelMode::OFF,
        ch6: ChannelMode::OFF,
        ch7: ChannelMode::OFF,
        ch8: ChannelMode::OFF,
        }
    }
}

pub struct TLE8108EM {
    spidev: Spidev,
    modes: ChannelStates<ChannelMode>,
    diags: ChannelStates<ChannelDiag>,
}
impl TLE8108EM {
    pub fn new(path: &str) -> Self {
        let mut spidev = Spidev::open(path).unwrap();
        let options = SpidevOptions::new()
            .bits_per_word(8)
            .max_speed_hz(20_000)
            .mode(SpiModeFlags::SPI_MODE_0)
            .build();
        spidev.configure(&options).unwrap();
        Self { spidev, modes: {
            ch1: ChannelMode.OFF
        }}
    }
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
