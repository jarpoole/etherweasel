#!/bin/bash

# Parse arguments
PASSWORD=password
HOST=jarpoole@192.168.100.15
while [[ -n $1 ]]; do
    case $1 in 
        --password=* ) PASSWORD="${1#*=}"; shift
        ;;
        --host=* ) HOST="${1#*=}"; shift
        ;;
        -- | * ) shift; break
        ;;
    esac
done

echo "Build..."

RASPI_TARGET=aarch64-unknown-linux-gnu
cross build \
--manifest-path=./etherweasel_rs/Cargo.toml \
--target $RASPI_TARGET --release

echo "Copy..."

sshpass -p "$PASSWORD" rsync ./etherweasel_rs/target/$RASPI_TARGET/release/etherweasel_rs "$HOST":/tmp/etherweasel_rs

echo "Install..."

sshpass -p "$PASSWORD" ssh -T "$HOST" << EOF1
sudo cp /tmp/etherweasel_rs /usr/bin/etherweasel_rs

sudo raspi-config nonint do_spi 0

sudo apt-get install -y libpcap-dev
sudo setcap cap_net_raw,cap_net_admin=eip /usr/bin/etherweasel_rs

sudo cat << EOF2 | sudo tee /lib/systemd/system/etherweasel_rs.service
[Unit]
Description=Etherweasel
After=multi-user.target

[Service]
Type=idle
ExecStart=/usr/bin/etherweasel_rs --driver=hardware --interfaces=eth1,eth2 --mode=passive

[Install]
WantedBy=multi-user.target
EOF2

sudo chmod 644 /lib/systemd/system/etherweasel_rs.service
sudo systemctl daemon-reload
sudo systemctl enable etherweasel_rs.service
sudo systemctl start etherweasel_rs.service
EOF1

echo "Installed. Reboot to apply changes..."