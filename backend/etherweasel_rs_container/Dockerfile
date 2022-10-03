FROM ubuntu:latest

RUN apt-get update
# Install networking binaries
RUN apt-get install -y iproute2 iptables curl
# Install etherweasel_rs application dependencies
RUN apt-get install -y redis-server
# Install etherweasel_rs toolchain dependencies
RUN apt-get install -y build-essential 
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
# Install etherweasel_rs build dependencies
COPY ./etherweasel_rs/Cargo.toml ./
RUN touch cache.rs && cargo build --lib

# Load source code
COPY ./etherweasel_rs/src ./src

# Configure the container entrypoint
COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]
