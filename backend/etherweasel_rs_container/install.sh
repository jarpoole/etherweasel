#!/bin/bash

echo "Installing..."
if ! command -v redis-cli &> /dev/null; then
    echo "Installing redis..."
    sudo apt install redis -y
fi
echo "Installed"