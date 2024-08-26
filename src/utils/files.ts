// will get the environment or setting result based on the keys given
import * as fs from "fs";
import { Caching } from "@strbjun/ncache";
import { FileObject, FileObjectKeys } from "../types";

const caching = new Caching();

const getItem = (data: FileObject, keys: FileObjectKeys): unknown => {
  if (Array.isArray(keys)) {
    let result: FileObject = data;
    for (const key of keys) {
      if (key in result === false) {
        return undefined;
      }
      if (typeof result[key] !== "object") {
        return result[key];
      }
      result = result[key] as FileObject;
    }
    return result;
  }
  return data[keys];
};

const getItemSingle = (data: FileObject, keys: FileObjectKeys): unknown => {
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

const checkEnv = (keys: FileObjectKeys): unknown => {
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

const json = (
  file: string,
  keys: FileObjectKeys,
  fileTTL?: number,
): unknown => {
  // will get the json file and grab the keys as needed, but use caching
  const slug = `${json}: ${file}`;
  const data = caching.get(slug);
  caching.setTTL(fileTTL || 0);
  if (data) {
    return getItem(data as FileObject, keys);
  }
  if (!file) {
    return undefined;
  }
  if (!fs.existsSync(file)) {
    return undefined;
  }
  const fileData = fs.readFileSync(file, "utf8");
  let result: FileObject;
  try {
    result = JSON.parse(fileData);
  } catch {
    return undefined;
  }
  caching.set(slug, result);
  return getItem(result, keys);
};

const processEnv = (data: string): FileObject => {
  // will process the environment file and return the object
  const result: FileObject = {};
  const lines = data.split("\n");
  for (const line of lines) {
    const [key, value] = line.split("=");
    result[key] = value;
  }
  return result;
};

const env = (file: string, keys: FileObjectKeys, fileTTL?: number): unknown => {
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
    return getItemSingle(data as FileObject, keys);
  }
  if (!fs.existsSync(file)) {
    return undefined;
  }
  const result: FileObject = processEnv(fs.readFileSync(file, "utf8"));
  caching.set(slug, result);
  return getItemSingle(result, keys);
};

export const PARSE = {
  json,
  env,
};
