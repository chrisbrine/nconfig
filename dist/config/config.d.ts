import { ConfigFormat, ConfigValue, ConfigValueTypes } from "../types";
export declare class Config {
    private config;
    private settings;
    private ttl;
    constructor(config: ConfigFormat, defaultTtl?: number);
    okTime(ttl: number, createdAt: number): boolean;
    private setSetting;
    get(key: string): ConfigValueTypes | undefined;
    set(key: string, value: ConfigValueTypes): void;
    deleteConfig(key: string): void;
    clearConfig(): void;
    deleteSetting(key: string): void;
    addSetting(key: string, item: ConfigValue): void;
    setTtl(ttl: number): void;
    getTtl(): number;
    getConfigSettings(): ConfigFormat;
    all(): Record<string, ConfigValueTypes>;
    json(): string;
    forEach(callback: (value: ConfigValueTypes, key: string) => void): void;
    has(key: string): boolean;
}
