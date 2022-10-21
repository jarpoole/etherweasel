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

Most development should be done within the Docker container so that key dependencies are available.

```bash
sudo ./run.sh --interactive -- test
```

The build can also be run directly on the host machine

```bash
cargo run
```

To test that the rest API is running, make `GET` request using `curl` on the `/ping` endpoint

```bash
curl -I localhost:3000/ping
```

### Test

Basic API requests can be made using cURL

```bash
curl localhost:3000/mode -X POST -vv -d '{ "mode": "active" }' --header "Content-Type: application/json"
```

## Dependencies

Add a new dependency using cargo

```bash
cargo add my_dep
```

## Useful information

## Remote

1. Install the `Remote - SSH` extension on your local dev machine (` ms-vscode-remote.remote-ssh`)
2. Install vscode on the remote server with snap `snap install --classic code`
3. Install openSSH and configure a static IP address on the server
4. On the far left in local vscode, select `Remote explorer` and add a new `SSH Target`
5. Connect to the new SSH target by clicking the `Connect to host in new window button` and wait for vscode to configure everything

https://stackoverflow.com/questions/14774668/what-is-raw-socket-in-socket-programming

socket(AF_INET,RAW_SOCKET,...) means L3 socket , Network Layer Protocol = IPv4
socket(AF_IPX,RAW_SOCKET,...) means L3 socket , Network Layer Protocol = IPX
socket(AF_INET6,RAW_SOCKET,...) means L3 socket , Network Layer Protocol=IPv6
socket(AF_PACKET,RAW_SOCKET,...) means L2 socket , Data-link Layer Protocol= Ethernet

https://github.com/dbcfd/rs-af_packet
