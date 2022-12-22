#!/bin/bash 

cd $(dirname $0)

# Determine the type of test harness to run
if [[ -z "$1" ]]; then
    echo "Type of test not specified"
    exit 1
fi
TESTMODE=$1
shift

# Parse out options if any
INTERACTIVE=false
MODE=passive
CPU_LIMIT=1
MEMORY_LIMIT=1g
while [[ -n $1 ]]; do
    case $1 in 
        -i | --interactive ) INTERACTIVE=true; shift
        ;;
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
if [[ ! -p /tmp/hosta_lock ]]; then
    mkfifo /tmp/hosta_lock
fi
if [[ ! -p /tmp/mitm_lock ]]; then
    mkfifo /tmp/mitm_lock
fi
if [[ ! -p /tmp/hostb_lock ]]; then
    mkfifo /tmp/hostb_lock
fi

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

elif [[ $TESTMODE = "dns" ]]; then
    # Build and run
    ./dns_container/run.sh --name=alice -- dig
    ./etherweasel_rs_container/run.sh docker -- --mode=active --interfaces=ethmitmA,ethmitmB -v
    ./dns_container/run.sh --name=bob -- bind
    # Setup networking
    ./utils/network.sh \
        alice_dns_instance \
        etherweasel_rs_backend_instance \
        bob_dns_instance
    # Notifies containers that test harness is ready
    ./utils/synchronize.sh alice_dns_instance notify
    ./utils/synchronize.sh etherweasel_rs_backend_instance notify
    ./utils/synchronize.sh bob_dns_instance notify
    # Wait for results
    if [[ "$INTERACTIVE" = true ]]; then
      docker container attach etherweasel_rs_backend_instance
    fi
fi