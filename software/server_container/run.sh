#!/bin/bash 

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
if docker ps | grep -q -w server_backend_instance; then
  docker stop server_backend_instance  
  docker rm server_backend_instance  
fi

# Copy dependencies
cp ../utils/hostB.sh ./hostB.tmp

# Build
docker image build . -t server_backend_build

# Cleanup
rm ./hostB.tmp

# Run
docker run \
    --name server_backend_instance \
    --interactive \
    --tty \
    --rm \
    --cap-add=NET_ADMIN \
    --network none \
    "$( if [[ "$INTERACTIVE" = true ]]; then echo "--detach=false"; else echo "--detach=true"; fi )" \
    "$( ../utils/synchronize.sh server_backend_instance mount )" \
    server_backend_build "$@"

if [[ "$INTERACTIVE" = true ]]; then 
  echo ready > /tmp/"$LOCK_NAME"
fi