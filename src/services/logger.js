"use strict";
exports.__esModule = true;
exports.Logger = void 0;
var colors = {
    log: "\u001b[37;1m",
    info: "\u001b[96m",
    success: "\u001b[32;1m",
    error: "\u001b[31;1m",
    warn: "\u001b[33;1m",
    event: "\u001b[34;1m",
    debug: "\u001b[35;1m",
    timestamp: "\u001b[34;1m",
    logtype: "\u001b[34;1m",
    filename: "\u001b[36;1m",
    reset: "\u001b[0m"
};
function loggerMixin(name, format) {
    return function (content) {
        var _a;
        console.log("".concat(colors.timestamp).concat(getDateStr()).concat(colors.reset, " - ").concat((_a = format !== null && format !== void 0 ? format : colors[name]) !== null && _a !== void 0 ? _a : colors["log"], "[").concat(name, "]").concat(colors.reset, " ~ ").concat(colors.filename).concat(getCallerName()).concat(colors.reset, " ").concat(colors.log).concat(content).concat(colors.reset));
    };
}
var Logger = /** @class */ (function () {
    function Logger() {
        this.log = loggerMixin("log");
        this.info = loggerMixin("info");
        this.success = loggerMixin("success");
        this.error = loggerMixin("error");
        this.warn = loggerMixin("warn");
        this.event = loggerMixin("event");
        this.debug = loggerMixin("debug");
    }
    return Logger;
}());
exports.Logger = Logger;
function getCallerName() {
    var err = new Error();
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = err.stack;
    Error.prepareStackTrace = undefined;
    return stack[2].getFileName()
        /* prettier-ignore */
        .split(/[\\/]/).pop(); // if you want path delete this line
}
function getDateStr() {
    var temp = new Date();
    temp.setHours(temp.getHours() + 8);
    return temp.toISOString().replace(/T/, " ").replace(/\..+/, "");
}
