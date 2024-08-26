import { ValueTypes } from "./config";

export type FileObject = Record<string, unknown>;
export type FileObjectKeys = string | string[];

export interface ConfigFileOptions {
  fileTTL: number;
  valueType: ValueTypes;
}
