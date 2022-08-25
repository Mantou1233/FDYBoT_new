/* eslint-disable @typescript-eslint/no-extra-semi */

export type Keyable = string | number | symbol;
export type BoolKeyable = string | number | boolean;
export type Nkhelv = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;

export type Copy<T> = {
    [K in keyof T]: T[K];
};

export type RemoveIndex<T> = {
    [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K];
};

export type NestedKeys<T> = {
    [K in keyof T]: keyof T[K];
}[keyof T];

export type DeepNest<T> = T extends Record<string | number | symbol, any>
    ? {
        [K in keyof T]: DeepNest<T[K]>;
    }
    : T;

export type Flux<U extends Record<string, any>> = {
    [K in keyof U]: K;
};

type MatchNameHelper<T, L> = {
    [K in keyof T]: T[K] extends L ? K : never;
}[keyof T];

type NotMatchNameHelper<T, L> = {
    [K in keyof T]: T[K] extends L ? never : K;
}[keyof T];

export type MatchNames<
    T extends Record<string, any>,
    L,
    M extends boolean = true
> = M extends true ? MatchNameHelper<T, L> : NotMatchNameHelper<T, L>;

export type Match<
    T extends Record<string, any>,
    L,
    M extends boolean = true
> = Pick<T, MatchNames<T, L, M>>;

export type Reverse<T extends boolean> = true extends T ? false : true;

export type Callback<T = void> = () => T;
export type FuncCallback<P extends any[], R> = (...args: P) => R;

export type SetIntersection<A, B> = A extends B ? A : never;
export type SetDifference<A, B> = A extends B ? never : A;
export type SetComplement<A, B extends A> = SetDifference<A, B>;
export type SymmetricDifference<A, B> = SetDifference<A | B, A & B>;

// Object
export type Get<T, K> = K extends keyof T
    ? T[K]
    : K extends `${infer R}.${infer F}`
    ? R extends keyof T
        ? Get<T[R], F>
        : never
    : never;

export type Assign<A, B> = Copy<Pick<A, Exclude<keyof A, keyof B>> & B>;
export type Flip<T extends { [K: string]: BoolKeyable }> = {
    [K in keyof T as `${T[K]}`]: K;
};

// Array
export type Prepend<T extends unknown[], F> = [F, ...T];
export type Append<T extends unknown[], L> = [...T, L];

export type Fill<
    T extends unknown[],
    N,
    Start extends number = 0,
    End extends number = T["length"],
    C extends unknown[] = [],
    L extends unknown[] = []
> = T extends [infer M, ...infer O]
    ? End extends [...L, ...C]["length"]
        ? [...L, ...C, ...T]
        : Start extends L["length"]
        ? Fill<O, N, Start, End, [...C, N], L>
        : Fill<O, N, Start, End, C, [...L, M]>
    : [...L, ...C];

export type Pop<T extends unknown[]> = T extends [infer F, ...infer Rest]
    ? F
    : T[0];
export type Shift<T extends unknown[]> = T extends [...infer Rest, infer L]
    ? L
    : T[0];

export type ToArray<T> = T extends any[] ? T : [T];

export type Excludes<T, U> = T extends [infer First, ...infer Rest]
    ? Equal<U, First> extends true
        ? Excludes<ToArray<Rest>, U>
        : [First, ...Excludes<ToArray<Rest>, U>]
    : T;

export type Includes<T, U> = T extends [infer First, ...infer Rest]
    ? Equal<First, U> extends true
        ? true
        : Includes<Rest, U>
    : false;

// prettier-ignore
export type IndexOf<T, U, A extends any[] = []> = T extends [infer L,...infer R]
    ? Equal<L, U> extends true
        ? A["length"]
        : IndexOf<R, U, [...A, 1]>
    : -1;

export type LastIndexOf<T, U> = T extends [...infer L, infer R]
    ? Equal<R, U> extends true
        ? L["length"]
        : LastIndexOf<L, U>
    : -1;

// prettier-ignore
export type Set<T extends unknown[], R extends unknown[] = []> = T extends [infer F, ...infer Rest]
    ? Includes<R, F> extends true
        ? Set<Rest, R>
        : Set<Rest, [...R, F]>
    : R;

// prettier-ignore
export type Chunk<
    T,
    L,
    R extends unknown[] = [], V extends unknown[] = []
> = R["length"] extends L
    ? Chunk<T, L, [], [...V, R]>
    : T extends [infer F, ...infer Rest]
    ? Chunk<Rest, L, [...R, F], V>
    : R extends []
    ? V
    : [...V, R];

export type Without<T, U> = U extends [infer First, ...infer Rest]
    ? Without<Excludes<T, First>, Rest>
    : Excludes<T, U>;

// String
export type Replace<
    S extends string,
    From extends string,
    To extends string
> = From extends ""
    ? S
    : S extends `${infer R}${From}${infer U}`
    ? `${R}${To}${U}`
    : S;
export type ReplaceAll<
    S extends string,
    From extends string,
    To extends string
> = From extends ""
    ? S
    : S extends `${infer Start}${From}${infer End}`
    ? `${Start}${To}${ReplaceAll<End, From, To>}`
    : S;

export type AsStr<T> = T extends string ? T : never;
export type Revert<S> = S extends `${infer First}${infer Rest}`
    ? `${Revert<Rest>}${First}`
    : "";
export type Head<S> = S extends `${infer First}${string}` ? First : never;
export type Tail<S> = S extends `${string}${infer Rest}` ? Rest : never;

export type Rotate<S> = `${Tail<S>}${Head<S>}`;

export type Zip<From, To> = From extends `${infer First}${infer Rest}`
    ? Record<First, Head<To>> & Zip<Rest, Tail<To>>
    : {};
//
export type AllKeysOf<T> = T extends T ? keyof T : never;

export type KeyOfUnion<T> = T[keyof T];
//

export type Awaitable<T> = T | PromiseLike<T>;

//
// prettier-ignore
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
export type NotEqual<X, Y> = Reverse<Equal<X, Y>>;
// prettier-ignore
export type Diff<T extends object, U extends object> = Pick<T, SetDifference<keyof T, keyof U>>;
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type NotAny<T> = Reverse<IsAny<T>>;

export type Alike<X, Y> = Equal<DeepNest<X>, DeepNest<Y>>;
export type ExpectExtends<V, E> = E extends V ? true : false;

export type SameArgs<
    F extends (...args: any[]) => any,
    P extends any[]
> = P extends Parameters<F> ? true : false;

export type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never;

export type PickByValue<T, ValueType> = Pick<
    T,
    { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;

export type PickByValueExact<T, ValueType> = Pick<
    T,
    {
        [Key in keyof T]-?: [ValueType] extends [T[Key]]
            ? [T[Key]] extends [ValueType]
                ? Key
                : never
            : never;
    }[keyof T]
>;

export type PickAll<T, ValueType extends keyof T = keyof T> = Pick<
    T,
    ValueType
>;

export type OmitByValue<T, ValueType> = Pick<
    T,
    { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>;

export type OmitByValueExact<T, ValueType> = Pick<
    T,
    {
        [Key in keyof T]-?: [ValueType] extends [T[Key]]
            ? [T[Key]] extends [ValueType]
                ? never
                : Key
            : Key;
    }[keyof T]
>;

export type OmitAll<T, ValueType extends keyof T = keyof T> = Omit<
    T,
    ValueType
>;

export type ReadonlyKeys<T> = {
    [Key in keyof T as Equal<T, Readonly<T>> extends true ? Key : never]: Key;
} extends infer A
    ? A[keyof A]
    : never;
