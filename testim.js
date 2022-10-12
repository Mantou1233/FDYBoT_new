
function parseArgs(str) {
	return [...str
		.matchAll(/(?<=^| )("?)(.+?)\1(?= |$)/g)]
		.map((match) => match[0].replaceAll('"', ''))
}

function parseFlags(args, options){
	let skip = false;
	const flags = {};
	const omits = [];
	for(let [index, arg] of args.entries()){
		if (skip) {
			skip = false;
		  	continue;
		}
		const flag = Object.keys(options).filter((v) => arg === `-${v}`)[0] ?? false
		if (flag) {
			if (options[flag] && `${args[index + 1]}`.startsWith("-")) {
				flags[flag] = undefined;
				continue;
			};
			flags[flag] = options[flag] ? args[index + 1] : true;
			omits.push(index);
			if (options[flag]) {
				omits.push(index + 1);
				skip = true;
			}
		}
	}
	const emptys = Object.fromEntries(Object.keys(flags).map(k => [ k, options[k] ? undefined : false ]));
	return { flags: { ...emptys, ...flags }, omits };
}

function parseAll(str, opts){
	let args = parseArgs(
		str
	)
	let { flags, omits } = parseFlags(
		args,
		opts
	)
	args = args.filter((v, i) => !omits.includes(i))
	return {
		args,
		flags
	}
}
module.exports = parseAll;