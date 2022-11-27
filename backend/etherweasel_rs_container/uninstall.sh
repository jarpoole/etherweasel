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

echo "Uninstalling..."

sshpass -p "$PASSWORD" ssh -T "$HOST" << EOF
sudo systemctl stop etherweasel_rs.service
sudo rm /lib/systemd/system/etherweasel_rs.service
sudo systemctl daemon-reload
EOF

echo "Uninstalled"