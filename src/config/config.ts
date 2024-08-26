import {
  ConfigFileKeys,
  ConfigFileTypes,
  ConfigFormat,
  ConfigOptions,
  ConfigSettings,
  ConfigValue,
  ConfigValueSettings,
  ConfigValueTypes,
  ValueTypes,
} from "../types";
import { getKeys } from "../utils";

export class NConfig {
  private config: ConfigFormat = {};
  private settings: ConfigSettings = new Map();
  private ttl: number;
  private fileTTL: number;
  private defaultKeyType: ConfigFileTypes;
  private defaultFiles: Record<string, string>;
  private options: ConfigOptions;
  private defaultValueType: ValueTypes;
  constructor(config: ConfigFormat, options?: ConfigOptions) {
    this.options = options || {};
    this.config = config;
    this.ttl = this.options.defaultTTL || 0;
    this.fileTTL = this.options.fileTTL || 300000;
    this.defaultFiles = this.options.defaultFiles || {};
    this.defaultKeyType =
      (this.options.defaultKeyType as ConfigFileTypes) || ConfigFileTypes.ENV;
    this.defaultValueType = this.options.defaultType || ValueTypes.NONE;
  }

  public okTime(ttl: number, createdAt: number): boolean {
    if (ttl <= 0) {
      return true;
    }
    return Boolean(ttl && createdAt + ttl < Date.now());
  }

  private setSetting(key: string, item: ConfigValue, value: ConfigValueTypes) {
    const result: ConfigValueSettings = {
      value,
      keys:
        typeof item === "object" && "keys" in item && Array.isArray(item.keys)
          ? item.keys
          : [],
      ttl:
        typeof item === "object" && "ttl" in item
          ? Number(item.ttl || 0)
          : this.ttl,
      createdAt: Date.now(),
    };
    this.settings.set(key, result);
  }

  private getTTL(setting: ConfigValueSettings) {
    if (!setting || !setting.ttl || setting.ttl < 0) {
      return this.ttl;
    } else {
      return setting.ttl || 0;
    }
  }

  private getCreatedAt(setting: ConfigValueSettings) {
    return setting.createdAt || 0;
  }

  private adjustItem(item: ConfigValue): ConfigValue {
    if (typeof item !== "object") {
      item = { value: item };
    }
    if (!("value" in item)) {
      item.value = "";
    }
    if ("keys" in item && item.keys) {
      if (!Array.isArray(item.keys)) {
        item.keys = [item.keys as ConfigFileKeys] as ConfigFileKeys[];
      }
      item.keys.forEach((key) => {
        if (!("type" in key)) {
          key.type = this.defaultKeyType || "env";
        }
        if (!("file" in key)) {
          key.file = this.defaultFiles[key.type as ConfigFileTypes] || "";
        }
      });
    } else {
      item.keys = [];
    }
    if (!("ttl" in item)) {
      item.ttl = this.ttl;
    }
    if (!("type" in item)) {
      item.type = this.defaultValueType;
    }
    return item;
  }

  private verifyType(value: ConfigValueTypes, type: ValueTypes) {
    if (type === ValueTypes.NONE) {
      return true;
    }
    if (type === ValueTypes.STRING) {
      return typeof value === "string";
    }
    if (type === ValueTypes.NUMBER) {
      return typeof value === "number";
    }
    if (type === ValueTypes.BOOLEAN) {
      return typeof value === "boolean";
    }
    if (type === ValueTypes.OBJECT) {
      return typeof value === "object";
    }
    if (type === ValueTypes.ARRAY) {
      return Array.isArray(value);
    }
    return false;
  }

  public get(key: string) {
    const setting = this.settings.get(key);
    if (setting) {
      if (this.okTime(this.getTTL(setting), this.getCreatedAt(setting))) {
        return setting.value;
      }
      this.settings.delete(key);
    }
    if (key in this.config) {
      const item = this.adjustItem(this.config[key]);
      let value: ConfigValueTypes =
        typeof item === "object" && "value" in item ? item.value : item;
      if (typeof item === "object" && "keys" in item) {
        const keys = item.keys;
        const newValue = getKeys(keys as ConfigFileKeys | ConfigFileKeys[], {
          fileTTL: this.fileTTL,
          valueType: (item.type as ValueTypes) || ValueTypes.NONE,
        }) as ConfigValueTypes;
        if (newValue && this.verifyType(newValue, item.type as ValueTypes)) {
          value = newValue;
        }
        if (value) {
          this.setSetting(key, item, value);
        }
      } else if (value) {
        this.setSetting(key, item, value);
      }
      return value;
    }
  }

  public set(key: string, value: ConfigValueTypes) {
    this.config[key] = value;
    this.deleteConfig(key);
  }

  public deleteConfig(key: string) {
    this.settings.delete(key);
  }

  public clearConfig() {
    this.settings.clear();
  }

  public deleteSetting(key: string) {
    this.settings.delete(key);
  }

  public addSetting(key: string, item: ConfigValue) {
    this.config[key] = item;
  }

  public setTtl(ttl: number) {
    this.ttl = ttl;
  }

  public getTtl() {
    return this.ttl;
  }

  public getConfigSettings() {
    return this.config;
  }

  public all() {
    const result: Record<string, ConfigValueTypes> = {};
    for (const key in this.config) {
      const value = this.get(key);
      if (value) {
        result[key] = value;
      }
    }
    return result;
  }

  public json() {
    return JSON.stringify(this.all());
  }

  public forEach(callback: (value: ConfigValueTypes, key: string) => void) {
    // loop through all this.config, and use this.get to get value and handle it
    for (const key in this.config) {
      const value = this.get(key);
      if (value) {
        callback(value, key);
      } else {
        callback("", key);
      }
    }
  }

  public has(key: string) {
    return key in this.config;
  }
}
