"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeys = void 0;
const config_1 = require("../types/config");
const files_1 = require("./files");
const getKeys = (keys) => {
    // returns the result based on the keys
    const keysArray = Array.isArray(keys) ? keys : [keys];
    for (const key of keysArray) {
        let item;
        switch (key.type) {
            case config_1.ConfigFileTypes.JSON:
                item = files_1.PARSE.json(key.file || "", key.key);
                break;
            case config_1.ConfigFileTypes.ENV:
                item = files_1.PARSE.env(key.file || "", key.key);
                break;
        }
        if (item) {
            return item;
        }
    }
    return undefined;
};
exports.getKeys = getKeys;
