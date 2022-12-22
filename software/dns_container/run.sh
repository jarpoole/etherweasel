#!/bin/bash 

cd "$(dirname "$0")"

# Define colors used for console output
GREEN='\033[0;32m'  # Define succesful green color
YELLOW='\033[0;33m' # Define warning yellow color
RED='\033[0;31m'    # Define error red color
NC='\033[0m'        # Define no color

INTERACTIVE=false
NAME=alice
while [[ -n $1 ]]; do
    case $1 in 
        -i | --interactive ) INTERACTIVE=true; shift
        ;;
        --name=* ) NAME="${1#*=}"; shift
        ;;
        -- | * ) shift; break
        ;;
    esac
done

# Verify configurations
NAMES=("alice" "bob")
if [[ ! "${NAMES[*]}" =~ (^|[[:space:]])"$NAME"($|[[:space:]]) ]]; then
  echo -e "${RED}Invalid name${NC}"
  echo -e "${RED}Valid names: ${NAMES[*]}${NC}"
fi
if [[ -z "$1" ]]; then
  echo -e "${YELLOW}No container entrypoint args specified${NC}"
fi

# Stop (if needed)
if docker ps | grep -q -w "${NAME}_dns_instance"; then
  echo -e "${YELLOW}Killing old container${NC}"
  docker stop "${NAME}_dns_instance"  
  docker rm "${NAME}_dns_instance"  
fi

# Queue the unlock if running interactively
if [[ "$INTERACTIVE" = true ]]; then 
  ../utils/synchronize.sh "${NAME}_dns_instance" notify &
fi

# Copy dependencies
cp ../utils/"${NAME}".sh ./configure_networking.tmp

# Build
docker image build . -t "${NAME}_dns_build"
echo -e "${GREEN}Build successful${NC}"

# Cleanup
rm ./configure_networking.tmp

# Run
docker container run \
    --name "${NAME}_dns_instance" \
    --interactive \
    --tty \
    --rm \
    --cap-add=NET_ADMIN \
    --network none \
    "$( if [[ "$INTERACTIVE" = true ]]; then echo "--detach=false"; else echo "--detach=true"; fi )" \
    "$( ../utils/synchronize.sh "${NAME}_dns_instance" mount )" \
    "${NAME}_dns_build" "$@"
