const SecuritasDirect = require('securitas-direct');

const Alarm = require('./accessories/alarm');

let homebridge = null;

class SecuritasDirectPlatform {
  constructor(logger, config) {
    if (!homebridge) {
      throw Error('Module not initiated.');
    }

    const {
      SECURITAS_DIRECT_USERNAME,
      SECURITAS_DIRECT_PASSWORD,
    } = process.env;

    const {
      country = '',
      username,
      password,
      installation,
      panel = 'SDVFAST',
      pollInterval = 60,
    } = config;

    this.config = {
      country,
      username: SECURITAS_DIRECT_USERNAME || username,
      password: SECURITAS_DIRECT_PASSWORD || password,
      installation,
      panel,
      pollInterval,
    };

    this.homebridge = homebridge;
    this.logger = logger;

    this.client = new SecuritasDirect(
      this.config.username,
      this.config.password,
      this.config.country,
    );
  }

  static init(homebridgeRef) {
    homebridge = homebridgeRef;
  }

  accessories(callback) {
    this.client.login()
      .then(() => callback([new Alarm(
        homebridge,
        this.logger,
        this.config,
        this.client,
      )]))
      .catch(callback);
  }
}

module.exports = SecuritasDirectPlatform;
