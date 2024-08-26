import {
  ConfigFormat,
  ConfigKey,
  ConfigOptions,
  ConfigValueTypes,
  SpaceOptions,
} from "../types";
import { NConfig } from "../config";

export class ConfigSpaces {
  private config: SpaceOptions;
  private options: ConfigOptions;
  private spaces: Map<string, NConfig> = new Map<string, NConfig>();

  constructor(config: SpaceOptions, options?: ConfigOptions) {
    this.config = config;
    this.options = options || {};

    Object.keys(this.config).forEach((key) => {
      this.addSpace(key, this.config[key]);
    });
  }

  public addSpace(key: string, config: ConfigFormat): void {
    this.spaces.set(key, new NConfig(config, this.options));
  }

  public deleteSpace(key: string): void {
    this.spaces.delete(key);
  }

  public getSpace(key: string): NConfig | undefined {
    return this.spaces.get(key);
  }

  public all(): Map<string, NConfig> {
    return this.spaces;
  }

  public keys(): string[] {
    return Array.from(this.spaces.keys());
  }

  public values(): NConfig[] {
    return Array.from(this.spaces.values());
  }

  public size(): number {
    return this.spaces.size;
  }

  public clear(): void {
    this.spaces.clear();
  }

  public get(key: string, configKey: ConfigKey): unknown {
    const space = this.getSpace(key);
    if (space) {
      return space.get(configKey);
    }
    return undefined;
  }

  public set(key: string, configKey: ConfigKey, value: ConfigValueTypes): void {
    const space = this.getSpace(key);
    if (space) {
      space.set(configKey, value);
    }
  }

  public forEach(callback: (value: NConfig, key: string) => void): void {
    this.spaces.forEach(callback);
  }

  public forEachValues(
    callback: (
      value: ConfigValueTypes,
      configKey: ConfigKey,
      key: string,
    ) => void,
  ): void {
    this.spaces.forEach((space, key) => {
      space.forEach((value, configKey) => {
        callback(value, configKey, key);
      });
    });
  }

  public json(): string {
    const result: Record<string, Record<string, ConfigValueTypes>> = {};
    this.spaces.forEach((space, key) => {
      result[key] = space.all();
    });
    return JSON.stringify(result);
  }
}
