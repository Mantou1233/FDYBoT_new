const colors = {
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

function loggerMixin(name: string, format?: string){
    return function(content: string){
        console.log(
            `${colors.timestamp}${getDateStr()}${colors.reset} - ${
                format ?? colors[name] ?? colors["log"]
            }[${name}]${colors.reset} ~ ${colors.filename}${getCallerName()}${
                colors.reset
            } ${colors.log}${content}${colors.reset}`
        );
    };
}
export class Logger{
    log = loggerMixin("log");

    info = loggerMixin("info");
    success = loggerMixin("success");
    error = loggerMixin("error");
    warn = loggerMixin("warn");
    event = loggerMixin("event");
    debug = loggerMixin("debug");
}

function getCallerName() {
    const err = new Error();

    Error.prepareStackTrace = (_, stack) => stack;

    const stack = err.stack;

    Error.prepareStackTrace = undefined;

    return (stack as any)[2].getFileName()
        /* prettier-ignore */
        .split(/[\\/]/).pop(); // if you want path delete this line
}

function getDateStr() {
    const temp = new Date();
    temp.setHours(temp.getHours() + 8);
    return temp.toISOString().replace(/T/, " ").replace(/\..+/, "");
}