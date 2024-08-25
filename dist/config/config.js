"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NConfig = void 0;
const utils_1 = require("../utils");
class NConfig {
    constructor(config, defaultTtl = 0) {
        this.config = {};
        this.settings = new Map();
        this.config = config;
        this.ttl = defaultTtl;
    }
    okTime(ttl, createdAt) {
        if (ttl <= 0) {
            return true;
        }
        return Boolean(ttl && createdAt + ttl < Date.now());
    }
    setSetting(key, item, value) {
        const result = {
            value,
            keys: typeof item === "object" && "keys" in item && Array.isArray(item.keys)
                ? item.keys
                : [],
            ttl: typeof item === "object" && "ttl" in item
                ? Number(item.ttl || 0)
                : this.ttl,
            createdAt: Date.now(),
        };
        this.settings.set(key, result);
    }
    get(key) {
        const setting = this.settings.get(key);
        if (setting) {
            if (this.okTime(setting.ttl || 0, setting.createdAt)) {
                return setting.value;
            }
            this.settings.delete(key);
        }
        if (key in this.config) {
            const item = this.config[key];
            let value = typeof item === "object" && "value" in item ? item.value : item;
            if (typeof item === "object" && "keys" in item) {
                const keys = item.keys;
                value = (0, utils_1.getKeys)(keys);
                this.setSetting(key, item, value);
            }
            return value;
        }
    }
    set(key, value) {
        this.config[key] = value;
        this.deleteConfig(key);
    }
    deleteConfig(key) {
        this.settings.delete(key);
    }
    clearConfig() {
        this.settings.clear();
    }
    deleteSetting(key) {
        this.settings.delete(key);
    }
    addSetting(key, item) {
        this.config[key] = item;
    }
    setTtl(ttl) {
        this.ttl = ttl;
    }
    getTtl() {
        return this.ttl;
    }
    getConfigSettings() {
        return this.config;
    }
    all() {
        const result = {};
        for (const key in this.config) {
            const value = this.get(key);
            if (value) {
                result[key] = value;
            }
        }
        return result;
    }
    json() {
        return JSON.stringify(this.all());
    }
    forEach(callback) {
        // loop through all this.config, and use this.get to get value and handle it
        for (const key in this.config) {
            const value = this.get(key);
            if (value) {
                callback(value, key);
            }
            else {
                callback("", key);
            }
        }
    }
    has(key) {
        return key in this.config;
    }
}
exports.NConfig = NConfig;
