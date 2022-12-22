#!/bin/bash

# Block until test harness is ready
cat /shared/lock

# Configure networking
./configure_networking.sh

if [[ "$*" == *"iperf"* ]]; then
    # Start an iperf server
    iperf3 -s -p 5555 &
fi

if [[ "$*" == *"video"* ]]; then
    # Start the RTSP simple video server
    ./rtsp-simple-server &

    # Start a video feed
    #ffmpeg -stream_loop -1 -re -i ./long.mp4 -f rtp rtp://192.168.0.1:51234 -nostdin 2> /dev/null &
    #ffmpeg -stream_loop -1 -re -i ./server_container/videos/long.mp4 -an -c:v copy -f rtp rtp://192.168.0.1:51234
    #ffmpeg -stream_loop -1 -re -i ./server_container/videos/long.mp4 -codec copy -rtsp_transport tcp -f rtsp rtsp://192.168.0.1:51234
    ffmpeg -stream_loop -1 -re -i ./long.mp4 -f rtsp -rtsp_transport udp rtsp://localhost:8554/stream &
fi

if [[ "$*" == *"nginx"* ]]; then
    # Start a web server
    tar -xzvf payload.tar -C /usr/share/nginx/html/
    ./docker-entrypoint.sh nginx 
fi

if [[ "$*" == *"bind"* ]]; then
  tar -xzvf payload.tar -C /usr/share/nginx/html/
  ./docker-entrypoint.sh nginx 
fi

bash
