import { ConfigFormat, ConfigKey, ConfigOptions, ConfigValueTypes, SpaceOptions } from "../types";
import { NConfig } from "../config";
export declare class ConfigSpaces {
    private config;
    private options;
    private spaces;
    constructor(config: SpaceOptions, options?: ConfigOptions);
    addSpace(key: string, config: ConfigFormat): void;
    deleteSpace(key: string): void;
    getSpace(key: string): NConfig | undefined;
    all(): Map<string, NConfig>;
    keys(): string[];
    values(): NConfig[];
    size(): number;
    clear(): void;
    get(key: string, configKey: ConfigKey): unknown;
    set(key: string, configKey: ConfigKey, value: ConfigValueTypes): void;
    forEach(callback: (value: NConfig, key: string) => void): void;
    forEachValues(callback: (value: ConfigValueTypes, configKey: ConfigKey, key: string) => void): void;
    json(): string;
}
