const SecuritasDirectPlatform = require('./platform');

describe('Platform', () => {
  it('throws if constructed without first initiate module', () => {
    expect(typeof SecuritasDirectPlatform.init).toBe('function');
    expect(() => {
      // eslint-disable-next-line no-new
      new SecuritasDirectPlatform();
    }).toThrowError('Module not initiated.');
  });

  it('module exposes a platform class', () => {
    SecuritasDirectPlatform.init('homebridge');
    const platform = new SecuritasDirectPlatform('logger', {});
    expect(platform).toBeInstanceOf(SecuritasDirectPlatform);
    expect(platform.config).toMatchObject({
      pollInterval: 60,
    });
    expect(platform.logger).toBe('logger');
  });

  it('platform builds config with defaults', () => {
    const platform = new SecuritasDirectPlatform(null, {});
    expect(platform.config).toMatchObject({
      pollInterval: 60,
    });
  });

  it('platform builds config with passed values', () => {
    const config = {
      country: 'es',
      username: 'john',
      password: 'tops3cret',
      installation: '123',
      pollInterval: 120,
    };
    const platform = new SecuritasDirectPlatform(null, config);
    expect(platform.config).toMatchObject(config);
  });

  it('platform builds config with environment variables', () => {
    const envVars = {
      SECURITAS_DIRECT_USERNAME: 'john',
      SECURITAS_DIRECT_PASSWORD: 't0ps3cret',
    };

    const envKeys = Object.keys(envVars);

    envKeys.forEach((key) => { process.env[key] = envVars[key]; });

    const config = {
      username: envVars.SECURITAS_DIRECT_USERNAME,
      password: envVars.SECURITAS_DIRECT_PASSWORD,
    };

    const platform = new SecuritasDirectPlatform(null, {});
    expect(platform.config).toMatchObject(config);

    envKeys.forEach((key) => { process.env[key] = null; });
  });
});
