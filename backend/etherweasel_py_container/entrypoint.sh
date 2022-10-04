#!/bin/bash

# Block until test harness is ready
cat /tmp/lock1

# Create taps
mkdir /dev/net
mknod /dev/net/tun c 10 200
ip tuntap add name tap0 mode tap
ip tuntap add name tap1 mode tap
ip link set dev tap0 up
ip link set dev tap1 up

# Create briges
ip link add name br0 type bridge
ip link add name br1 type bridge
ip link add name br2 type bridge
ip link set dev br0 up
ip link set dev br1 up
ip link set dev br2 up

# Enable promiscuous mode
ip link set ethlens1 promisc on
ip link set ethlens2 promisc on

python3 ./lens.py "$@"