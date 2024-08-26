"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueTypes = exports.ConfigFileTypes = void 0;
var ConfigFileTypes;
(function (ConfigFileTypes) {
    ConfigFileTypes["JSON"] = "json";
    // YAML = "yaml", // not yet supported
    ConfigFileTypes["ENV"] = "env";
})(ConfigFileTypes || (exports.ConfigFileTypes = ConfigFileTypes = {}));
var ValueTypes;
(function (ValueTypes) {
    ValueTypes["STRING"] = "string";
    ValueTypes["NUMBER"] = "number";
    ValueTypes["BOOLEAN"] = "boolean";
    ValueTypes["OBJECT"] = "object";
    ValueTypes["ARRAY"] = "array";
    ValueTypes["NONE"] = "none";
})(ValueTypes || (exports.ValueTypes = ValueTypes = {}));
