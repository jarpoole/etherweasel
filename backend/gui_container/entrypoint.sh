#!/bin/bash

# Block until test harness is ready
cat /tmp/lock0

# Configure networking
./interface1.sh

# Create a new user and log into it. This is required because
# most GUI apps will refuse to run as root.
adduser --disabled-password --gecos "" testharness
su testharness

# Launch a new shell for demos
bash

# Common demo commands
#    firefox -private 192.168.0.2
#    vlc --no-qt-privacy-ask --no-audio rtp://@192.168.0.1:51234
#    ffplay -rtsp_transport udp rtsp://192.168.0.2:8554/stream
