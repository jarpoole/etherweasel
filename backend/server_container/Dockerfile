FROM nginx:latest

# Install CLI tools
RUN apt-get update
RUN apt-get install -y build-essential iproute2 net-tools ethtool dnsutils
RUN apt-get install -y iperf3
RUN apt-get install -y bind9
RUN apt-get install -y ffmpeg

# Configure NGINX web server
COPY ./static/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./static/nginx/payload.tar .

# Configure video
COPY ./static/video/rtsp-simple-server.yml ./rtsp-simple-server.yml
COPY ./static/video/* ./

COPY ./hostB.tmp ./configure_networking.sh 

COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]