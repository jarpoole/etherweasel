#!/bin/bash

# Block until test harness is ready
cat /shared/lock

# Configure networking
./configure_networking.sh

# Specify "bind" to start a bind DNS server
if [[ "$*" == *"bind"* ]]; then
    cat /bind/zones >> /etc/bind/named.conf.local
    service named start 
    bash
fi

# Start DNS query loop
if [[ "$*" == *"dig"* ]]; then
    while true; do
        dig @192.168.0.2 sub1.example.local +noedns
        sleep 1;
    done
fi

if [[ "$*" == *"shell"* ]]; then
    bash
fi
