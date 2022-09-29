## WSL

### Installation

```
sudo apt-get update
sudo apt install build-essential
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Build

```
cargo build
```

### Run

```
cargo run
```

## Useful information

https://stackoverflow.com/questions/14774668/what-is-raw-socket-in-socket-programming

socket(AF_INET,RAW_SOCKET,...) means L3 socket , Network Layer Protocol = IPv4
socket(AF_IPX,RAW_SOCKET,...) means L3 socket , Network Layer Protocol = IPX
socket(AF_INET6,RAW_SOCKET,...) means L3 socket , Network Layer Protocol=IPv6
socket(AF_PACKET,RAW_SOCKET,...) means L2 socket , Data-link Layer Protocol= Ethernet

https://github.com/dbcfd/rs-af_packet
