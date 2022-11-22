FROM ubuntu:latest

# Install CLI dependencies
RUN apt-get update
RUN apt-get install -y iproute2 net-tools ethtool dnsutils curl iputils-ping
RUN apt-get install -y tcpdump 
RUN apt-get install -y bind9

COPY ./configure_networking.tmp ./configure_networking.sh 
COPY ./bind/* ./bind/
COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]