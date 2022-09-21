#!/bin/bash

# Determine the type of test harness to run
if [[ -z "$1" ]]; then
    echo "Type of test not specified"
    exit 1
fi
TESTMODE=$1
shift

# Parse out options if any
MODE=passive
CPU_LIMIT=1
MEMORY_LIMIT=1g
while [[ -n $1 ]]; do
    case $1 in 
        --cpus=* ) CPU_LIMIT="${1#*=}"; 
        ;;
        --memory=* ) MEMORY_LIMIT="${1#*=}";
        ;;
        --active ) MODE=active;
        ;;
        --passive ) MODE=passive;
        ;;
        --layer=* ) LAYER="${1#*=}";
        ;;
        * ) echo Invalid flag; exit 1;
        ;;
    esac
    shift
done

# Create global pipes if they don't already exist
if [[ ! -p /tmp/lock0 ]]; then
    mkfifo /tmp/lock0
fi
if [[ ! -p /tmp/lock1 ]]; then
    mkfifo /tmp/lock1
fi
if [[ ! -p /tmp/lock2 ]]; then
    mkfifo /tmp/lock2
fi

# Remove all previous containers
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)


if [[ $TESTMODE = "http" ]]; then
    # Build and run
    ./gui_container/run.sh
    ./lens_container/run.sh "load http_replace.py" "driver active"
    ./server_container/run.sh web
    # Setup networking
    ./utils/network.sh gui_instance lens_instance server_instance
    # Setup X11 forwarding
    xhost +si:localuser:testharness
    # Notifies containers that test harness is ready
    echo ready > /tmp/lock0
    echo ready > /tmp/lock1
    echo ready > /tmp/lock2
    # Attach
    docker container attach lens_instance

elif [[ $TESTMODE = "video" ]]; then
    # Build and run
    ./gui_container/run.sh
    ./lens_container/run.sh "driver active"
    ./server_container/run.sh video
    # Setup networking
    ./utils/network.sh gui_instance lens_instance server_instance
    # Setup X11 forwarding
    xhost +si:localuser:testharness
    # Notifies containers that test harness is ready
    echo ready > /tmp/lock0
    echo ready > /tmp/lock1
    echo ready > /tmp/lock2
    # Attach
    docker container attach lens_instance

elif [[ $TESTMODE = "iperf" ]]; then
    # Build and run
    ./iperf_container/run.sh
    ./lens_container/run.sh --cpus=$CPU_LIMIT --memory=$MEMORY_LIMIT "driver $MODE" "$( if [[ ! -z $LAYER ]]; then echo "layer$LAYER.py"; fi )"
    ./server_container/run.sh iperf
    # Setup networking
    ./utils/network.sh iperf_instance lens_instance server_instance
    # Notifies containers that test harness is ready
    echo ready > /tmp/lock0
    echo ready > /tmp/lock1
    echo ready > /tmp/lock2
    # Wait for results
    docker wait iperf_instance
fi
