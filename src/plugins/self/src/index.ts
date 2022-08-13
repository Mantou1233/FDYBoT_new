/*
 DISCLAMER:
 the modules are made for self-check suspended issues and specified API-test modules for a *specified* server.
 for learning purpose only! 
 */
 import flags from "../../../assets/flags.json";
 import CommandManager from "../../../core/CommandManager";
 import ms from "pretty-ms";
 import * as Discord from "discord.js";
 import * as Self from "discord.js-selfbot-v13";
 import axios from "axios";
 import * as snowflake from "../../../services/snowflake";
 
 const admins = ["842757573709922314", "611118369474740244"];
 /**
  * @returns void
  */
 async function load(client, cm: CommandManager) {
     cm.register({
         command: "check",
         category: "API",
         hidden: true,
         handler: async msg => {
             const args = ap(msg.content, true);
             if (!args[1])
                 return msg.channel.send({
                     embeds: [
                         {
                             description: i18n.parse(
                                 msg.lang,
                                 "command.run.invaild"
                             ),
                             color: i18n.globe["color"]
                         }
                     ]
                 });
             if(!args[1].includes(".")) return msg.channel.send("stop fucking give me random text to login you dont even have a dot in your token you retard");
             let self = new Self.Client({
                 checkUpdate: false
             });
             try{
                 const stat = (await (async function(){
                     await self.login(args[1]);
                     return self;
                 })()) as Self.Client;
 
                 msg.channel.send({
                     embeds: [
                         new Discord.EmbedBuilder()
                             .setTitle("Token is fucking ok")
                             .setDescription(`\`\`\`yml\n${stat.user!.tag}\n[${stat.user?.id}]\nAccount Created at ${snowflake.convertSnowflakeToDate(stat.user?.id ?? snowflake.DISCORD_EPOCH).toUTCString()}\n\`\`\``)
                             .addFields({
                                 name: "RelationShips",
                                 value: (function(){
                                     let amount = 0, og = 0, going = 0;
                                     stat.relationships.cache.each((v, k) => {
                                         if(v == 1) amount++;
                                         if(v == 3 || v == 4) going++;
                                         let user = stat.users.cache.get(k);
                                         if(!user) return;
                                         if(user.partial) return;
                                         amount++;
                                         let flag = checkFlags(user.flags?.bitfield ?? 0, true);
                                         if(flag == "NONE") return;
                                         og++;
                                     });
                                     return `friends: ${amount} (outgoing / incoming request ${going})\n${og ? `${og} mutual HQ relationship` : "No mutual HQ relationship"}`;
                                 })()
                             })
                             .addFields({
                                 name: "Flags",
                                 value: checkFlags(stat.user?.flags, false)
                             })
                             .addFields({
                                 name: "Info",
                                 value: `email: ${stat.user?.emailAddress}\nphone: ${stat.user?.phoneNumber}\nverified: ${stat.user?.verified}\nmfa: ${stat.user?.mfaEnabled}\nbio: \`\`\`yml\n${stat.user?.bio ?? "None"}\n\`\`\``
                             })
                     ]
                 });
                 
                 stat.destroy();
             // eslint-disable-next-line no-empty
             }catch(e){
                 console.log(e);
                 msg.channel.send("Uh your token is so bad it cant be searched");
             }
         }
     });
     cm.register({
        command: "refresh",
        category: "API",
        hidden: true,
        handler: async msg => {
            const args = ap(msg.content, true);
            if (!args[1])
                return msg.channel.send({
                    embeds: [
                        {
                            description: i18n.parse(
                                msg.lang,
                                "command.run.invaild"
                            ),
                            color: i18n.globe["color"]
                        }
                    ]
                });
            if(!args[1].includes(".")) return msg.channel.send("stop fucking give me random text to login you dont even have a dot in your token you retard");
            let self = new Self.Client({
                checkUpdate: false
            });
            try{
                const stat = (await (async function(){
                    await self.login(args[1]);
                    return self;
                })()) as Self.Client;

                let nt = await stat.createToken();

                msg.channel.send(`new token:\`${nt}\``);
                
                stat.destroy();
            // eslint-disable-next-line no-empty
            }catch(e){
                console.log(e);
                msg.channel.send("Current token cant be logged in or refresh. -> " +e.message);
            }
        }
    });
 }
 
 module.exports = load;
 
 function IsJsonString(str) {
     let o;
     try {
         o = JSON.parse(str);
     } catch (e) {
         return false;
     }
     if (o && typeof o === "object") return true;
     return false;
 }
 
 function checkFlags(flagNumber, ignore = true) {
     let results: any[] = [];
 
     let bflag = BigInt(flagNumber);
     for (let i = 0; i <= 64; i++) {
         const bitwise = 1n << BigInt(i);
 
         if (bflag & bitwise) {
             const flag = Object.entries(flags).find(f => f[1].shift === i)?.[0] || `UNKNOWN_FLAG_${i}`;
             if(flags[flag]?.unimportant) continue;
             results.push(flag);
         }
     }
 
     return results.join(", ") || "NONE";
 }