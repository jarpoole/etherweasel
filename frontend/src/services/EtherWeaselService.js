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

  static async getDeviceStatus() {
    try {
      let response = await fetch(EtherWeaselService.url + "mode");
      let mode = await response.json();

      return mode;
    } catch (error) {
      return EtherWeaselService.deviceModes.DISCONNECTED;
    }
  }
  // TODO: attach attack passive switching
  static async postDeviceStatus(body) {
    try {
      let response = await fetch(EtherWeaselService.url + "mode", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return undefined;
    }
  }

  static async getNetworkData() {
    try {
      let response = await fetch(EtherWeaselService.url + "networking");
      let networkingData = await response.json();

      return networkingData;
    } catch (error) {
      return undefined;
    }
  }

  static async getDeviceInformation() {
    try {
      let response = await fetch(EtherWeaselService.url + "info");
      let information = await response.json();

      return information;
    } catch (error) {
      return undefined;
    }
  }

  static async getDevicePerformance() {
    try {
      let response = await fetch(EtherWeaselService.url + "performance");
      let performance = await response.json();

      return performance;
    } catch (error) {
      return undefined;
    }
  }

  static async postAttack(body) {
    try {
      let response = await fetch(EtherWeaselService.url + "attack", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return undefined;
    }
  }
}

export default EtherWeaselService;
