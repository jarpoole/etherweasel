import React from "react";

import Grid from "@mui/material/Grid";

import EtherWeaselService from "../services/EtherWeaselService";
import Header from "../components/Header";
import DeviceCardDashboard from "../components/DeviceCard/DeviceCardDashboard";
import GraphDashboard from "../components/Graphs/GraphDashboard";

const interval = 1000;
const numberOfGraphIntervals = 16;

class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aliceIsConnected: EtherWeaselService.hostStatuses.ERROR,
      aliceMacAddress: undefined,
      aliceRxData: [],
      totalAliceRxPackets: 0,
      aliceTxData: [],
      totalAliceTxPackets: 0,
      bobIsConnected: EtherWeaselService.hostStatuses.ERROR,
      bobMacAddress: undefined,
      bobRxData: [],
      totalBobRxPackets: 0,
      bobTxData: [],
      totalBobTxPackets: 0,
      deviceName: undefined,
      cpuData: [],
      currentCpuUsage: 0,
      totalCpuUsage: 0,
      memoryData: [],
      currentMemoryUsage: 0,
      totalMemoryUsage: 0,
      countCalls: 0,
    };
  }

  componentDidMount() {
    // Run it once to render everything properly
    this.loadNetworkData();
    this.loadDeviceInformation();
    this.loadPerformanceData();

    // Run the calls in an interval
    this.networkDataIntervalID = setInterval(this.loadNetworkData, interval);
    this.performanceDataIntervalID = setInterval(
      this.loadPerformanceData,
      interval
    );
  }

  componentWillUnmount() {
    clearInterval(this.performanceDataIntervalID);
    clearInterval(this.networkDataIntervalID);
  }

  loadNetworkData = async () => {
    let networkingData = await EtherWeaselService.fetchNetworkData();

    if (networkingData) {
      // Update device status for Alice
      let newAliceStatus = this.updateStatus(networkingData.alice.connected);

      // Update dataset for Alice's networking information
      let newAliceRxDataPoint = networkingData.alice.rxBytes;
      let newAliceRxData = this.updateData(
        this.state.aliceRxData,
        newAliceRxDataPoint
      );

      let newAliceTxDataPoint = networkingData.alice.txBytes;
      let newAliceTxData = this.updateData(
        this.state.aliceTxData,
        newAliceTxDataPoint
      );

      // Update device status for Alice
      let newBobStatus = this.updateStatus(networkingData.bob.connected);

      // Update dataset for Bob's networking information
      let newBobRxDataPoint = networkingData.bob.rxBytes;
      let newBobRxData = this.updateData(
        this.state.bobRxData,
        newBobRxDataPoint
      );

      let newBobTxDataPoint = networkingData.bob.txBytes;
      let newBobTxData = this.updateData(
        this.state.bobTxData,
        newBobTxDataPoint
      );

      this.setState({
        aliceIsConnected: newAliceStatus,
        aliceMacAddress: networkingData.alice.macAddress,
        aliceRxData: newAliceRxData,
        totalAliceRxPackets: networkingData.alice.rxPackets,
        aliceTxData: newAliceTxData,
        totalAliceTxPackets: networkingData.alice.txPackets,
        bobIsConnected: newBobStatus,
        bobMacAddress: networkingData.bob.macAddress,
        bobRxData: newBobRxData,
        totalBobRxPackets: networkingData.bob.rxPackets,
        bobTxData: newBobTxData,
        totalBobTxPackets: networkingData.bob.txPackets,
      });
    } else {
      // The network call was unsuccessful
      this.setState({
        aliceIsConnected: EtherWeaselService.hostStatuses.ERROR,
        bobIsConnected: EtherWeaselService.hostStatuses.ERROR,
      });
    }
  };

  loadDeviceInformation = async () => {
    let deviceInformation = await EtherWeaselService.fetchDeviceInformation();

    if (deviceInformation) {
      this.setState({
        deviceName: deviceInformation.name,
      });
    }
  };

  loadPerformanceData = async () => {
    let performanceData = await EtherWeaselService.fetchDevicePerformance();

    if (performanceData) {
      // Update dataset for CPU Usage
      let newCpuDataPoint = performanceData.cpuUsage;
      let newCpuData = this.updateData(this.state.cpuData, newCpuDataPoint);

      // Update dataset for Memory Usage
      // Converts Free Memory -> Memory Usage
      let newMemoryDataPoint =
        ((performanceData.totalMemory - performanceData.freeMemory) /
          performanceData.totalMemory) *
        100;
      let newMemoryData = this.updateData(
        this.state.memoryData,
        newMemoryDataPoint
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
    if (newDataSet.length >= numberOfGraphIntervals) {
      newDataSet = newDataSet.slice(0, numberOfGraphIntervals - 1);
    }
    newDataSet.unshift(newDataPoint.toFixed(2));
    return newDataSet;
  }

  updateStatus(isConnected) {
    return isConnected
      ? EtherWeaselService.hostStatuses.CONNECTED
      : EtherWeaselService.hostStatuses.DISCONNECTED;
  }

  render() {
    let averageCPUUsage = this.state.totalCpuUsage / this.state.countCalls;
    let averageMemoryUsage =
      this.state.totalMemoryUsage / this.state.countCalls;
    return (
      <React.Fragment>
        <Header title="Analytics" description="Entity Description" />
        <Grid container spacing={2} style={{ paddingTop: 20 }}>
          <DeviceCardDashboard
            aliceIsConnected={this.state.aliceIsConnected}
            aliceMacAddress={this.state.aliceMacAddress}
            deviceMode={this.props.deviceMode}
            deviceName={this.state.deviceName}
            bobIsConnected={this.state.bobIsConnected}
            bobMacAddress={this.state.bobMacAddress}
          />
          <GraphDashboard
            lineGraphName={"CPU"}
            lineGraphData={[{ id: "CPU Usage", data: this.state.cpuData }]}
            topPieGraphName={"Average CPU Usage"}
            topPieGraphData={[
              { id: "Used", value: averageCPUUsage },
              { id: "Free", value: 100 - averageCPUUsage },
            ]}
            bottomPieGraphName={"Current CPU Usage"}
            bottomPieGraphData={[
              { id: "Used", value: this.state.currentCpuUsage },
              { id: "Free", value: 100 - this.state.currentCpuUsage },
            ]}
            displayPercentage={true}
            interval={interval}
          />
          <GraphDashboard
            lineGraphName={"Memory"}
            lineGraphData={[
              { id: "Memory Usage", data: this.state.memoryData },
            ]}
            topPieGraphName={"Average Mem Usage"}
            topPieGraphData={[
              { id: "Used", value: averageMemoryUsage },
              { id: "Free", value: 100 - averageMemoryUsage },
            ]}
            bottomPieGraphName={"Current Mem Usage"}
            bottomPieGraphData={[
              { id: "Used", value: this.state.currentMemoryUsage },
              { id: "Free", value: 100 - this.state.currentMemoryUsage },
            ]}
            displayPercentage={true}
            interval={interval}
          />
          <GraphDashboard
            lineGraphName={"Network"}
            lineGraphData={[
              { id: "Host B Receiving", data: this.state.bobRxData },
              { id: "Host B Sending", data: this.state.bobTxData },
              { id: "Host A Receiving", data: this.state.aliceRxData },
              { id: "Host A Sending", data: this.state.bobTxData },
            ]}
            topPieGraphName={"Host A Summary"}
            topPieGraphData={[
              { id: "Sent", value: this.state.totalAliceTxPackets },
              { id: "Received", value: this.state.totalAliceRxPackets },
            ]}
            bottomPieGraphName={"Host B Summary"}
            bottomPieGraphData={[
              { id: "Sent", value: this.state.totalBobTxPackets },
              { id: "Received", value: this.state.totalBobRxPackets },
            ]}
            interval={interval}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

export default Analytics;
