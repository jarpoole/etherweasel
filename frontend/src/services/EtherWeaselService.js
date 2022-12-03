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

  static async getAttack(uuid) {
    try {
      let response = await fetch(EtherWeaselService.url + "attack/" + uuid);
      let attackInfo = await response.json();
      attackInfo.uuid = uuid;

      return attackInfo;
    } catch (error) {
      return undefined;
    }
  }

  static async deleteAttack(uuid) {
    try {
      let response = await fetch(EtherWeaselService.url + "attack/" + uuid, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  static async getAttacks(type) {
    try {
      let response = await fetch(
        EtherWeaselService.url +
          "attacks?" +
          new URLSearchParams({
            type: type,
          })
      );
      let attacksUuids = await response.json();
      let attacksInfo = [];

      for (const attackUuid of attacksUuids) {
        let attackInfo = await EtherWeaselService.getAttack(attackUuid);
        if (attackInfo) {
          attacksInfo.push(attackInfo);
        }
      }

      return attacksInfo;
    } catch (error) {
      return undefined;
    }
  }

  static async getLog(uuid) {
    try {
      let response = await fetch(EtherWeaselService.url + "logs/" + uuid);
      let log = await response.json();

      return log;
    } catch (error) {
      return undefined;
    }
  }

  static async getLogs(type) {
    try {
      let response = await fetch(
        EtherWeaselService.url +
          "attacks?" +
          new URLSearchParams({
            type: type,
          })
      );
      let attacksUuids = await response.json();
      let logs = [];

      for (const attackUuid of attacksUuids) {
        let log = await this.getLog(attackUuid);
        if (Array.isArray(log) && log.length) {
          logs = logs.concat(log);
        }
      }

      return logs;
    } catch (error) {
      return undefined;
    }
  }
}

export default EtherWeaselService;
