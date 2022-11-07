import React from "react";

import Grid from "@mui/material/Grid";

import EtherWeaselService from "../services/EtherWeaselService";
import Header from "../components/Header";
import DeviceCardDashboard from "../components/DeviceCard/DeviceCardDashboard";
import GraphDashboard from "../components/Graphs/GraphDashboard";

class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpuData: [],
      memoryData: [],
      currentCpuUsage: 0,
      currentMemoryUsage: 0,
      totalCpuUsage: 0,
      totalMemoryUsage: 0,
      countCalls: 0,
    };
  }

  componentDidMount() {
    this.performanceDataIntervalID = setInterval(this.loadPerformanceData, 500);
  }

  componentWillUnmount() {
    clearInterval(this.performanceDataIntervalID);
  }

  loadPerformanceData = async () => {
    let performanceData = await EtherWeaselService.fetchDevicePerformance();

    if (performanceData) {
      // Update dataset for CPU Usage
      let newCpuDataPoint = performanceData.cpu_usage;
      let newCpuData = this.updateData(
        this.state.cpuData,
        newCpuDataPoint.toFixed(2)
      );

      // Update dataset for Memory Usage
      // Converts Free Memory -> Memory Usage
      let newMemoryDataPoint =
        ((performanceData.total_memory - performanceData.free_memory) /
          performanceData.total_memory) *
        100;
      let newMemoryData = this.updateData(
        this.state.memoryData,
        newMemoryDataPoint.toFixed(2)
      );

      this.setState({
        cpuData: newCpuData,
        memoryData: newMemoryData,
        currentCpuUsage: newCpuDataPoint,
        currentMemoryUsage: newMemoryDataPoint,
        totalCpuUsage: this.state.totalCpuUsage + newCpuDataPoint,
        totalMemoryUsage: this.state.totalMemoryUsage + newMemoryDataPoint,
        countCalls: this.state.countCalls + 1,
      });
    }
  };

  updateData(oldDataSet, newDataPoint) {
    let newDataSet = oldDataSet;
    if (newDataSet.length >= 11) {
      newDataSet = newDataSet.slice(0, 10);
    }
    newDataSet.unshift(newDataPoint);
    return newDataSet;
  }

  render() {
    return (
      <React.Fragment>
        <Header title="Analytics" description="Entity Description" />
        <Grid container spacing={2} style={{ paddingTop: 20 }}>
          <DeviceCardDashboard deviceMode={this.props.deviceMode} />
          <GraphDashboard
            lineGraphName={"CPU Usage"}
            lineGraphData={this.state.cpuData}
            currentPieGraphName={"Current CPU Usage"}
            currentPieGraphData={this.state.currentCpuUsage}
            averagePieGraphName={"Average CPU Usage"}
            averagePieGraphData={
              this.state.totalCpuUsage / this.state.countCalls
            }
          />
          <GraphDashboard
            lineGraphName={"Memory Usage"}
            lineGraphData={this.state.memoryData}
            currentPieGraphName={"Current Mem Usage"}
            currentPieGraphData={this.state.currentMemoryUsage}
            averagePieGraphName={"Average Mem Usage"}
            averagePieGraphData={
              this.state.totalMemoryUsage / this.state.countCalls
            }
          />
        </Grid>
      </React.Fragment>
    );
  }
}

export default Analytics;
