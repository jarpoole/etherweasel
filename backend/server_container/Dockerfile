FROM nginx:latest

# Install CLI tools
RUN apt-get update
RUN apt-get install -y build-essential iproute2 net-tools ethtool
RUN apt-get install -y iperf3
RUN apt-get install -y ffmpeg

# Configure NGINX web server
COPY ./websites/nginx.conf /etc/nginx/nginx.conf
COPY ./websites/payload.tar .

# Configure camera
COPY ./videos/rtsp-simple-server.yml ./rtsp-simple-server.yml
COPY ./videos/* ./

COPY ./interface2.tmp ./interface2.sh 

COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]