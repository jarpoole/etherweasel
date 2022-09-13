#!/bin/bash 

cd $(dirname $0)

# Extract any flags and pass those through to docker run instead
RUN_ARGS=''
while [[ -n $1 ]]; do
    case $1 in 
        --* ) RUN_ARGS+=" $1"; shift
        ;;
        * ) break
        ;;
    esac
done

# Build
docker image build . -t lens

# Run
docker container run \
    --name lens_instance \
    --interactive \
    --tty \
    --detach \
    --rm \
    --cap-add=NET_ADMIN \
    --network none \
    --volume /tmp/lock1:/tmp/lock1 \
    $RUN_ARGS \
    lens "$@"

