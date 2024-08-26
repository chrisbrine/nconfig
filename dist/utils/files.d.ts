import { FileObjectKeys } from "../types";
export declare const PARSE: {
    json: (file: string, keys: FileObjectKeys, fileTTL?: number) => unknown;
    env: (file: string, keys: FileObjectKeys, fileTTL?: number) => unknown;
};
