class EtherWeaselService {
  static get url() {
    return process.env.REACT_APP_ETHERWEASEL_ENDPOINT;
  }

  static get deviceModes() {
    return {
      DISCONNECTED: "DISCONNECTED",
      ACTIVE: "ACTIVE",
      PASSIVE: "PASSIVE",
    };
  }

  static get hostStatuses() {
    return {
      UNKNOWN: "UNKNOWN",
      CONNECTED: "CONNECTED",
      DISCONNECTED: "DISCONNECTED",
    };
  }

  static async fetchDeviceStatus() {
    try {
      let response = await fetch(EtherWeaselService.url + "mode");
      let mode = await response.json();

      return mode;
    } catch (error) {
      return EtherWeaselService.deviceModes.DISCONNECTED;
    }
  }

  static async fetchNetworkData() {
    try {
      let response = await fetch(EtherWeaselService.url + "networking");
      let networkingData = await response.json();

      return networkingData;
    } catch (error) {
      return undefined;
    }
  }

  static async fetchDeviceInformation() {
    try {
      let response = await fetch(EtherWeaselService.url + "info");
      let information = await response.json();

      return information;
    } catch (error) {
      return undefined;
    }
  }

  static async fetchDevicePerformance() {
    try {
      let response = await fetch(EtherWeaselService.url + "performance");
      let performance = await response.json();

      return performance;
    } catch (error) {
      return undefined;
    }
  }
}

export default EtherWeaselService;
