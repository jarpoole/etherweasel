mod dns_sniff;
mod hello;

fn main() {
    hello::hello();
    dns_sniff::start("eth0");
}
