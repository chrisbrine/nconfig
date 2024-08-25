import {
  ConfigFileKeys,
  ConfigFormat,
  ConfigSettings,
  ConfigValue,
  ConfigValueSettings,
  ConfigValueTypes,
} from "../types";
import { getKeys } from "../utils";

export class Config {
  private config: ConfigFormat = {};
  private settings: ConfigSettings = new Map();
  private ttl: number;
  constructor(config: ConfigFormat, defaultTtl = 0) {
    this.config = config;
    this.ttl = defaultTtl;
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

  public get(key: string) {
    const setting = this.settings.get(key);
    if (setting) {
      if (this.okTime(setting.ttl || 0, setting.createdAt)) {
        return setting.value;
      }
      this.settings.delete(key);
    }
    if (key in this.config) {
      const item = this.config[key];
      let value: ConfigValueTypes =
        typeof item === "object" && "value" in item ? item.value : item;
      if (typeof item === "object" && "keys" in item) {
        const keys = item.keys;
        value = getKeys(
          keys as ConfigFileKeys | ConfigFileKeys[],
        ) as ConfigValueTypes;
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
