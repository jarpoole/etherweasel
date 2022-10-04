#!/bin/bash

# Required dependencies
#  - iproute2
#  - net-tools 
#  - ethtool

ip link set dev ethhostA address AA:BB:CC:DD:EE:01
ip addr add 192.168.0.1/32 dev ethhostA
arp -i ethhostA -s 192.168.0.2 AA:BB:CC:DD:EE:02
route add 192.168.0.2 dev ethhostA
ethtool -K ethhostA tx off rx off
