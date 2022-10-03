# Server Container

This container plays the role of a server on the network which hosts a service under attack.

The `static` folder contains assets which are consumed by the various services.

## RTSP simple server

```bash
RTSP*SIMPLE_SERVER=v0.17.17
wget https://github.com/aler9/rtsp-simple-server/releases/download/"$RTSP_SIMPLE_SERVER"/ rtsp-simple-server*"$RTSP_SIMPLE_SERVER"_linux_amd64.tar.gz
tar -xzvf rtsp-simple-server_"$RTSP_SIMPLE_SERVER"\_linux_amd64.tar.gz
```
