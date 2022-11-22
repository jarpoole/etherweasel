#!/bin/bash

# Block until launch script is ready
cat /shared/lock

# Create taps
mkdir /dev/net
mknod /dev/net/tun c 10 200
ip tuntap add name tapA mode tap
ip tuntap add name tapB mode tap
ip link set dev tapA up
ip link set dev tapB up

# Create briges
ip link add name brA type bridge
ip link add name brB type bridge
ip link add name brAB type bridge
ip link set dev brA up
ip link set dev brB up
ip link set dev brAB up

# Enable promiscuous mode
ip link set ethmitmA promisc on
ip link set ethmitmB promisc on

service redis-server start
RUST_BACKTRACE=1 cargo run -- "$@" & 
bash