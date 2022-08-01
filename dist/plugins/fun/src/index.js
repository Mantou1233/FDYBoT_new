const jimp = require("jimp");
const math = require("mathjs");
const DIG = require("discord-image-generation");
const Canvas = require("canvas");
const axios = require("axios");
const he = require("he");
const cowsay = require("cowsay");
const Discord = require("discord.js");
function rca(r, u, c) {
    r = r.split("");
    r.splice(u, c);
    return r.join("");
}
function replacer(str) {
    str = str
        .replaceAll("<b>", "**")
        .replaceAll("</b>", "**")
        .replaceAll("<i>", "*")
        .replaceAll("</i>", "*")
        .replaceAll("<strong>", "**")
        .replaceAll("</strong>", "**");
    for (let i = 0; i < str.length; i++) {
        if (str.substring(i, i + 7) === "<a href") {
            str = rca(str, i + 1, 22);
            i += 22;
        }
    }
    str = str
        .replaceAll("</a>", "")
        .replaceAll(".</p>", "")
        .replaceAll("</p>", "")
        .replaceAll('<p style="text-align:justify">', "");
    return str;
}
function randomProperty(obj) {
    let keys = Object.keys(obj);
    let key = keys[(keys.length * Math.random()) << 0];
    return {
        id: key,
        info: obj[key]
    };
}
function checkChain(str) {
    let check = [];
    let chunk = [];
    for (let i = 1; i < str.length; i++) {
        check = str.charAt(i);
        if (check === "#" && str.charAt(i - 7) === "-") {
            chunk.push(str.charAt(i + 1) +
                str.charAt(i + 2) +
                str.charAt(i + 3) +
                str.charAt(i + 4) +
                str.charAt(i + 5) +
                str.charAt(i + 6));
            i += 6;
        }
    }
    return chunk;
}
function draw(arr1, arr2, size = 50) {
    let canvas, ctx, atta = [], tmp;
    canvas = Canvas.createCanvas(arr1.length * size, size);
    ctx = canvas.getContext("2d");
    for (var i = 0; i < arr1.length; i++) {
        ctx.fillStyle = "#" + arr1[i];
        ctx.fillRect(i * size, 0, size, size);
    }
    tmp = canvas.toBuffer();
    atta.push(tmp);
    canvas = Canvas.createCanvas(arr2.length * size, size);
    ctx = canvas.getContext("2d");
    for (var i = 0; i < arr2.length; i++) {
        ctx.fillStyle = "#" + arr2[i];
        ctx.fillRect(i * size, 0, size, size);
    }
    tmp = canvas.toBuffer();
    atta.push(tmp);
    return atta;
}
async function load(client, cm) {
    cm.register({
        command: "cowsay",
        category: "Fun",
        desc: "Makes a cow say the message (!cowsay [text])",
        handler: async (msg) => {
            let text = ap(msg.content, true)[1].replace(/(\r\n|\n|\r)/gm, "");
            try {
                const stdout = cowsay.say({
                    text: text
                });
                await msg.channel.send("```bash\n" + stdout + "```");
            }
            catch (e) {
                await msg.channel.send(e.message);
            }
        }
    });
    cm.register({
        command: "shitpost",
        category: "Fun",
        desc: "gets a random text",
        handler: async (msg) => {
            axios.defaults.headers = {
                Accept: "plain/text"
            };
            const response = await axios.get("https://shitpostgen.herokuapp.com/?count=200");
            msg.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(he.decode(response.data
                        .split(`<div class="text">`)[1]
                        .split("</div>")[0]))
                        .setFooter("text generated from https://shitpostgen.herokuapp.com i do not own any of the texts generated.")
                        .setColor("#CFF2FF")
                ]
            });
        }
    });
    cm.register({
        command: "colorf",
        category: "Fun",
        cooldown: 60000,
        desc: "gets a random text",
        handler: async (msg) => {
            let args = ap(msg.content);
            var color = args[1];
            var re = /[0-9A-Fa-f]{6}/g;
            if (!re.test(color)) {
                return msg.channel.send(`${color} is not a vaild hex code`);
            }
            axios.defaults.headers = {
                Accept: "plain/text"
            };
            const response = await axios.get(`https://www.htmlcsscolor.com/hex/${color.toUpperCase()}`);
            var title = response.data
                .split("<title>")[1]
                .split("</title>")[0]
                .trim();
            var key = response.data
                .split("<meta name=")[1]
                .split("/>")[0]
                .trim()
                .replace('"keywords" content="', "")
                .replace('"', "");
            var desc = response.data
                .split("<meta name=")[2]
                .split("/>")[0]
                .trim()
                .replace('"description" content="', "")
                .replace('"', "");
            var desc2 = response.data
                .split('<p id="cntMain_lblInformation" style="text-align:justify"><p style="text-align:justify">')[1]
                .split("</div>")[0]
                .trim();
            var one = response.data
                .split('<div id="cntMain_pnlShades">')[1]
                .split('<div class="clearfix">')[0];
            //Shades of Turquoise
            one = checkChain(one);
            var two = response.data
                .split('<div id="cntMain_pnlTints">')[1]
                .split('<div class="clearfix">')[0];
            //Tints of Turquoise
            two = checkChain(two);
            desc = replacer(desc2);
            one.push("000000");
            two.push("FFFFFF");
            let [atta1, atta2] = draw(one, two);
            atta1 = new Discord.AttachmentBuilder(atta1, "color1.png");
            atta2 = new Discord.AttachmentBuilder(atta2, "color2.png");
            const shades = new Discord.EmbedBuilder()
                .setTitle("Shades of Turquoise")
                .setDescription(one.join(" "))
                .setImage("attachment://color1.png")
                .setColor("#" + color);
            const tints = new Discord.EmbedBuilder()
                .setTitle("Tints of Turquoise")
                .setDescription(two.join(" "))
                .setImage("attachment://color2.png")
                .setColor("#" + color);
            const main = new Discord.EmbedBuilder()
                .setTitle(title
                .replace("HEX color ", "")
                .replace(", Color name:", " -")
                .replace(", RGB(", " - ")
                .replace("), Windows: ", " : ")
                .replace(". - HTML CSS Color", ""))
                .setDescription(desc.replace("  Inversed color of", "").replace("…", ""))
                .setFooter({ text: "tags: " + key })
                .setColor("#" + color);
            msg.reply({ embeds: [main, shades, tints], files: [atta1, atta2] });
        }
    });
    cm.register({
        command: "fry",
        category: "Fun",
        desc: "Fry/Cursify the users profile picture (!fry @user)",
        handler: async (msg) => {
            let pic;
            let target = msg.author.displayAvatarURL({ extension: "png" });
            let args = ap(msg.content);
            if (msg.mentions.users.first() && args[1] !== "self") {
                target = msg.mentions.users
                    .first()
                    .displayAvatarURL({ extension: "png" });
            }
            let angle = Math.floor(Math.random() * 360);
            if (args[2])
                if (args[2] % 1 === 0)
                    angle = args[2] * 1;
            pic = target;
            let welcome = await jimp.read(pic); //'https://i.imgur.com/zvWTUVu.jpg') //We load the image from that link
            //welcome.blur(10);
            welcome.dither565();
            welcome.invert();
            welcome.normalize();
            welcome.rotate(angle);
            let imgBuf = await welcome.getBufferAsync(jimp.AUTO);
            await msg.channel.send({
                content: "Deep Fried... tasty.",
                files: [
                    {
                        attachment: imgBuf,
                        name: "fried-image.jpg"
                    }
                ]
            });
            /*
                welcome.write('lmao.png') //We create a png file called Welcome2
                msg.channel.send({content: 'hi', files: ["lmao.png"] }) //We sent the file to the channel}
                */
        }
    });
    cm.register({
        command: "calc",
        category: "Fun",
        desc: "Simple math smh!!",
        handler: async (msg) => {
            let calc = ap(msg.content, true)[1];
            if (!calc)
                return msg.channel.send("**Enter Something To Calculate**");
            let result;
            try {
                result = math.evaluate(calc
                    .replace(/[x]/gi, "*")
                    .replace(/[,]/g, ".")
                    .replace(/[÷]/gi, "/"));
            }
            catch (e) {
                return msg.channel.send("**Enter Valid Calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**");
            }
            let embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setAuthor({
                name: `fdy calculator`,
                iconURL: msg.author.displayAvatarURL({ dynamic: true })
            })
                .addFields({
                name: "**Operation**",
                value: `\`\`\`js\n${calc
                    .replace(/[x]/gi, "*")
                    .replace(/[,]/g, ".")
                    .replace(/[÷]/gi, "/")}\`\`\``
            })
                .addFields({
                name: "**Result**",
                value: `\`\`\`js\n${result}\`\`\``
            })
                .setFooter({ text: msg.guild.name, iconURL: msg.guild.iconURL() });
            msg.channel.send({ embeds: [embed] });
        }
    });
    cm.register({
        command: "howgay",
        category: "Fun",
        desc: "lets see how gay are you~",
        handler: async (msg) => {
            let args = ap(msg.content, true);
            let target = msg.mentions.users.first() || msg.author;
            let result = Math.floor(Math.random() * 101);
            if (target.username.toLowerCase().includes("paketa"))
                result = 690;
            msg.channel.send(`${target.username} Is ${result}% Gay 🏳️‍🌈`);
        }
    });
    cm.register({
        command: "gay",
        category: "Fun",
        desc: "whos gae",
        handler: async (msg) => {
            let pic;
            let target = msg.author;
            let args = ap(msg.content);
            if (msg.mentions.users.first()) {
                target = msg.mentions.users
                    .first();
            }
            if (args[1] === "self")
                target = msg.author;
            pic = target.avatarURL({ extension: "png" });
            ;
            let img = await new DIG.Gay().getImage(pic);
            // Add the image as an attachement
            let attach = new Discord.AttachmentBuilder(img, "gay.png");
            let content = "gae";
            if (target.username.toLowerCase().includes("paketa"))
                content =
                    "paketa gae paketa gae paketa gae paketa gae paketa gae";
            msg.channel.send({ content: content, files: [attach] });
        }
    });
    cm.register({
        command: "gradient",
        category: "Fun",
        desc: "whos gae",
        handler: async (msg) => {
            let args = ap(msg.content);
            let color = 42.5;
            let limit = 6;
            if (args[1])
                color = parseFloat(args[1]);
            if (color === NaN)
                color = 42.5;
            if (args[2])
                limit = args[1] * 1;
            if (limit === NaN)
                limit = 6;
            const canvas = Canvas.createCanvas(limit * 25, limit * 25);
            const ctx = canvas.getContext("2d");
            for (var i = 0; i < limit; i++) {
                for (var j = 0; j < limit; j++) {
                    ctx.fillStyle =
                        "rgb(" +
                            Math.floor(255 - color * i) +
                            "," +
                            Math.floor(255 - color * j) +
                            ",0)";
                    ctx.fillRect(j * 25, i * 25, 25, 25);
                }
            }
            const attach = new Discord.AttachmentBuilder(canvas.toBuffer(), "gradient.png");
            msg.channel.send({ content: "h", files: [attach] });
        }
    });
    cm.register({
        command: "color",
        category: "Fun",
        desc: "color gen",
        handler: async (msg) => {
            let size = 50;
            let args = ap(msg.content);
            args.shift();
            let limit = args.length;
            let proc = 0;
            for (var color of args) {
                var re = /[0-9A-Fa-f]{6}/g;
                if (color.startsWith("size")) {
                    size = color.replace("size", "") * 1;
                    if (size === NaN)
                        size = 50;
                    args.splice(proc, 1);
                    limit -= 1;
                }
                else if (color.startsWith("rgb")) {
                    args.splice(proc, 1);
                    limit -= 1;
                }
                else if (!re.test(color)) {
                    return msg.channel.send(`${color} is not a vaild hex code`);
                }
                proc++;
            }
            console.log(args);
            const canvas = Canvas.createCanvas(limit * size, size);
            const ctx = canvas.getContext("2d");
            for (var i = 0; i < limit; i++) {
                ctx.fillStyle = "#" + args[i];
                ctx.fillRect(i * size, 0, size, size);
            }
            const attach = new Discord.AttachmentBuilder(canvas.toBuffer(), "color.png");
            msg.channel.send({ files: [attach] });
        }
    });
    cm.register({
        command: "rip",
        category: "Fun",
        desc: "color gen",
        handler: async (msg) => {
            let pic;
            let target = msg.author.avatarURL({
                extension: "png",
                size: 128,
                dynamic: false
            });
            let args = ap(msg.content);
            if (msg.mentions.users.first()) {
                target = msg.mentions.users
                    .first()
                    .avatarURL({ extension: "png", size: 128, dynamic: false });
            }
            if (args[1] === "self")
                target = msg.author.avatarURL({
                    extension: "png",
                    size: 128,
                    dynamic: false
                });
            let avatar = (pic = target);
            let welcome = await jimp.read(avatar);
            welcome.blur(1);
            welcome.brightness(-0.5);
            welcome.dither565();
            welcome.greyscale();
            welcome.normalize();
            //welcome.rotate(10);
            let img = await welcome.getBase64Async(jimp.AUTO);
            const canvas = Canvas.createCanvas(190, 190);
            const ctx = canvas.getContext("2d");
            await Canvas.loadImage(img).then(image => {
                ctx.drawImage(image, 31, 31);
            });
            await Canvas.loadImage("https://cdn.discordapp.com/attachments/817751130494205962/961104382559129600/2e7e5867f2a106ca.png").then(image => {
                ctx.drawImage(image, 0, 0);
            });
            const attach = new Discord.AttachmentBuilder(canvas.toBuffer(), "rip.png");
            msg.channel.send({ content: ":pray:", files: [attach] });
        }
    });
}
module.exports = load;
//# sourceMappingURL=index.js.map