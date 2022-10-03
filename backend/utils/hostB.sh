#!/bin/bash

# Required dependencies from apt
#  - iproute2
#  - net-tools 
#  - ethtool

ip link set dev ethserver address AA:BB:CC:DD:EE:02
ip addr add 192.168.0.2/32 dev ethserver
arp -i ethserver -s 192.168.0.1 AA:BB:CC:DD:EE:01
route add 192.168.0.1 dev ethserver
ethtool -K ethserver tx off rx off