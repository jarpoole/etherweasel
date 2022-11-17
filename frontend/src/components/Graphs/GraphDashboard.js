import React from "react";

import Grid from "@mui/material/Grid";

import LineGraph from "./LineGraph";
import PieGraph from "./PieGraph";

class GraphDashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Grid item md={8} lg={10}>
          <LineGraph
            title={this.props.lineGraphName}
            data={this.props.lineGraphData}
            displayPercentage={this.props.displayPercentage}
            interval={this.props.interval}
          />
        </Grid>
        <Grid item md={4} lg={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PieGraph
                title={this.props.topPieGraphName}
                data={this.props.topPieGraphData}
                displayPercentage={this.props.displayPercentage}
              />
            </Grid>
            <Grid item xs={12}>
              <PieGraph
                title={this.props.bottomPieGraphName}
                data={this.props.bottomPieGraphData}
                displayPercentage={this.props.displayPercentage}
              />
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default GraphDashboard;
