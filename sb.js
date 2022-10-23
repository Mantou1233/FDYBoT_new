function hexToDoc(str){
    if(str.startsWith("#")) str = str.slice(1)
    if(!/[A-Fa-f0-9_]{6}/.test(str)) throw new Error("Not a vaild hex color")
    return parseInt(str, 16)
}
console.log(hexToDoc("CFF2FF"))