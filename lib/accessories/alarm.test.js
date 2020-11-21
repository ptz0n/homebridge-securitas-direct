const hap = require('hap-nodejs');

const Alarm = require('./alarm');

describe('Alarm', () => {
  const homebridge = { hap };
  const logger = jest.fn();
  const config = {};
  const client = {};

  const { SecuritySystemCurrentState } = hap.Characteristic;
  const alarm = new Alarm(homebridge, logger, config, client);

  alarm.getServices();

  it('setup name & model', () => {
    expect(alarm.model).toBe('ALARM');
    expect(alarm.name).toBe('Alarm');
  });

  it('resolves arm states', () => {
    expect(alarm.resolveArmState('1')).toBe(SecuritySystemCurrentState.AWAY_ARM);
    expect(alarm.resolveArmState('P')).toBe(SecuritySystemCurrentState.STAY_ARM);
    expect(alarm.resolveArmState('0')).toBe(SecuritySystemCurrentState.DISARMED);
    expect(alarm.resolveArmState('Q')).toBe(SecuritySystemCurrentState.NIGHT_ARM);

    expect(() => alarm.resolveArmState('FOOBAR')).toThrow('Cannot resolve arm state from unknown input: FOOBAR');
  });

  it('resolves arm commands', () => {
    expect(alarm.resolveArmCommand(SecuritySystemCurrentState.AWAY_ARM)).toBe('ARM');
    expect(alarm.resolveArmCommand(SecuritySystemCurrentState.STAY_ARM)).toBe('ARMDAY');
    expect(alarm.resolveArmCommand(SecuritySystemCurrentState.DISARMED)).toBe('DARM');
    expect(alarm.resolveArmCommand(SecuritySystemCurrentState.NIGHT_ARM)).toBe('ARMNIGHT');

    expect(() => alarm.resolveArmCommand('FOOBAR')).toThrow('Cannot resolve arm command from unknown input: FOOBAR');
  });

  it('requests current arm state', (done) => {
    expect.assertions(2);

    client.transaction = jest.fn();
    client.transaction.mockResolvedValueOnce({ STATUS: ['0'] }); // DISARMED

    alarm.getCurrentAlarmState((error, value) => {
      expect(error).toBeFalsy();
      expect(value).toBe(SecuritySystemCurrentState.DISARMED);
      done();
    });
  });

  it('sets target arm state', (done) => {
    // expect.assertions(1);

    client.transaction = jest.fn();
    client.transaction.mockResolvedValue({ STATUS: ['1'] }); // AWAY_ARM

    alarm.setTargetAlarmState(SecuritySystemCurrentState.AWAY_ARM, (error) => {
      expect(error).toBeFalsy();

      setTimeout(() => { // Wait for setImmediate
        // expect(alarm.service.getCharacteristic(SecuritySystemCurrentState).value)
        //   .toBe(SecuritySystemCurrentState.AWAY_ARM);
        done();
      }, 200);
    });
  });
});
