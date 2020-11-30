const SecuritasDirectPlatform = require('./lib/platform');

module.exports = (homebridge) => {
  SecuritasDirectPlatform.init(homebridge);
  homebridge.registerPlatform('homebridge-securitas-direct', 'securitas-direct', SecuritasDirectPlatform);
};
