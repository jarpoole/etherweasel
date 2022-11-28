#!/bin/bash
# Usage: sudo ./run.sh             to run frontend in development mode; Hosted on port 3005
#        sudo ./run.sh -t | --test to run all frontend tests; Test results are displayed on the terminal

if [[ $(whoami) != "root" ]]; then
    echo -e "Must be root"
    exit 1
fi

# Only argument that currently exists is -t | --test
# No argument means development
DEVELOPMENT=true
BACKEND=true
API_URL="http://localhost:3000/"
for i in "$@"; do
    case $i in
    -t | --test)
        DEVELOPMENT=false
        shift
        ;;
    --no-backend)
        BACKEND=false
        shift
        ;;
    --api-url=* )
        API_URL="${1#*=}"
        shift
        ;;
    -* | --*)
        echo "Unknown option $i"
        exit 1
        ;;
    *) ;;

    esac
done

# Spin up backend (Hosted in port 3000)
if [[ $BACKEND = true ]]; then
  sudo ../backend/testharness.sh dns
fi

# Stop if needed; runs headlessly and therefore not terminated after use
if docker ps | grep -q -w frontend_prod_instance; then
    docker stop frontend_prod_instance
    docker rm frontend_prod_instance
fi

# Generate the .env file
echo "REACT_APP_ETHERWEASEL_ENDPOINT=${API_URL}" > "./.env"

if [[ $DEVELOPMENT = true ]]; then
    # Since source file is mapped to the docker container, need the node modules installed locally as well
    npm install
    # Spin up the frontend while mapping to source file to re-render changes on save
    docker image build -f Dockerfile.development . -t frontend_dev_image

    docker run \
        --name frontend_dev_instance \
        --rm \
        -it \
        -p 3005:3005 \
        -v $(pwd):/frontend \
        frontend_dev_image
else
    # Spin up a production webapp for more accurate test results
    docker image build -f Dockerfile.production . -t frontend_prod_image

    docker run \
        --name frontend_prod_instance \
        --rm \
        -it \
        -p 3005:80 \
        --detach=true \
        frontend_prod_image

    # Run all of the tests in ./test using Playwright
    docker image build -f Dockerfile.test . -t frontend_test_image

    docker run \
        --name frontend_test_instance \
        --rm \
        -it \
        frontend_test_image

fi
