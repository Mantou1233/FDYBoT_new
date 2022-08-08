export type Copy<T> = {
    [K in keyof T]: T[K];
};

export type RemoveIndex<T> = {
    [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K];
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

export type NestedKeys<T> = {
    [K in keyof T]: keyof T[K];
}[keyof T];

export type DeepNest<T> = T extends object ? 
{
    [K in keyof T]: DeepNest<T[K]>;
} : T;

export type Flux<U extends Record<string, any>> = {
    [K in keyof U]: K
};

export type SetIntersection<A, B> = A extends B ? A : never;

export type SetDifference<A, B> = A extends B ? never : A;

export type SetComplement<A, B extends A> = SetDifference<A, B>;

export type SymmetricDifference<A, B> = SetDifference<A | B, A & B>;

export type Assign<A, B> = Copy<Pick<A, Exclude<keyof A, keyof B>> & B>;

export type AllKeysOf<T> = T extends T ? keyof T : never;

export type KeyOfUnion<T> = T[keyof T];

export type Awaitable<T> = T | PromiseLike<T>;



export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
    T
>() => T extends Y ? 1 : 2
    ? true
    : false;

export type Diff<T extends object, U extends object> = Pick<
    T,
    SetDifference<keyof T, keyof U>
>;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type NotEqual<X, Y> = Reverse<Equal<X, Y>>;

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
