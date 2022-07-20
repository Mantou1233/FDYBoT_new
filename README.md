# FDYBoT_new

## Core

dont touch

## service

PUT YOUR SERVICE HERE!!
still, dont touch i18n and ap

## plugin

if u want to create a new sector

firstly create a folder in `/src/plugins`

like, sex

then create `/src/plugins/sex/.plugin.json`

```json
{
    "name": "sex", // name as the folder
    "desc": "#RANDOM", // not used in this version
    "version": "3.46^aprx", // ^
    "author": "Mantou", // ^
    "entry": "src/index.js" // entry point of the plugin
}
```

then, create `/src/plugins/sex/src/index.(js|ts)`

js:
```js
async function load(client, cm) {

}

module.exports = load
```
ts:
```ts
export default async function load(client: Client, cm: CommandManager){

}
```

### how the fuck i make commands??
yes

first do

```js
cm.register({
  name: "sex", // name of the command
  desc: "do sex", // desc that will show on the help cmd
  category: "SexyImposterAmongus", // category, usally basic or the category you def
  handler: async (msg) => { // This has to be async
    // put djs code here...
  } // end
})
```

yes that easy
fuck you this is the end imma go play some meeku smp ahahhahahahahhahahahhahah dm me on discord for help
