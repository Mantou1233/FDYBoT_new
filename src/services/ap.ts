function argumentParser(msg, mode = false, flags = []) {
    if (mode) {
        var temp = msg.split(/ +/);
        temp.shift();
        return [msg.split(/ +/)[0], temp.join(" ")];
    }
    return getArguments(msg);
}

function getArguments(body) {
    var args: any[] = [];
    var str = body.trim();
    while (str.length) {
        var arg;
        if (str.startsWith('"') && str.indexOf('"', 1) > 0) {
            arg = str.slice(1, str.indexOf('"', 1));
            str = str.slice(str.indexOf('"', 1) + 1);
        } else if (str.startsWith("'") && str.indexOf("'", 1) > 0) {
            arg = str.slice(1, str.indexOf("'", 1));
            str = str.slice(str.indexOf("'", 1) + 1);
        } else if (str.startsWith("```") && str.indexOf("```", 3) > 0) {
            arg = str.slice(3, str.indexOf("```", 3));
            str = str.slice(str.indexOf("```", 3) + 3);
        } else {
            arg = str.split(/\s+/g)[0].trim();
            str = str.slice(arg.length);
        }
        args.push(arg?.trim?.());
        str = str.trim();
    }
    return args;
}
global.ap = argumentParser;