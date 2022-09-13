#!/bin/bash 

#RTSP_SIMPLE_SERVER=v0.17.17
#wget https://github.com/aler9/rtsp-simple-server/releases/download/"$RTSP_SIMPLE_SERVER"/rtsp-simple-server_"$RTSP_SIMPLE_SERVER"_linux_amd64.tar.gz
#tar -xzvf rtsp-simple-server_"$RTSP_SIMPLE_SERVER"_linux_amd64.tar.gz

cd $(dirname $0)

# Copy dependencies
cp ../utils/interface2.sh ./interface2.tmp

# Build
docker image build . -t server

# Cleanup
rm ./interface2.tmp

# Run
docker run \
    --name server_instance \
    --interactive \
    --tty \
    --detach \
    --rm \
    --cap-add=NET_ADMIN \
    --network none \
    --volume /tmp/lock2:/tmp/lock2 \
    server "$@"