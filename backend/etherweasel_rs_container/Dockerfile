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
# 
# This can be done using a dummy target to allow cargo to cache dependencies
# during build. See https://stackoverflow.com/a/39662015/3888444 and
# https://doc.rust-lang.org/cargo/reference/manifest.html
COPY ./etherweasel_rs/Cargo.toml ./
RUN /bin/echo -e '\n[lib]\nname = "cache"\npath = "cache.rs"' >>  Cargo.toml 
RUN touch cache.rs 
RUN cargo build --lib

# Load source code
COPY ./etherweasel_rs/src ./src

# Configure the container entrypoint
COPY ./entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]
