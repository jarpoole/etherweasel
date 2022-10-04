FROM ubuntu:latest

# Install CLI dependencies
RUN apt-get update
RUN apt-get install -y iproute2 net-tools ethtool dnsutils curl iputils-ping

COPY ./hostA.tmp ./configure_networking.sh 
COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]