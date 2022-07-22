declare global {
    var i18n: {
        parse: (lang: any, string: string, ...opt) => string
        globe: any
    }
    var ap: (msg: string, mode?: boolean, flags?: any) => string[]
}

export {}