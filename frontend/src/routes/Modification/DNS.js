import React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";

import EtherWeaselService from "../../services/EtherWeaselService";
import Header from "../../components/Header";
import LogTable from "../../components/Table/LogTable";
import ModificationsTable from "../../components/Table/ModificationsTable";

class DNS extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header
          title="DNS Modification"
          description="The Domain Name System (DNS) is the hierarchical and decentralized naming system used to identify computers reachable through the Internet or other Internet Protocol (IP) networks."
        />

        <p className="paragraph">
          EtherWeasel allows users to perform DNS spoofing, also referred to as
          DNS cache poisoning. This attack allows modified Domain Name System
          data to be introduced into a DNS resolver's cache, causing the name
          server to return an incorrect result record, e.g. an incorrect IP
          address. This results in traffic being diverted to the attacker's
          computer (or any other computer).
        </p>

        <Grid container spacing={2} style={{ paddingTop: 20 }}>
          <Grid item xs={12}>
            <Paper
              elevation={1}
              className="paperPadding"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
            >
              Active Mode:
              {
                <Switch
                  data-test-id="ActiveModeControlSwitch"
                  disabled={
                    this.props.deviceMode ===
                    EtherWeaselService.deviceModes.DISCONNECTED
                  }
                  checked={
                    this.props.deviceMode ===
                    EtherWeaselService.deviceModes.ACTIVE
                  }
                  onChange={this.props.updateDeviceMode}
                />
              }
            </Paper>
          </Grid>
          <ModificationsTable
            deviceMode={this.props.deviceMode}
            disabled={
              this.props.deviceMode ===
              EtherWeaselService.deviceModes.DISCONNECTED
            }
          />
          <LogTable />
        </Grid>
      </React.Fragment>
    );
  }
}

export default DNS;
