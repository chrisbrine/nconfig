"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSpaces = void 0;
const config_1 = require("../config");
class ConfigSpaces {
    constructor(config, options) {
        this.spaces = new Map();
        this.config = config;
        this.options = options || {};
        Object.keys(this.config).forEach((key) => {
            this.addSpace(key, this.config[key]);
        });
    }
    addSpace(key, config) {
        this.spaces.set(key, new config_1.NConfig(config, this.options));
    }
    deleteSpace(key) {
        this.spaces.delete(key);
    }
    getSpace(key) {
        return this.spaces.get(key);
    }
    all() {
        return this.spaces;
    }
    keys() {
        return Array.from(this.spaces.keys());
    }
    values() {
        return Array.from(this.spaces.values());
    }
    size() {
        return this.spaces.size;
    }
    clear() {
        this.spaces.clear();
    }
    get(key, configKey) {
        const space = this.getSpace(key);
        if (space) {
            return space.get(configKey);
        }
        return undefined;
    }
    set(key, configKey, value) {
        const space = this.getSpace(key);
        if (space) {
            space.set(configKey, value);
        }
    }
    forEach(callback) {
        this.spaces.forEach(callback);
    }
    forEachValues(callback) {
        this.spaces.forEach((space, key) => {
            space.forEach((value, configKey) => {
                callback(value, configKey, key);
            });
        });
    }
    json() {
        const result = {};
        this.spaces.forEach((space, key) => {
            result[key] = space.all();
        });
        return JSON.stringify(result);
    }
}
exports.ConfigSpaces = ConfigSpaces;
