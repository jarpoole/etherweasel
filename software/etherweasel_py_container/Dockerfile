FROM ubuntu:latest

# Install Python + CLI tools
RUN apt-get update
RUN apt-get install -y python3 python3-dev python3-pip iproute2 iptables
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y ffmpeg


# Install Python dependencies
RUN pip3 install dpkt tornado

# Copy modified Lens source code
COPY ./src/*.py ./
COPY ./src/attacks ./

COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]
