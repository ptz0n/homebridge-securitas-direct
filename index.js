const AlarmAccessory = require('./lib/accessories/alarm');

module.exports = (homebridge) => {
  AlarmAccessory.init(homebridge);
  homebridge.registerAccessory('homebridge-securitas-direct', 'securitas-direct', AlarmAccessory);
};
