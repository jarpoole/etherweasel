import React from "react";

import Header from "../../components/Header";

class DNS extends React.Component {
  render() {
    return (
      <Header
        title="DNS"
        description="The Domain Name System (DNS) is the hierarchical and decentralized naming system used to identify computers reachable through the Internet or other Internet Protocol (IP) networks."
      >
        <p>
          Ether Weasel allows users to attack perform DNS spoofing, also
          referred to as DNS cache poisoning. This attack corrupts Domain Name
          System data is introduced into the DNS resolver's cache, causing the
          name server to return an incorrect result record, e.g. an IP address.
          This results in traffic being diverted to the attacker's computer (or
          any other computer).
        </p>
      </Header>
    );
  }
}

export default DNS;
