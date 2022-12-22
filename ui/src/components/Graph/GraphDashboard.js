import React from "react";

import Grid from "@mui/material/Grid";

import LineGraph from "./LineGraph";
import PieGraph from "./PieGraph";

class GraphDashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Grid item xs={9}>
          <LineGraph
            title={this.props.lineGraphName}
            dataset={this.props.lineGraphData}
            displayPercentage={this.props.displayPercentage}
            max={this.props.max}
            interval={this.props.interval}
            multiple={this.props.multiple}
            itemWidth={this.props.itemWidth}
          />
        </Grid>
        <Grid item xs={3}>
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
