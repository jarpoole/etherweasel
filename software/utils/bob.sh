#!/bin/bash

# Required dependencies from apt
#  - iproute2
#  - net-tools 
#  - ethtool

ip link set dev ethhostB address AA:BB:CC:DD:EE:02
ip addr add 192.168.0.2/32 dev ethhostB
arp -i ethhostB -s 192.168.0.1 AA:BB:CC:DD:EE:01
route add 192.168.0.1 dev ethhostB
ethtool -K ethhostB tx off rx off