import React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Header from "../components/Header";
import HostCard from "../components/DeviceCard/HostCard";
import EtherWeaselCard from "../components/DeviceCard/EtherWeaselCard";
import LineGraph from "../components/LineGraph";
import PieGraph from "../components/PieGraph";

class Analytics extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header title="Analytics" description="Entity Description" />
        <Grid container spacing={2} style={{ paddingTop: 20 }}>
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
                    successfulModifications={12}
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

          <Grid item md={8} lg={10}>
            <LineGraph title={"CPU Usage"} />
          </Grid>
          <Grid item md={4} lg={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PieGraph title={"Current CPU Usage"} />
              </Grid>
              <Grid item xs={12}>
                <PieGraph title={"Average CPU Usage"} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Analytics;
