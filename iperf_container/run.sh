#!/bin/bash 

# Copy dependencies
cd $(dirname $0)
cp ../utils/interface1.sh ./interface1.tmp

# Build
docker image build . -t iperf

# Cleanup
rm ./interface1.tmp

# Run
docker container run \
    --name iperf_instance \
    --interactive \
    --tty \
    --detach \
    --rm \
    --cap-add=NET_ADMIN \
    --network none \
    --volume /tmp/lock0:/tmp/lock0 \
    --volume $(pwd)/shared:/shared \
    iperf