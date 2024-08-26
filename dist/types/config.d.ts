export declare enum ConfigFileTypes {
    JSON = "json",
    ENV = "env"
}
export declare enum ValueTypes {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    OBJECT = "object",
    ARRAY = "array",
    NONE = "none"
}
export interface ConfigFileKeys {
    key: string | string[];
    file?: string;
    type?: ConfigFileTypes;
}
export interface ConfigValueSettings {
    value: ConfigValueTypes;
    type?: ValueTypes;
    keys?: ConfigFileKeys | ConfigFileKeys[];
    ttl?: number;
    createdAt?: number;
}
export type ConfigSettings = Map<ConfigKey, ConfigValueSettings>;
export type ConfigKey = string;
export type AllowedConfigValues = string | number | boolean;
export type ConfigValueTypes = AllowedConfigValues | Record<string, AllowedConfigValues>;
export type ConfigValue = ConfigValueTypes | ConfigValueSettings;
export type ConfigFormat = Record<ConfigKey, ConfigValue>;
export interface ConfigOptions {
    defaultFiles?: {
        [key in ConfigFileTypes]?: string;
    };
    defaultKeyType?: ConfigFileTypes;
    fileTTL?: number;
    defaultTTL?: number;
    defaultType?: ValueTypes;
}
