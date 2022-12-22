import React from "react";

import Grid from "@mui/material/Grid";

import EtherWeaselService from "../services/EtherWeaselService";
import Header from "../components/Header";
import LoadingScreen from "../components/LoadingScreen";
import DeviceCardDashboard from "../components/DeviceCard/DeviceCardDashboard";
import LineGraph from "../components/Graph/LineGraph";

const interval = 1000;
const numCPUIntervals = 16;
const numMemIntervals = 16;
const numNetworkIntervals = 30;

class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aliceIsConnected: EtherWeaselService.hostStatuses.ERROR,
      aliceInterfaceName: undefined,
      aliceRxData: [],
      aliceTxData: [],
      bobIsConnected: EtherWeaselService.hostStatuses.ERROR,
      bobInterfaceName: undefined,
      bobRxData: [],
      bobTxData: [],
      deviceName: undefined,
      cpusData: [],
      memoryData: [],
      loading: true,
    };
  }

  componentDidMount() {
    // Run it once to render everything properly
    this.loadNetworkData();
    this.loadDeviceInformation();
    // Comment out to fix a bug with CPU usage data
    // Calling too quickly gives erronous values
    //this.loadPerformanceData();

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
    let networkingData = await EtherWeaselService.getNetworkData();

    if (networkingData) {
      // Update device status for Alice
      let newAliceStatus = this.updateStatus(networkingData.alice.connected);

      // Update dataset for Alice's networking information
      let newAliceRxDataPoint = networkingData.alice.rxBytes;
      let newAliceRxData = this.updateData(
        this.state.aliceRxData,
        newAliceRxDataPoint,
        numNetworkIntervals
      );

      let newAliceTxDataPoint = networkingData.alice.txBytes;
      let newAliceTxData = this.updateData(
        this.state.aliceTxData,
        newAliceTxDataPoint,
        numNetworkIntervals
      );

      // Update device status for Alice
      let newBobStatus = this.updateStatus(networkingData.bob.connected);

      // Update dataset for Bob's networking information
      let newBobRxDataPoint = networkingData.bob.rxBytes;
      let newBobRxData = this.updateData(
        this.state.bobRxData,
        newBobRxDataPoint,
        numNetworkIntervals
      );

      let newBobTxDataPoint = networkingData.bob.txBytes;
      let newBobTxData = this.updateData(
        this.state.bobTxData,
        newBobTxDataPoint,
        numNetworkIntervals
      );

      this.setState({
        aliceIsConnected: newAliceStatus,
        aliceInterfaceName: networkingData.alice.interface,
        aliceRxData: newAliceRxData,
        aliceTxData: newAliceTxData,
        bobIsConnected: newBobStatus,
        bobInterfaceName: networkingData.bob.interface,
        bobRxData: newBobRxData,
        bobTxData: newBobTxData,
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
    let deviceInformation = await EtherWeaselService.getDeviceInformation();

    if (deviceInformation) {
      this.setState({
        deviceName: deviceInformation.name,
      });
    }
  };

  loadPerformanceData = async () => {
    let performanceData = await EtherWeaselService.getDevicePerformance();

    if (performanceData) {
      // Update dataset for CPU Usage
      let newCpusDataPoint = performanceData.cpuUsage;
      let newCpusData = newCpusDataPoint.map((newCpuDataPoint, i) =>
        this.updateData(
          this.state.cpusData[i],
          newCpuDataPoint,
          numCPUIntervals
        )
      );

      // Update dataset for Memory Usage
      // Converts Free Memory -> Memory Usage
      let newMemoryDataPoint = performanceData.freeMemory;
      let newMemoryData = this.updateData(
        this.state.memoryData,
        newMemoryDataPoint,
        numMemIntervals
      );

      this.setState({
        cpusData: newCpusData,
        memoryData: newMemoryData,
        totalMemoryAvailable: performanceData.totalMemory,
        loading: false,
      });
    }
  };

  updateData(oldDataSet, newDataPoint, maxIntervals) {
    let newDataSet = oldDataSet ? oldDataSet : [];

    if (newDataSet.length >= maxIntervals) {
      newDataSet = newDataSet.slice(0, maxIntervals - 1);
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
    return (
      <React.Fragment>
        <LoadingScreen
          open={this.state.loading}
          handleLoadingClick={() => this.setState({ loading: false })}
        />
        <Header title="Analytics" />
        <Grid container spacing={2} style={{ paddingTop: 20 }}>
          <DeviceCardDashboard
            aliceIsConnected={this.state.aliceIsConnected}
            aliceInterfaceName={this.state.aliceInterfaceName}
            deviceMode={this.props.deviceMode}
            deviceName={this.state.deviceName}
            bobIsConnected={this.state.bobIsConnected}
            bobInterfaceName={this.state.bobInterfaceName}
            loading={this.state.loading}
          />
          <Grid item xs={6}>
            <LineGraph
              title={"CPU"}
              dataset={this.state.cpusData.map((cpuData, index) => ({
                id: `CPU${index}`,
                data: cpuData,
              }))}
              itemWidth={60}
              displayPercentage
              interval={interval}
              max={100}
              numberOfIntervals={numCPUIntervals}
              loading={this.state.loading}
            />
          </Grid>
          <Grid item xs={6}>
            <LineGraph
              title={"Memory"}
              dataset={[{ id: "Memory Usage", data: this.state.memoryData }]}
              itemWidth={120}
              interval={interval}
              max={this.state.totalMemoryAvailable}
              numberOfIntervals={numMemIntervals}
              loading={this.state.loading}
            />
          </Grid>
          <Grid item xs={12}>
            <LineGraph
              title={"Network"}
              dataset={[
                { id: "Host B Receiving", data: this.state.bobRxData },
                { id: "Host B Sending", data: this.state.bobTxData },
                { id: "Host A Receiving", data: this.state.aliceRxData },
                { id: "Host A Sending", data: this.state.bobTxData },
              ]}
              itemWidth={120}
              interval={interval * 2}
              numberOfIntervals={numNetworkIntervals}
              loading={this.state.loading}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Analytics;
