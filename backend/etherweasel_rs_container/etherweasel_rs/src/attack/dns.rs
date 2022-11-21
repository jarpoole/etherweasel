use erased_serde::Serialize as ErasedSerialize;
use pcap::Capture;
use serde::Serialize;
use tokio::task::spawn_blocking;
use tracing::info;

use super::attack::Attack;

pub struct Dns {
    pub interface1: String,
    pub interface2: String,
}

#[derive(Serialize)]
struct DnsPacket {
    foo: u32,
}

impl Attack for Dns {
    fn get_logs(&self) -> Vec<Box<dyn ErasedSerialize>> {
        vec![Box::new(DnsPacket { foo: 0 })]
    }
    fn start(&mut self) {
        let modifier = |rx_interface: String, tx_interface: String| {
            move || {
                info!("started DNS modification attack worker thread");
                let mut rx_pcap = Capture::from_device(rx_interface.as_str())
                    .unwrap()
                    .immediate_mode(true)
                    .open()
                    .unwrap();
                let mut tx_pcap = Capture::from_device(tx_interface.as_str())
                    .unwrap()
                    .immediate_mode(true)
                    .open()
                    .unwrap();
                loop {
                    while let Ok(packet) = rx_pcap.next_packet() {
                        tx_pcap.sendpacket(packet.data);
                    }
                }
            }
        };
        spawn_blocking(modifier(self.interface1.clone(), self.interface2.clone()));
        spawn_blocking(modifier(self.interface2.clone(), self.interface1.clone()));
        ()
    }
    fn stop(&mut self) {}
}
