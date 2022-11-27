#!/bin/bash

# This script launches etherweasel_rs in a docker container in one of two modes
#  1. Interactive mode
#      - Attached to shell in container
#  2. Headless mode (Non-blocking, useful for automated testing)
#      

set -e
cd $(dirname $0)

# Define colors used for console output
GREEN='\033[0;32m'  # Define succesful green color
YELLOW='\033[0;33m' # Define warning yellow color
RED='\033[0;31m'    # Define error red color
NC='\033[0m'        # Define no color

# Parse parameters
TARGET=$1
shift
TARGETS=("local" "docker" "raspi")
if [[ ! "${TARGETS[*]}" =~ (^|[[:space:]])"$TARGET"($|[[:space:]]) ]]; then
  echo -e "${RED}Invalid target${NC}"
  echo -e "${RED}Valid targets: ${TARGETS[*]}${NC}"
fi

# Parse arguments
INTERACTIVE=false
TRACE=0
CPU_LIMIT=2
MEMORY_LIMIT=1g
PASSWORD=password
HOST=jarpoole@192.168.100.15
while [[ -n $1 ]]; do
    case $1 in 
        -i | --interactive ) INTERACTIVE=true; shift
        ;;
        -t | --trace ) TRACE=1; shift
        ;;
        --cpus=* ) CPU_LIMIT="${1#*=}"; shift 
        ;;
        --memory=* ) MEMORY_LIMIT="${1#*=}"; shift
        ;;
        --password=* ) PASSWORD="${1#*=}"; shift
        ;;
        --host=* ) HOST="${1#*=}"; shift
        ;;
        -- | * ) shift; break
        ;;
    esac
done

if [[ $TARGET = "docker" ]]; then
  if [[ $(whoami) != "root" ]]; then
    echo -e "${RED}Must be root${NC}"
    exit 1;
  fi

  # Stop if needed
  if docker ps | grep -q -w etherweasel_rs_backend_instance; then
    echo -e "${YELLOW}Killing old container${NC}"
    docker stop etherweasel_rs_backend_instance  
    docker rm etherweasel_rs_backend_instance  
  fi

  # Queue the unlock if running interactively
  if [[ "$INTERACTIVE" = true ]]; then 
    ../utils/synchronize.sh etherweasel_rs_backend_instance notify &
  fi

  # Build
  docker image build . -t etherweasel_rs_backend_build
  echo -e "${GREEN}Build successful${NC}"

  # Run
  docker container run \
      --name etherweasel_rs_backend_instance \
      --interactive \
      --tty \
      --rm \
      --cap-add=NET_ADMIN \
      --publish 3000:3000 \
      --network bridge \
      --cpus="$CPU_LIMIT" \
      --memory="$MEMORY_LIMIT" \
      "$( if [[ "$INTERACTIVE" = true ]]; then echo "--detach=false"; else echo "--detach=true"; fi )" \
      "$( ../utils/synchronize.sh etherweasel_rs_backend_instance mount )" \
      etherweasel_rs_backend_build --driver=docker "$@"
fi

if [[ $TARGET = "local" ]]; then
  cargo run --manifest-path=./etherweasel_rs/Cargo.toml -- "$@"
fi

if [[ $TARGET = "raspi" ]]; then
  # Cross compile in release mode for raspberry pi
  # We need to to use cross-rs here to make sure GLIBC matches
  RASPI_TARGET=aarch64-unknown-linux-gnu
  cross build \
    --manifest-path=./etherweasel_rs/Cargo.toml \
    --target $RASPI_TARGET --release
  # Transfer the binary
  sshpass -p "$PASSWORD" rsync ./etherweasel_rs/target/$RASPI_TARGET/release/etherweasel_rs "$HOST":~/etherweasel_rs
  # Install dependencies and run the binary
  sshpass -p "$PASSWORD" ssh -t "$HOST" "sudo apt install libpcap-dev"
  sshpass -p "$PASSWORD" ssh -t "$HOST" "sudo setcap cap_net_raw,cap_net_admin=eip ~/etherweasel_rs"
  sshpass -p "$PASSWORD" ssh -t "$HOST" RUST_BACKTRACE=1 ~/etherweasel_rs --driver=hardware --interfaces=eth1,eth2 -vv "$@"
fi
