#!/bin/bash

# A collection of primitives to facilitate synchronization
# between a container and a host

if [[ "$#" != 2 ]]; then
    echo "Wrong number of arguments"
    exit 1
fi
CONTAINER_NAME=$1
MODE=$2

# Create shared volume if needed 
if ! docker volume ls | grep -q -w "${CONTAINER_NAME}_shared"; then
  docker volume create "${CONTAINER_NAME}_shared"
fi
# Create a lock if needed
SHARED_PATH_ON_HOST=$(docker volume inspect "${CONTAINER_NAME}_shared" | jq -r .[0].Mountpoint)
if [[ ! -p "$SHARED_PATH_ON_HOST/lock" ]]; then
  mkfifo "$SHARED_PATH_ON_HOST/lock" 
fi

if [[ $MODE = 'wait' ]]; then
  cat /shared/lock
  exit 0
fi

if [[ $MODE = 'notify' ]]; then
  echo ready > "$SHARED_PATH_ON_HOST/lock"
  exit 0
fi

if [[ $MODE = 'mount' ]]; then
  echo "--mount=source=${CONTAINER_NAME}_shared,destination=/shared"
  exit 0
fi