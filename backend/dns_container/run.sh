#!/bin/bash 

# Copy dependencies
cd $(dirname $0)

INTERACTIVE=false
while [[ -n $1 ]]; do
    case $1 in 
        -i | --interactive ) INTERACTIVE=true; shift
        ;;
        * ) break
        ;;
    esac
done

# Stop (if needed)
if docker ps | grep -q -w dns_backend_instance; then
  docker stop dns_backend_instance  
  docker rm dns_backend_instance  
fi

# Queue the unlock if running interactively
if [[ "$INTERACTIVE" = true ]]; then 
  ../utils/synchronize.sh dns_backend_instance notify &
fi

# Copy dependencies
cp ../utils/hostA.sh ./hostA.tmp

# Build
docker image build . -t dns_backend_build

# Cleanup
rm ./hostA.tmp

# Run
docker container run \
    --name dns_backend_instance \
    --interactive \
    --tty \
    --rm \
    --cap-add=NET_ADMIN \
    --network none \
    "$( if [[ "$INTERACTIVE" = true ]]; then echo "--detach=false"; else echo "--detach=true"; fi )" \
    "$( ../utils/synchronize.sh dns_backend_instance mount )" \
    dns_backend_build