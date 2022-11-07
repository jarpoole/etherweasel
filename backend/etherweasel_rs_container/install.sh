#!/bin/bash

echo "Installing..."
sudo setcap cap_net_raw,cap_net_admin=eip ~/etherweasel_rs
#if ! command -v redis-cli &> /dev/null; then
#    echo "Installing redis..."
#    sudo apt install redis -y
#fi
echo "Installed"