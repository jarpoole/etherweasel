#!/bin/bash

set -e

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

# Install local dependencies for cross architecture build
sudo apt install -y binfmt-support
sudo apt install -y qemu-user-static 

# Install target dependencies
sshpass -p "$PASSWORD" ssh -t "$HOST" sudo apt install -y docker.io

# Build the container
docker buildx build -f Dockerfile.raspi . -t frontend_prod_image

echo "Copy..."

docker save frontend_prod_image | bzip2 | sshpass -p "$PASSWORD" ssh "$HOST" sudo docker load

echo "Install..."

sshpass -p "$PASSWORD" ssh -T "$HOST" << EOF

sudo docker ps -aq | xargs sudo docker update --restart no | xargs sudo docker stop | xargs sudo docker rm
sudo docker run \
    --name etherweasel_ui_instance \
    --restart always \
    -p 80:80 \
    --detach \
    frontend_prod_image 
EOF

echo "Configure Networking..."

# Configure static IP addresses for both interfaces
sshpass -p "$PASSWORD" ssh -T "$HOST" << EOF1
sudo cat << EOF2 | sudo tee /etc/dhcpcd.conf
interface eth0
static ip_address=192.168.100.15/24
static routers=192.168.100.1
static domain_name_servers=192.168.100.1
interface wlan0
static ip_address=192.168.1.1/24
EOF2
EOF1

# Configure the Wi-Fi region to define the allowable channels
sshpass -p "$PASSWORD" ssh -t "$HOST" sudo raspi-config nonint do_wifi_country CA

# Install and configure the Wi-Fi access point service 
# 
# Note that sometimes the hostapd service tries to start before
# the Wi-Fi interface is up and fails. We can use cron to restart
# it after a few seconds
sshpass -p "$PASSWORD" ssh -T "$HOST" << EOF1
sudo apt install -y hostapd
sudo systemctl stop hostapd

sudo cat << EOF2 | sudo tee /etc/hostapd/hostapd.conf
interface=wlan0
driver=nl80211
ssid=EtherWeasel
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=password
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF2

sudo cat << EOF2 | sudo tee /etc/default/hostapd
DAEMON_CONF="/etc/hostapd/hostapd.conf"
EOF2

echo '@reboot sleep 30 && systemctl stop hostapd && systemctl start hostapd' | sudo crontab -
EOF1

# Install and configure a DHCP server so that clients get IP
# addresses when they connect 
sshpass -p "$PASSWORD" ssh -T "$HOST" << EOF1
sudo apt install -y dnsmasq
sudo cat << EOF2 | sudo tee /etc/dnsmasq.conf
interface=wlan0
dhcp-range=192.168.1.10,192.168.1.100,255.255.255.0,1h
EOF2
EOF1

sshpass -p "$PASSWORD" ssh -T "$HOST" << EOF1
sudo service dhcpcd restart
sudo systemctl start dnsmasq
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
EOF1

echo "Installed"