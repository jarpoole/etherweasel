#!/bin/bash

HOST_A_DOCKER_INSTANCE=$1
MITM_DOCKER_INSTANCE=$2
HOST_B_DOCKER_INSTANCE=$3

HOST_A_PID=$(docker inspect -f '{{.State.Pid}}' "$HOST_A_DOCKER_INSTANCE")
MITM_PID=$(docker inspect -f '{{.State.Pid}}' "$MITM_DOCKER_INSTANCE")
HOST_B_PID=$(docker inspect -f '{{.State.Pid}}' "$HOST_B_DOCKER_INSTANCE")
mkdir -p /var/run/netns/
ln -sf /proc/"$HOST_A_PID"/ns/net /var/run/netns/"$HOST_A_DOCKER_INSTANCE"
ln -sf /proc/"$MITM_PID"/ns/net /var/run/netns/"$MITM_DOCKER_INSTANCE"
ln -sf /proc/"$HOST_B_PID"/ns/net /var/run/netns/"$HOST_B_DOCKER_INSTANCE"

ip link add ethmitmA type veth peer name ethhostA
ip link add ethmitmB type veth peer name ethhostB

ip link set ethhostA up
ip link set ethmitmA up
ip link set ethmitmB up
ip link set ethhostB up

ip link set ethhostA netns "$HOST_A_DOCKER_INSTANCE"
ip link set ethmitmA netns "$MITM_DOCKER_INSTANCE"
ip link set ethmitmB netns "$MITM_DOCKER_INSTANCE"
ip link set ethhostB netns "$HOST_B_DOCKER_INSTANCE"

ip netns exec "$HOST_A_DOCKER_INSTANCE" ip link set ethhostA up
ip netns exec "$MITM_DOCKER_INSTANCE" ip link set ethmitmA up
ip netns exec "$MITM_DOCKER_INSTANCE" ip link set ethmitmB up
ip netns exec "$HOST_B_DOCKER_INSTANCE" ip link set ethhostB up