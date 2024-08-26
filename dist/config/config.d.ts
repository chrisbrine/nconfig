import { ConfigFormat, ConfigOptions, ConfigValue, ConfigValueTypes } from "../types";
export declare class NConfig {
    private config;
    private settings;
    private ttl;
    private fileTTL;
    private defaultKeyType;
    private defaultFiles;
    private options;
    private defaultValueType;
    constructor(config: ConfigFormat, options?: ConfigOptions);
    okTime(ttl: number, createdAt: number): boolean;
    private setSetting;
    private getTTL;
    private getCreatedAt;
    private adjustItem;
    private verifyType;
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
