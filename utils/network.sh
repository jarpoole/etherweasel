#!/bin/bash

CLIENT=$1
LENS=$2
SERVER=$3

CLIENTPID=$(docker inspect -f '{{.State.Pid}}' $CLIENT)
LENSPID=$(docker inspect -f '{{.State.Pid}}' $LENS)
SERVERPID=$(docker inspect -f '{{.State.Pid}}' $SERVER)
sudo mkdir -p /var/run/netns/
sudo ln -sf /proc/$CLIENTPID/ns/net /var/run/netns/$CLIENT
sudo ln -sf /proc/$LENSPID/ns/net /var/run/netns/$LENS
sudo ln -sf /proc/$SERVERPID/ns/net /var/run/netns/$SERVER

sudo ip link add ethlens1 type veth peer name ethclient
sudo ip link add ethlens2 type veth peer name ethserver

ip link set ethclient up
ip link set ethlens1 up
ip link set ethlens2 up
ip link set ethserver up

sudo ip link set ethclient netns $CLIENT
sudo ip link set ethlens1 netns $LENS
sudo ip link set ethlens2 netns $LENS
sudo ip link set ethserver netns $SERVER

sudo ip netns exec $CLIENT ip link set ethclient up
sudo ip netns exec $LENS ip link set ethlens1 up
sudo ip netns exec $LENS ip link set ethlens2 up
sudo ip netns exec $SERVER ip link set ethserver up