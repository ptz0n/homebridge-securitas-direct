class SecuritasDirectAccessory {
  constructor(homebridge, logger, config, client) {
    this.homebridge = homebridge;
    this.logger = logger;
    this.config = config;
    this.client = client;

    this.value = null;
    this.service = null;
    this.pollCharacteristics = [];

    const { Characteristic, Service } = homebridge.hap;

    this.accessoryInformation = new Service.AccessoryInformation();
    this.accessoryInformation
      .setCharacteristic(Characteristic.Manufacturer, 'Securitas Direct');

    if (config && config.pollInterval) {
      setInterval(() => {
        this.pollCharacteristics.forEach((characteristic) => characteristic.getValue());
      }, config.pollInterval * 1000);
    }
  }

  request(action) {
    return this.client.transaction(action, this.config.installation, this.config.panel);
  }

  log(message) {
    return this.logger('info', `${this.name}: ${message}`);
  }
}

module.exports = SecuritasDirectAccessory;
