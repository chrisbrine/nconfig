"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NConfig = void 0;
const types_1 = require("../types");
const utils_1 = require("../utils");
class NConfig {
    constructor(config, options) {
        this.config = {};
        this.settings = new Map();
        this.options = options || {};
        this.config = config;
        this.ttl = this.options.defaultTTL || 0;
        this.fileTTL = this.options.fileTTL || 300000;
        this.defaultFiles = this.options.defaultFiles || {};
        this.defaultKeyType =
            this.options.defaultKeyType || types_1.ConfigFileTypes.ENV;
        this.defaultValueType = this.options.defaultType || types_1.ValueTypes.NONE;
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
    getTTL(setting) {
        if (!setting || !setting.ttl || setting.ttl < 0) {
            return this.ttl;
        }
        else {
            return setting.ttl || 0;
        }
    }
    getCreatedAt(setting) {
        return setting.createdAt || 0;
    }
    adjustItem(item) {
        if (typeof item !== "object") {
            item = { value: item };
        }
        if (!("value" in item)) {
            item.value = "";
        }
        if ("keys" in item && item.keys) {
            if (!Array.isArray(item.keys)) {
                item.keys = [item.keys];
            }
            item.keys.forEach((key) => {
                if (!("type" in key)) {
                    key.type = this.defaultKeyType || "env";
                }
                if (!("file" in key)) {
                    key.file = this.defaultFiles[key.type] || "";
                }
            });
        }
        else {
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
    verifyType(value, type) {
        if (type === types_1.ValueTypes.NONE) {
            return true;
        }
        if (type === types_1.ValueTypes.STRING) {
            return typeof value === "string";
        }
        if (type === types_1.ValueTypes.NUMBER) {
            return typeof value === "number";
        }
        if (type === types_1.ValueTypes.BOOLEAN) {
            return typeof value === "boolean";
        }
        if (type === types_1.ValueTypes.OBJECT) {
            return typeof value === "object";
        }
        if (type === types_1.ValueTypes.ARRAY) {
            return Array.isArray(value);
        }
        return false;
    }
    get(key) {
        const setting = this.settings.get(key);
        if (setting) {
            if (this.okTime(this.getTTL(setting), this.getCreatedAt(setting))) {
                return setting.value;
            }
            this.settings.delete(key);
        }
        if (key in this.config) {
            const item = this.adjustItem(this.config[key]);
            let value = typeof item === "object" && "value" in item ? item.value : item;
            if (typeof item === "object" && "keys" in item) {
                const keys = item.keys;
                const newValue = (0, utils_1.getKeys)(keys, {
                    fileTTL: this.fileTTL,
                    valueType: item.type || types_1.ValueTypes.NONE,
                });
                if (newValue && this.verifyType(newValue, item.type)) {
                    value = newValue;
                }
                if (value) {
                    this.setSetting(key, item, value);
                }
            }
            else if (value) {
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
