import React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import HostCard from "./HostCard";
import EtherWeaselCard from "./EtherWeaselCard";

class DeviceCardDashboard extends React.Component {
  render() {
    return (
      <Grid item xs={12}>
        <Paper elevation={1} className="paperPadding">
          <Grid container spacing={10} alignItems="stretch">
            <Grid item xs={4}>
              <HostCard
                title={"Host A"}
                hostStatus={this.props.aliceIsConnected}
                macAddress={this.props.aliceMacAddress}
              />
            </Grid>
            <Grid item xs={4}>
              <EtherWeaselCard
                title={"Ether-Weasel"}
                deviceMode={this.props.deviceMode}
                name={this.props.deviceName}
              />
            </Grid>
            <Grid item xs={4}>
              <HostCard
                title={"Host B"}
                hostStatus={this.props.bobIsConnected}
                macAddress={this.props.bobMacAddress}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default DeviceCardDashboard;
