# nConfig

A basic configuration library that can retrieve options from either an environment variable, a .env file, or a .json file.

## How to use

Import the Config class in order to get started. Pass along your configuration setup.

**Configuration Object**

The configuration object to pass onto `new Config(ConfigurationObject)` is:

```
{
  [config key1]: {
    value: value for setting
    ttl: Time to expire from time last retrieved
    keys: [
      {
        key: "key to use within config parameter",
        type: use ConfigFileTypes enum to declare if json or env
        file: "Set the file whether a .env file or json file, if .env you do not need a file as if no file is set it'll only check the environment variables but it will always check the terminal environment variables first"
      }... and can add more, though it will process in order for the first match
    ]
  },
  [config key2]: value for setting also allowed here
}
```

That is all that is needed. Otherwise just declare the config in a global position so it doesn't keep retrieving the data every time, and then you can use the following functions:

`config.get(key)`

- This will get the config value for the current key
  `config.set(key, value)`
- You can replace the value no matter what it is to the given value, but it will not rewrite it to a file
  `config.forEach((value, key) => { ... })`
- Will let you run a forEach on every config value
  `config.json()`
- Can get a json formatted return for every single config option

## To do

- add YAML support
- add other configuration file support
- add spaces support for config so that it can be in categories
- add type checking support
