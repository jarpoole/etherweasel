class EtherWeaselService {
  static get url() {
    return "http://172.17.0.1:3000/";
  }

  static get deviceModes() {
    return {
      DISCONNECTED: "DISCONNECTED",
      ACTIVE: "ACTIVE",
      PASSIVE: "PASSIVE",
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
