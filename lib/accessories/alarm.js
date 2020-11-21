const SecuritasDirectAccessory = require('./securitas-direct');

class Alarm extends SecuritasDirectAccessory {
  constructor(...args) {
    super(...args);

    this.model = 'ALARM';
    this.name = 'Alarm';
  }

  resolveArmState(input) {
    const { SecuritySystemCurrentState } = this.homebridge.hap.Characteristic;
    const armStateMap = {
      1: SecuritySystemCurrentState.AWAY_ARM,
      P: SecuritySystemCurrentState.STAY_ARM,
      0: SecuritySystemCurrentState.DISARMED,
      Q: SecuritySystemCurrentState.NIGHT_ARM,
    };

    const output = armStateMap[input];

    if (typeof output === 'undefined') {
      throw Error(`Cannot resolve arm state from unknown input: ${input}`);
    }

    return output;
  }

  resolveArmCommand(input) {
    const { SecuritySystemCurrentState } = this.homebridge.hap.Characteristic;

    const armCommands = {
      AWAY_ARM: 'ARM',
      STAY_ARM: 'ARMDAY',
      DISARMED: 'DARM',
      NIGHT_ARM: 'ARMNIGHT',
    };

    const state = Object.keys(armCommands).find(
      (key) => SecuritySystemCurrentState[key] === input,
    );

    const output = armCommands[state];

    if (typeof output === 'undefined') {
      throw Error(`Cannot resolve arm command from unknown input: ${input}`);
    }

    return output;
  }

  getCurrentAlarmState(callback) {
    this.log('Getting current alarm state.');

    this.request('EST')
      .then(({ STATUS: [status] }) => callback(null, this.resolveArmState(status)))
      .catch(callback);
  }

  setTargetAlarmState(value, callback) {
    this.log(`Setting target alarm state to: ${value}`);

    this.request(this.resolveArmCommand(value))
      .then(() => {
        callback(); // Successful action.

        setImmediate(() => {
          const { SecuritySystemCurrentState } = this.homebridge.hap.Characteristic;
          this.service.setCharacteristic(SecuritySystemCurrentState, value);
        });
      })
      .catch(callback);
  }

  getServices() {
    const { Service, Characteristic } = this.homebridge.hap;

    this.service = new Service.SecuritySystem(this.name);

    const currentStateCharacteristic = this.service
      .getCharacteristic(Characteristic.SecuritySystemCurrentState)
      .on('get', this.getCurrentAlarmState.bind(this));

    const targetStateCharacteristic = this.service
      .getCharacteristic(Characteristic.SecuritySystemTargetState)
      .on('get', this.getCurrentAlarmState.bind(this))
      .on('set', this.setTargetAlarmState.bind(this));

    const { NIGHT_ARM } = Characteristic.SecuritySystemTargetState;
    const validValues = targetStateCharacteristic.props.validValues
      .filter((state) => state !== NIGHT_ARM);
    targetStateCharacteristic.setProps({ validValues });

    this.accessoryInformation.setCharacteristic(Characteristic.Model, this.model);

    this.pollCharacteristics.push(currentStateCharacteristic);

    return [this.accessoryInformation, this.service];
  }
}

module.exports = Alarm;
