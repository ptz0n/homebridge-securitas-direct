const hap = require('hap-nodejs');

const SecuritasDirect = require('./securitas-direct');

describe('SecuritasDirect', () => {
  const homebridge = { hap };
  const config = { deviceLabel: 'ASD123' };
  const client = {};

  it('logs with accessory name prefix', () => {
    const logger = jest.fn();
    const accessoryWithLogger = new SecuritasDirect(homebridge, logger, config, client);

    accessoryWithLogger.name = 'Alarm';
    accessoryWithLogger.log('Something happened.');

    expect(logger.mock.calls[0][0]).toBe('info');
    expect(logger.mock.calls[0][1]).toBe('Alarm: Something happened.');
  });
});
