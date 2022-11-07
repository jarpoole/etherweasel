use spidev::{SpiModeFlags, Spidev, SpidevOptions, SpidevTransfer};
use std::io;

const TLE8108EM_SPI_SCLK_HZ: u32 = 100000;
const TLE8108EM_SPI_MODE: SpiModeFlags = SpiModeFlags::SPI_MODE_1;

pub enum Channel {
    CH1 = 1,
    CH2 = 2,
    CH3 = 3,
    CH4 = 4,
    CH5 = 5,
    CH6 = 6,
    CH7 = 7,
    CH8 = 8,
}
#[derive(Clone, Copy)]
pub enum ChannelMode {
    CLEAR = 0b00,
    INPUT = 0b01,
    ON = 0b10,
    OFF = 0b11,
}

#[derive(Clone, Copy)]
pub enum ChannelDiag {
    OK = 0b11,
    SCB = 0b10,
    OL = 0b01,
    SCG = 0b00,
}
trait ToInt {
    fn to_int(&self) -> u16;
}
impl ToInt for ChannelMode {
    fn to_int(&self) -> u16 {
        *self as u16
    }
}

type Register<T> = [T; 8];
impl<T> std::ops::Index<Channel> for Register<T> {
    type Output = T;
    fn index(&self, channel: Channel) -> &T {
        self.index(channel as usize - 1)
    }
}
impl<T> std::ops::IndexMut<Channel> for Register<T> {
    fn index_mut(&mut self, channel: Channel) -> &mut T {
        self.index_mut(channel as usize - 1)
    }
}
trait Reset<T> {
    fn reset() -> Register<T>;
}
impl Reset<ChannelMode> for Register<ChannelMode> {
    fn reset() -> Self {
        [
            ChannelMode::OFF,
            ChannelMode::OFF,
            ChannelMode::OFF,
            ChannelMode::OFF,
            ChannelMode::OFF,
            ChannelMode::OFF,
            ChannelMode::OFF,
            ChannelMode::OFF,
        ]
    }
}
impl Reset<ChannelDiag> for Register<ChannelDiag> {
    fn reset() -> Self {
        [
            ChannelDiag::OK,
            ChannelDiag::OK,
            ChannelDiag::OK,
            ChannelDiag::OK,
            ChannelDiag::OK,
            ChannelDiag::OK,
            ChannelDiag::OK,
            ChannelDiag::OK,
        ]
    }
}
trait Pack<T> {
    fn pack(&self) -> BinaryRegister;
}
// TLE8108EM SPI interface is little endian
impl<T: ToInt> Pack<T> for Register<T> {
    fn pack(&self) -> BinaryRegister {
        let mut accumulator: u16 = 0;
        for i in 0..8 {
            accumulator += (self[i].to_int()) << i * 2;
        }
        accumulator.to_be_bytes()
    }
}
type BinaryRegister = [u8; 2];
trait Unpack<T> {
    fn unpack(&self) -> Register<T>;
}
impl Unpack<ChannelDiag> for BinaryRegister {
    fn unpack(&self) -> Register<ChannelDiag> {
        // todo(jarpoole)
        //Ok(u16::from_le_bytes(rx_buf))
        Register::<ChannelDiag>::reset()
    }
}

pub struct TLE8108EM {
    spidev: Spidev,
    modes: Register<ChannelMode>,
    diags: Register<ChannelDiag>,
}
impl TLE8108EM {
    pub fn new(path: &str) -> Self {
        let mut spidev = Spidev::open(path).unwrap();
        let options = SpidevOptions::new()
            //.bits_per_word(8)
            .max_speed_hz(TLE8108EM_SPI_SCLK_HZ)
            .mode(TLE8108EM_SPI_MODE)
            .build();
        spidev.configure(&options).unwrap();
        Self {
            spidev,
            modes: Register::<ChannelMode>::reset(),
            diags: Register::<ChannelDiag>::reset(),
        }
    }
    pub fn set_channel(&mut self, channel: Channel, mode: ChannelMode) -> &mut Self {
        self.modes[channel] = mode;
        return self;
    }
    pub fn reset_channels(&mut self) -> &mut Self {
        self.modes = Register::<ChannelMode>::reset();
        return self;
    }
    pub fn update(&mut self) -> io::Result<()> {
        let response = transfer(&mut self.spidev, self.modes.pack())?;
        self.diags = response.unpack();
        Ok(())
    }
}

fn transfer(spi: &mut Spidev, payload: BinaryRegister) -> io::Result<BinaryRegister> {
    println!("SPI TX: 0x{:X}{:X}", payload[1], payload[0]);
    let mut response = [0; 2];
    let mut transfer = SpidevTransfer::read_write(&payload, &mut response);
    spi.transfer(&mut transfer)?;
    println!("SPI RX: 0x{:X}{:X}", response[1], response[0]);
    Ok(response)
}
