# nConfig

A basic configuration library that can retrieve options from either an environment variable, a .env file, or a .json file.

## How to use

Import the Config class in order to get started. Pass along your configuration setup.

**Configuration Object**

The configuration object to pass onto `new NConfig(ConfigurationObject, options)` is:

```
{
  [config key1]: {
    value: value for setting
    type: This would be the variable type using the ValueTypes enum.
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

The options object isn't required though if you decide to customize this you can pass:

```
{
  defaultFiles?: {
    [ConfigFileTypes type]: "default filename to use if not set above"
  },
  defaultKeyType?: set to the default ConfigFileTypes for if not set above
  fileTTL?: the amount of time to cache any file. Default is 5 minutes, in ms.
  defaultTTL?: the amount of time to cache any configuration value, if 0 it will keep it saved. in ms.
  defaultType?: the default variable type for type checking of values. Default is none. Uses ValueTypes enum.
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

## Using Spaces support

There is an addition of namespacing or spaces for separating configuration into different categories or sections as well.

You just have to include the `ConfigSpace` object.

`const space = new ConfigSpace(SpaceOptions, ConfigOptions)`

- The config options work similar to the above and will pass it on to every config by default
- SpaceOptions is for setting up various different config spaces. It is pretty easy to understand its approach as it works the following way:

```
{
  [space key]: ConfigurationObject similar to how it is done for the NConfig class.
}
```

After, the following commands will work:

`space.get(key, configKey)`

- It will get the value from the config key in the space in key.
  `space.set(key, configKey, value)`
- Will allow for running the set command within the space 'key'.
  `space.json()`
- Will get a json object for every configuration object in the sapce.
  `space.forEach((config, key) => ...)`
- Will run a foreach loop on every configuration space and give the key for it
  `space.forEachValues((config, configKey, key) => ...)`
- Will run a foreach loop on every value in every config value

## To do

- add other configuration file support including YAML
