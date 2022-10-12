/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { BeforeChatEvent, Dimension, Entity, Player, world } from "@minecraft/server";
// import EventEmitter from "./eventemitter.js";
// import { execCmd } from "./mc.js";
// import message from "./message.js";
// import { getStack, renameFn, tagFilter, testTagFilter } from "./misc.js";
// import permission from "./permission.js";
// import { storageDefault } from "./storage.js";
// import { typeObjects, TypeObjects } from "./types.js";

export default class cc {
    static get argumentParser() { return argumentParser; }
    static get paramTypes() { return ParamTypes; }
    static get paramFlags() { return ParamFlags; }

    static get on() { return event.addEventListener; }
    static get addEventListener() { return event.addEventListener; }
    static get off() { return event.removeEventListener; }
    static get removeEventListener() { return event.removeEventListener; }

    static get prefix() { return prefix; }
    static set prefix(v) {
        if (v[0] == "/") throw new TypeError("Prefix cannot start with SLASH ('/')");
        if (v.includes(" ")) throw new TypeError("Prefix cannot have a SPACE");
        prefix = v;
    }

    /**
     * Creates a new custom command.
     * @param id Custom command identifier.
     * @param propertyInitializer Property initializer.
     */
    static register(id: string, propertyInitializer: { [K in Exclude<keyof cc, "id">]?: cc[K] } = {}) {
        const ncc = new cc(id, propertyInitializer);
        event.emit("register", ncc);
        return ncc;
    }

    /**
     * Gets custom command from identifier.
     * @param id Custom command identifier.
     * @returns Custom command.
     */
    static "get"(id: string) { return commandList.get(id); }

    /**
     * Gets custom command from command trigger.
     * @param trigger Command trigger.
     */
    static getFromTrigger(trigger: string): cc | void {
        for (const cc of commandList.values())
            if (cc.trigger instanceof RegExp ? cc.trigger.test(trigger) : cc.trigger.includes(trigger))
                return cc;
    }

    /**
     * Test if a custom command exists or not based from command identifier.
     * @param id Custom command identifier.
     * @returns Boolean -- True if custom command exists.
     */
    static exist(id: string) { return commandList.has(id); }

    /**
     * Deletes a custom command.
     * @param id Custom command identifier.
     * @returns Boolean -- True if custom command exists and has been successfully deleted.
     */
    static "delete"(id: string) {
        const cmd = commandList.get(id);
        if (!cmd) return false;

        cmd.onDelete?.();

        const emitData: ccEvents["delete"] = {
            command: cmd,
            cancel: false
        };
        event.emit("delete", emitData);
        if (emitData.cancel) return false;

        return commandList.delete(id);
    }

    /**
     * Gets custom command list.
     * @returns Custom command iterator.
     */
    static getList() { return commandList.values(); }

    static *[Symbol.iterator]() { yield* this.getList(); }

    /**
     * Executes custom command.
     * @param beforeChatEvd Before chat event data.
     */
    static execute(beforeChatEvd: BeforeChatEvent) {
        let {sender: plr, message: msg} = beforeChatEvd;
        msg = msg.substring(prefix.length);

        try {
            const args = argumentParser.parseArg(msg),
                trigger = args.shift() ?? "";
            
            const cmd = this.getFromTrigger(trigger);
            if (!cmd) throw new ccError(`Command not found: '${trigger}'`, "ReferenceError");
            if (!cmd.enabled) throw new ccError(`Command is disabled: ${cmd.name}`, "TypeError");

            const plrTags = plr.getTags();
            const plrPermLvl = permission.getPlayerLevel(plr);
            if (plrPermLvl < cmd.minPermLvl || testTagFilter(cmd.tagFilter, plrTags) != 1) throw new ccError(`You have no permission to use this command: ${cmd.name}`, "TypeError");

            const argFull = msg.substring(trigger.length + 1);

            const emitData: ccEvents["execute"] = {
                executer: plr,
                command: cmd,
                trigger,
                argFull,
                args,
                beforeChatEvd,
                cancel: false,
            };
            event.emit("execute", emitData);
            if (emitData.cancel) return;
            
            const typedArgs = cmd.paramTypes?.parse(args) ?? args;
            const admins = cmd.minPermLvl > 0 ? [...permission.getAdmins(plrPermLvl, [plr])] : [];

            const vars: commandExecutionData = {
                executer: plr,
                trigger,
                argFull,
                args,
                typedArgs,
                log: (msg) => {
                    message.sendMsgToPlayers(admins, `§7${plr.name}§r§0 - §8${message.convertMsg(msg).replace(/\u00a7.|[\r\n]|\s{2,}/g, "").substring(0, 120)}}`);
                    plr.sendMsg(msg);
                },
                beforeChatEvd,
            };
            cmd.onTrigger(args, vars);
        } catch(e) {
            if (e instanceof Error) {
                if (
                    e instanceof ccError
                    || e.name == "Error"
                    || e.name == "SyntaxError"
                    || e.name == "RangeError"
                ) plr.sendMsg(`§cError! ${e.message}`);
                else plr.sendMsg(`An error occured when executing a custom command: \n${e}\n${e.stack}`);
            }
            else plr.sendMsg(e);
        }
    }

    /**
     * Creates a new custom command.
     * @param id Custom command identifier.
     * @param propertyInitializer Property initializer.
     */
    constructor(id: string, propertyInitializer: { [K in Exclude<keyof cc, "id">]?: cc[K] } = {}) {
        this.id = id;
        Object.assign(this, propertyInitializer);

        commandList.set(id, this);
        //event.emit('register', this)
    }

    /** Command identifier. */
    readonly id;
    /** Command name. */
    name = "(Unnamed)";
    /** Command description. */
    description = "(No description)";

    /** Minimum permission level to execute the command. */
    minPermLvl = 0;
    /** Tag filter. */
    tagFilter: tagFilter = {};

    /** Command trigger. */
    trigger: RegExp | string[] = [];
    /** Parameter types. */
    paramTypes?: ParamTypes;
    /** Function to be called on trigger. */
    onTrigger: (arg: string[], data: commandExecutionData) => void = () => {};

    /** Determines whether command is enabled or not. */
    enabled = true;
    /** Determines whether command is hidden or not. */
    hidden = false;

    /** Function to be called on delete. */
    onDelete?: () => void;
}

const commandList = new Map<string, cc>();
let prefix = "!";

interface commandExecutionData {
    [k: string]: any
    readonly executer: Player
    readonly trigger: string
    readonly argFull: string
    readonly args: string[]
    readonly typedArgs: any[]
    readonly log: (msg: any) => void
    readonly beforeChatEvd: BeforeChatEvent
}

export class ParamTypes {
    constructor(type: paramTypeSequenceData[] = []) {
        this.type = type;
    }

    /** Param types. */
    type;

    /**
     * Parses argument.
     * @param arg Argument.
     * @returns Parsed argument.
     */
    parse(arg: string | string[]): any[] {
        arg = typeof arg == "string" ? argumentParser.parseArg(arg) : arg;
        if (!this.type.length) return arg;

        // errors
        let argRange: [number, number] = [Infinity, -Infinity], argErrLvl = 0;
        const setRangeErr = (min: number, max: number, lvl: number) => {
            const [cmin, cmax] = argRange;
            argRange = [
                min < cmin ? min : cmin,
                max > cmax ? max : cmax
            ];
            argErrLvl = lvl > argErrLvl ? lvl : argErrLvl;
        };

        let parseErrType: string[] = [], parseErr: Error | undefined, parseErrLvl = 0;
        const setParseErr = (e: Error | paramType, lvl: number): false => {
            if (lvl < parseErrLvl) return false;
            if (lvl > parseErrLvl) {
                parseErrType = [];
                parseErrLvl = lvl;
                parseErr = undefined;
            }
            if (e instanceof Error) parseErr = e;
            else {
                const s = typeof e == "string" ? `'${e}'` : e instanceof RegExp ? `${e}` : e.name;
                if (!parseErrType.includes(s)) parseErrType.push(s);
            }
            return false;
        };


        sequenceLoop:
        for (const sd of this.type) {
            const { sequence, minArgs = sequence.length, rest } = sd;
            const out: any[] = [];

            typeLoop:
            for (const [i, s] of sequence.entries()) {
                if (i >= sequence.length) break;
                if (!(i in arg)) {
                    if (i >= minArgs) break;
                    setRangeErr(minArgs, rest ? Infinity : sequence.length, minArgs);
                    continue sequenceLoop;
                }
                for (const type of Array.isArray(s) ? s : [s]) {
                    //@ts-expect-error
                    const r = testArg(arg[i], type);
                    if (r.status !== 1) {
                        if (r.status == -1) setParseErr(r.err, i + 1);
                        else setParseErr(type, i + 1);
                        continue;
                    }
                    out.push(r.value);
                    continue typeLoop;
                }
                continue sequenceLoop;
            }

            const restArg = arg.slice(sequence.length);
            if (restArg.length) {
                if (!rest) {
                    setParseErr(new RangeError(`Argument${arg.length == 1 ? "" : "s"} passed is outside bound (${arg.length}/${sequence.length})`), sequence.length - 0.5);
                    continue;
                }
                for (const [i, arg] of restArg.entries()) {
                    const r = testArg(arg, rest);
                    if (r.status !== 1) {
                        if (r.status == -1) setParseErr(r.err, i + 1 + sequence.length);
                        else setParseErr(rest, i + 1 + sequence.length);
                        continue sequenceLoop;
                    }
                    out.push(r.value);
                }
            }

            return out;
        }

        if (argErrLvl > parseErrLvl) throw new ccError(`Expecting ${ argRange[1] == Infinity ? `at least ${argRange[0]} argument${argRange[0] == 1 ? "" : "s"}` : argRange[0] == argRange[1] ? `${argRange[0]} argument${argRange[0] == 1 ? "" : "s"}` : `${argRange[0]} - ${argRange[1]} argument${argRange[1] == 1 ? "" : "s"}` }, got ${arg.length}`, "RangeError");
        if (parseErr) throw new ccError(parseErr.message, parseErr.name);
        throw new ccError(`Expecting ${parseErrType.join(" | ")}, got '${arg[parseErrLvl - 1]}'`, "TypeError");
    } 
}

export class ParamFlags {
    constructor(flags: Record<string, paramType | paramType[]> = {}, name = "flags") {
        Object.assign(this.flags, flags);
        this.name = name;

    }

    /** Flags. */
    flags: Record<string, paramType | paramType[]> = Object.create(null);

    /** Flag name. */
    name;

    /**
     * Parses flag string.
     * @param flagStr Flag string.
     */
    parse(flagStr: string | string[]) {
        flagStr = Array.isArray(flagStr) ? flagStr : argumentParser.parseArg(flagStr.slice(1, -1));
        const obj = Object.create(null);

        flagsLoop:
        while (flagStr.length) {
            const [k = "", v] = flagStr.splice(0, 2) as string[];
            if (v === undefined) throw new SyntaxError(`Expecting value for flag '${k}'`);

            const flagType = this.flags[k];
            if (!flagType) throw new SyntaxError(`Invalid flag '${k}'`);

            let parseErrType: string[] = [];

            for (const type of Array.isArray(flagType) ? flagType : [flagType]) {
                const r = testArg(v, type);
                if (r.status === 1) {
                    obj[k] = r.value;
                    continue flagsLoop;
                }
                const s = typeof type == "string" ? `'${type}'` : type instanceof RegExp ? `${type}` : type.name;
                if (!parseErrType.includes(s)) parseErrType.push(s);
            }

            throw new ccError(`Expecting ${parseErrType.join(" | ")}, got '${v}'`, "TypeError");
        }

        return obj;
    }
}

class ccError extends Error {
    constructor(message?: string, name = "Error") {
        super(message);
        this.name = name;
        this.stack = getStack(1);
    }
}

function testArg (arg: string, argType: paramType): {
    status: 1
    value: any
} | {
    status: 0
} | {
    status: -1
    err: any
} {
    if (argType instanceof TypeObjects) { // argType = objectType
        try {
            const data = JSON.parse(arg);
            return argType.test(data) ? {
                status: 1,
                value: data
            } : {
                status: 0
            };
        } catch(e) {
            return {
                status: -1,
                err: e instanceof Error && !(e instanceof TypeError) ? e : argType
            };
        }
    } else if (typeof argType == "string") { // argType = string
        return argType === arg ? {
            status: 1,
            value: arg
        } : {
            status: 0
        };
    }
    else if (typeof argType == "function") { // argType = function
        try {
            return {
                status: 1,
                value: argType(arg)
            };
        } catch (e) {
            return {
                status: -1,
                err: e instanceof Error && !(e instanceof TypeError) ? e : argType
            };
        }
    } else if (argType instanceof RegExp) { // argType = regex
        const m = arg.match(argType);
        return m ? {
            status: 1,
            value: m
        } : {
            status: 0
        };
    } else if (argType instanceof ParamFlags) {
        try {
            return {
                status: 1,
                value: argType.parse(arg)
            };
        } catch {
            return {
                status: 0
            };
        }
    } else {
        throw new TypeError("invalid argument type");
    }
}

//// ARGUMENT PARSER ////

export class argumentParser {
    /**
     * Parses any string.
     * @param str String.
     * @returns String.
     */
    static parseAny = (str: string) => str;

    /**
     * Parses a number from string.
     * @param num Number.
     * @param min Minimum value.
     * @param max Maximum value.
     * @returns Number.
     */
    static parseNumber = (num: string, min = -Infinity, max = Infinity) => {
        const i = +num;
        if (isNaN(i)) throw new TypeError(`'${num}' is not a number`);
        if (i < min || i > max) throw new RangeError(`${i} is outside accepted value range ([${min}, ${max}])`);
        return i;
    };

    static #time: Record<string, number> = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
        w: 604800,
        mth: 2419200 /* 28 days */,
        y: 31449600 /* 365 days */
    };

    /**
     * Parses time format to milliseconds.
     * @param time Time format.
     * @returns Time in milliseconds.
     */
    static parseTime = (time: string) => {
        if (!/^(\d+(mth|[smhdwy]))+$/.test(time)) throw new SyntaxError(`Invalid time format '${time}'`);
        let total = 0;
        for (const [,duration = "0", mod = "s"] of time.matchAll(/(\d+)(mth|[smhdwy])/g)) total += (this.#time[mod] ?? 0) * +duration;
        return total * 1000;
    };

    /**
     * CReates a new parser for number.
     * @param min Minimum value.
     * @param max Maximum value.
     * @returns Parser.
     */
    static number = (min = -Infinity, max = Infinity) => {
        return (num: string) => this.parseNumber(num, min, max);
    };

    static #booleanValues = {
        true: Object.setPrototypeOf({
            true: null,
            1: null,
            y: null,
            yes: null,
        }, null) as Record<string, null>,
        false: Object.setPrototypeOf({
            false: null,
            0: null,
            n: null,
            no: null,
        }, null) as Record<string, null>
    };

    /**
     * Parses boolean from string.
     * @param bool Boolean.
     * @returns Boolean.
     */
    static parseBoolean = (bool: string) => {
        if (bool in this.#booleanValues.true) return true;
        else if (bool in this.#booleanValues.false) return false;
        else throw new TypeError(`'${bool}' is not a boolean`);
    };

    static #toggleValues = {
        true: Object.setPrototypeOf({
            on: null,
            enable: null
        }, null) as Record<string, null>,
        false: Object.setPrototypeOf({
            off: null,
            disable: null
        }, null) as Record<string, null>
    };

    /**
     * Parses boolean from string.
     * @param toggle Toggle.
     * @returns Boolean.
     */
    static parseToggle = (toggle: string) => {
        if (toggle in this.#toggleValues.true) return true;
        else if (toggle in this.#toggleValues.false) return false;
        else throw new TypeError(`'${toggle}' is not a toggle`);
    };

    /**
     * Parses JSON from string.
     * @param data JSON data.
     */
    static parseJSON = (data: string) => { return JSON.parse(data); };

    /**
     * Creates a new object type parser.
     * @param type Object type.
     * @returns Object type parser function.
     */
    static type = (type: typeObjects) => {
        return renameFn((data: string) => {
            const json = JSON.parse(data);
            if (!type.test(json)) throw new TypeError(`'${JSON.stringify(data).replace(/\n */g, " ").substring(0, 30)}...' is not equal to object type ${type.name}`);
            return json;
        }, type.name);
    };

    /**
     * Creates a new flag parser.
     * @param flags Flags.
     * @returns Flag parser function.
     */
    static flag = (flags: ParamFlags) => {
        return renameFn((data: string) => {
            try { return flags.parse(data); }
            catch { throw new TypeError(`'${data}' is not equal to flag type ${flags.name}`); }
        }, flags.name);
    };

    /**
     * Creates a new selector executer.
     * @param selector Selector.
     * @returns Selector executer.
     */
    static parseSelector = (selector: string) => {
        return function* (source?: Player | Entity | Dimension, onNotFound: () => void = () => { throw new Error(`Player not found: '${selector}'`); }) {
            let plrFound = false;
            if (/^@[spear](\[.*\])?$/.test(selector)) {
                const nlist: string[] = execCmd(`testfor ${selector}`, source, true).victim ?? [];
                const nlistMapped: Record<string, null> = Object.setPrototypeOf( Object.fromEntries( nlist.map(v => [v, null] as [string, null]) ), null);
                for (const plr of world.getPlayers())
                    if (plr.name in nlistMapped) {
                        plrFound = true;
                        yield plr;
                    }
            }
            else {
                if (selector[0] == "@") selector = selector.substring(1);
                const pname: string = selector[0] == "\"" && selector[selector.length - 1] == "\"" ? JSON.parse(selector) : selector;
                for (const plr of world.getPlayers())
                    if (plr.name == pname) {
                        plrFound = true;
                        yield plr;
                    }
            }
            if (!plrFound) onNotFound?.();
        };
    };

    /**
     * Parses argument.
     * @param arg String argument.
     * @returns Arguments.
     */
    static parseArg = (arg: string) => {
        const group = {
            "(": ")",
            "{": "}",
            "[": "]",
            "\"": "\""
        };
        let sequence: string[] = [],
            curSequence = "",
            isEscaped = false,
            groupCloseData: string[] = [],
            groupClose = "";
        for (const char of arg + " ") {
            if (isEscaped) {
                isEscaped = false;
            }
            else if (char == "\\") {
                isEscaped = true;
                if (groupCloseData[0] === "\"") continue;
            }
            else if (char in group && groupClose !== "\"") {
                //@ts-expect-error
                const close = group[char];
                groupCloseData.push(close);
                groupClose = close;
            }
            else if (char === groupClose) {
                groupCloseData.pop();
                //@ts-expect-error
                groupClose = groupCloseData[groupCloseData.length - 1];
            }
            else if (char === " " && !groupClose) {
                if (curSequence) {
                    if (curSequence[0] === "\"" && curSequence[curSequence.length - 1] === "\"") curSequence = curSequence.slice(1, -1);
                    sequence.push(curSequence);
                    curSequence = "";
                }
                continue;
            }
            curSequence += char;
        }
        if (curSequence) sequence.push(curSequence);
        return sequence;
    };

    protected constructor() { throw new TypeError(`Class '${this.constructor.name}' is not constructable`); }
}

renameFn(argumentParser.parseArg, "arg");
renameFn(argumentParser.parseBoolean, "boolean");
renameFn(argumentParser.parseJSON, "JSON");
renameFn(argumentParser.parseNumber, "number");
renameFn(argumentParser.parseSelector, "selector");
renameFn(argumentParser.parseToggle, "toggle");
renameFn(argumentParser.parseTime, "timeFormat");

type paramType = ParamFlags | typeObjects | string | RegExp | ( ( arg: string ) => any )
type paramTypeSequence = (paramType | paramType[])[]
type paramTypeSequenceData = {
    sequence: paramTypeSequence
    rest?: paramType
    minArgs?: number
}

//// EVENT ////

type ccEvents = {
    register: cc
    execute: {
        readonly executer: Player
        readonly command: cc
        readonly trigger: string
        readonly argFull: string
        readonly args: string[]
        readonly beforeChatEvd: BeforeChatEvent
        cancel: boolean
    }
    delete: {
        readonly command: cc
        cancel: boolean
    }
}

const event = new EventEmitter<ccEvents>("cc");

event.handle("emitError", evd => {
    if (evd.eventName == "execute" || evd.eventName == "delete")
        evd.throw = true;
});

//// STORAGE ////

storageDefault.on("save", ({data}) => {
    data.cc = {
        prefix: cc.prefix
    };
});

storageDefault.on("load", ({data}) => {
    if (!data.cc) return;
    cc.prefix = data.cc.prefix;
});
