#!/bin/bash 

# Copy dependencies
cd $(dirname $0)
cp ../utils/interface1.sh ./interface1.tmp

# Build
docker image build . -t gui

# Cleanup
rm ./interface1.tmp

# Run
docker container run \
    --name gui_instance \
    --interactive \
    --tty \
    --detach \
    --rm \
    --cap-add=NET_ADMIN \
    --network none \
    --volume /tmp/lock0:/tmp/lock0 \
    --volume /tmp/.X11-unix:/tmp/.X11-unix \
    -e DISPLAY -e WAYLAND_DISPLAY -e XDG_RUNTIME_DIR -e PULSE_SERVER \
    gui