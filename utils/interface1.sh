#!/bin/bash

# Required dependencies
#  - iproute2
#  - net-tools 
#  - ethtool

ip link set dev ethclient address AA:BB:CC:DD:EE:01
ip addr add 192.168.0.1/32 dev ethclient
arp -i ethclient -s 192.168.0.2 AA:BB:CC:DD:EE:02
route add 192.168.0.2 dev ethclient
ethtool -K ethclient tx off rx off
