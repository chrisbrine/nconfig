import { ConfigFileOptions } from "../types";
import { ConfigFileKeys, ConfigFileTypes } from "../types/config";
import { PARSE } from "./files";

export const getKeys = (
  keys: ConfigFileKeys | ConfigFileKeys[],
  options?: ConfigFileOptions,
): unknown => {
  // returns the result based on the keys
  const keysArray = Array.isArray(keys) ? keys : [keys];
  for (const key of keysArray) {
    let item: unknown;
    switch (key.type) {
      case ConfigFileTypes.JSON:
        item = PARSE.json(key.file || "", key.key, options?.fileTTL || 0);
        break;
      case ConfigFileTypes.ENV:
        item = PARSE.env(key.file || "", key.key, options?.fileTTL || 0);
        break;
    }
    if (item) {
      return item;
    }
  }
  return undefined;
};
