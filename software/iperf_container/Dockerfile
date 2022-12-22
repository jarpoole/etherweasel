FROM ubuntu:latest

# Install CLI dependencies
RUN apt-get update
RUN apt-get install -y iproute2 net-tools ethtool
RUN apt-get install -y iperf3

COPY ./interface1.tmp ./interface1.sh 
COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]