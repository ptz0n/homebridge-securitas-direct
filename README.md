# homebridge-securitas-direct

[![Travis CI badge](https://travis-ci.org/ptz0n/homebridge-securitas-direct.svg?branch=master)](https://travis-ci.org/github/ptz0n/homebridge-securitas-direct)

This is a plugin for [Homebridge](https://github.com/nfarina/homebridge). It's
an implementation for your Securitas Direct (Verisure non-V Box) installation and exposes the following devices:

- Security alarm

If you have a Verisure V Box system, please use [homebridge-verisure](https://github.com/ptz0n/homebridge-verisure).

## Protect linked devices & accounts

If configured, this plugin will expose your security system.
Please protect you installation from unauthorized access:

1. Generate a unique `pin` for your Homebridge config. Never, ever use the default one.
2. Lock all devices with access to your installation when not in use.
3. Remove access from users that no longer need it.
4. Keep your devices up to date.

## Installation

```bash
npm install -g homebridge-securitas-direct
```

Now you can update your configuration file to enable the plugin, see sample
snippet below.

## Configuration

Along with username and password, you also need to provide your installation ID. This can be found in the Verisure/Securitas Direct app or web application.

As part of your configuration, add an object with your Verisure credentials to
your array (list) of enabled platform plugins. Example config:

```json
"platforms": [
  {
    "platform" : "securitas-direct",
    "name" : "Securitas Direct",
    "username": "john",
    "password": "yourT0p5ecre7Passw0rd",
    "country": "es",
    "installation": "123456789",
    "pollInterval": 60
  }
]
```

* __`username`__ Required string containing your Securitas Direct username.
* __`password`__ Required string containing your Securitas Direct password.
* __`country`__ Required string containing your installation country, `es`, `fr`, `pt` etc.
* __`installation`__ Required string containing your installation ID. This can be found in the Verisure/Securitas Direct app or website.
* `pollInterval` Optional integer containing poll interval in seconds. Defaults to `60`.

### Environment variables

For convenience, the following environment variables can be used instead of placing secrets in your `config.json`.

* `SECURITAS_DIRECT_PASSWORD`
* `SECURITAS_DIRECT_USERNAME`
