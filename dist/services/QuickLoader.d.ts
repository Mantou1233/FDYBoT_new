import fg from "fast-glob";
export declare const rez: (s: string) => string;
type TypeBoolean = 0 | 1;
export default class QuickLoader {
    cfg: Partial<{
        filter: (file: string) => boolean | TypeBoolean;
        pattern: Parameters<typeof fg>[0];
        include: string[];
        excludes: string[];
    }>;
    constructor(cfg: QuickLoader["cfg"]);
    load(handler?: (v: any) => any): Promise<void>;
}
export {};
