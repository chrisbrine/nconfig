"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARSE = void 0;
// will get the environment or setting result based on the keys given
const fs = __importStar(require("fs"));
const ncache_1 = require("@strbjun/ncache");
const caching = new ncache_1.Caching();
const getItem = (data, keys) => {
    if (Array.isArray(keys)) {
        let result = data;
        for (const key of keys) {
            if (key in result === false) {
                return undefined;
            }
            if (typeof result[key] !== "object") {
                return result[key];
            }
            result = result[key];
        }
        return result;
    }
    return data[keys];
};
const getItemSingle = (data, keys) => {
    // if array then just return the first that exists as it is a single dimensional object
    if (Array.isArray(keys)) {
        for (const key of keys) {
            if (key in data) {
                return data[key];
            }
        }
        return undefined;
    }
    return data[keys];
};
const checkEnv = (keys) => {
    // checks environment variables to see first that exists
    if (Array.isArray(keys)) {
        for (const key of keys) {
            if (key in process.env) {
                return process.env[key];
            }
        }
        return undefined;
    }
    return keys in process.env ? process.env[keys] : undefined;
};
const json = (file, keys, fileTTL) => {
    // will get the json file and grab the keys as needed, but use caching
    const slug = `${json}: ${file}`;
    const data = caching.get(slug);
    caching.setTTL(fileTTL || 0);
    if (data) {
        return getItem(data, keys);
    }
    if (!file) {
        return undefined;
    }
    if (!fs.existsSync(file)) {
        return undefined;
    }
    const fileData = fs.readFileSync(file, "utf8");
    let result;
    try {
        result = JSON.parse(fileData);
    }
    catch (_a) {
        return undefined;
    }
    caching.set(slug, result);
    return getItem(result, keys);
};
const processEnv = (data) => {
    // will process the environment file and return the object
    const result = {};
    const lines = data.split("\n");
    for (const line of lines) {
        const [key, value] = line.split("=");
        result[key] = value;
    }
    return result;
};
const env = (file, keys, fileTTL) => {
    const envResult = checkEnv(keys);
    caching.setTTL(fileTTL || 0);
    if (envResult) {
        return envResult;
    }
    if (!file) {
        return undefined;
    }
    const slug = `${env}: ${file}`;
    const data = caching.get(slug);
    if (data) {
        return getItemSingle(data, keys);
    }
    if (!fs.existsSync(file)) {
        return undefined;
    }
    const result = processEnv(fs.readFileSync(file, "utf8"));
    caching.set(slug, result);
    return getItemSingle(result, keys);
};
exports.PARSE = {
    json,
    env,
};
