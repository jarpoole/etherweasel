#!/bin/bash

# Block until test harness is ready
cat /shared/lock

# Configure networking
./configure_networking.sh

bash