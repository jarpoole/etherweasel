ARG CROSS_BASE_IMAGE
FROM ${CROSS_BASE_IMAGE}

# Install PCAP dependencies and configure linking
# The challenge is that we need to cross compile libpcap from source
# as well such that the binary we link against is compatible at the next
# step. Strategy: 
#  1) Install libpcap build tools
#  2) Download, decompress, configure, build and copy the resultant
#     shared lib into a shared folder
#  3) Expose the new shared libs to the rust linker
RUN apt-get install -y wget flex bison gcc-aarch64-linux-gnu
RUN \
    wget http://www.tcpdump.org/release/libpcap-1.10.1.tar.gz && \
    tar xvf libpcap-1.10.1.tar.gz && \
    cd libpcap-1.10.1 && \
    export CC=aarch64-linux-gnu-gcc && \
    ./configure --host=aarch64-unknown-linux-gnu --with-pcap=linux && \
    make && \
    mkdir /usr/lib/libpcap && \
    cp libpcap* /usr/lib/libpcap
ENV CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_RUSTFLAGS="-L /usr/lib/libpcap" 