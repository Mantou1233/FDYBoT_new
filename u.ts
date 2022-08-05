type Keys<TObj> = {
    [Key in keyof TObj]: keyof TObj[Key]
  }[keyof TObj]

type X = Keys<{
    a: {
        vb: 2,
        bba: 10
    },
    b: {
        vb: 6,
        aaaa: 0
    }
}>