#!/bin/bash

# Block until test harness is ready
cat /tmp/lock0

# Configure networking
./interface1.sh

# Run the test
iperf3 -c 192.168.0.2 -p 5555 -J > /shared/results.json