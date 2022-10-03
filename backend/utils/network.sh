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

ip link add ethmitm1 type veth peer name ethhosta
ip link add ethmitm2 type veth peer name ethhostb

ip link set ethhosta up
ip link set ethmitm1 up
ip link set ethmitm2 up
ip link set ethhostb up

ip link set ethhosta netns "$HOST_A_DOCKER_INSTANCE"
ip link set ethmitm1 netns "$MITM_DOCKER_INSTANCE"
ip link set ethmitm2 netns "$MITM_DOCKER_INSTANCE"
ip link set ethhostb netns "$HOST_B_DOCKER_INSTANCE"

ip netns exec "$HOST_A_DOCKER_INSTANCE" ip link set ethhosta up
ip netns exec "$MITM_DOCKER_INSTANCE" ip link set ethmitm1 up
ip netns exec "$MITM_DOCKER_INSTANCE" ip link set ethmitm2 up
ip netns exec "$HOST_B_DOCKER_INSTANCE" ip link set ethhostb up