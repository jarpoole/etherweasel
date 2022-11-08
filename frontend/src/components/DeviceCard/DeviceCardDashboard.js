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
          <Grid container spacing={10}>
            <Grid item xs={4}>
              <HostCard
                title={"Host A"}
                isConnected={true}
                ip={"192.168.0.2"}
              />
            </Grid>
            <Grid item xs={4}>
              <EtherWeaselCard
                title={"Ether-Weasel"}
                deviceMode={this.props.deviceMode}
                name={"rpi"}
              />
            </Grid>
            <Grid item xs={4}>
              <HostCard
                title={"Host B"}
                isConnected={false}
                ip={"192.168.0.3"}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default DeviceCardDashboard;
