# Commander v5 Exercise

Try out the new support for nested subcommands with action handlers coming in Commander v5 .

Emulate a real cli which includes nested commands,
based on [cordova-cli](https://cordova.apache.org/docs/en/9.x/reference/cordova-cli/index.html)

The nested commands are `config` implemented inline, and `platform` implemented in a module and added using `.addCommand`.

```sh
$ node index.js platform rm --help
Usage: cordova platform remove|rm [options] <platform...>

Remove specified platforms

Options:
  --nosave    Do not delete specified platforms from config.xml & package.json after removing them
  -h, --help  display help for command

$ node index.js platform remove ios android --nosave
platform remove
parameters: { platforms: [ 'ios', 'android' ] }
command options: { nosave: true }
common options: { updateNotifier: true, telemetry: true }
```
