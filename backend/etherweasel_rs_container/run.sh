#!/bin/bash

# This script launches etherweasel_rs in a docker container in one of two modes
#  1. Interactive mode
#      - Attached to shell in container
#  2. Headless mode (Non-blocking, useful for automated testing)
#      

cd $(dirname $0)

INTERACTIVE=false
CPU_LIMIT=2
MEMORY_LIMIT=1g
LOCK_NAME=lock
while [[ -n $1 ]]; do
    case $1 in 
        -i | --interactive ) INTERACTIVE=true; shift
        ;;
        --cpus=* ) CPU_LIMIT="${1#*=}"; shift 
        ;;
        --memory=* ) MEMORY_LIMIT="${1#*=}"; shift
        ;;
        --lock=* ) LOCK_NAME="${1#*=}"; shift
        ;;
        * ) break
        ;;
    esac
done

# Stop (if needed)
if docker ps | grep -q -w etherweasel_rs_backend_instance; then
  docker stop etherweasel_rs_backend_instance  
  docker rm etherweasel_rs_backend_instance  
fi

# Build
docker image build . -t etherweasel_rs_backend_build

# Run
docker container run \
    --name etherweasel_rs_backend_instance \
    --interactive \
    --tty \
    "$( if [[ "$INTERACTIVE" = true ]]; then echo "--detach=false"; else echo "--detach=true"; fi )" \
    --rm \
    --cap-add=NET_ADMIN \
    --volume /tmp/"$LOCK_NAME":/tmp/lock \
    --publish 3000:3000 \
    --network bridge \
    --cpus="$CPU_LIMIT" \
    --memory="$MEMORY_LIMIT" \
    etherweasel_rs_backend_build "$@"

if [[ "$INTERACTIVE" = true ]]; then 
  echo ready > /tmp/"$LOCK_NAME"
fi