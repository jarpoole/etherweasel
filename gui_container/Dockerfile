FROM ubuntu:latest

# Install CLI dependencies + CLI debug tools + GUI demo apps
RUN apt-get update && true
RUN apt-get install -y iproute2 net-tools ethtool
RUN apt-get install -y curl tcpdump procps netcat
RUN apt-get install -y iperf3
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y firefox
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y vlc
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y wireshark
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y ffmpeg

COPY ./interface1.tmp ./interface1.sh 
COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]