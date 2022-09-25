/* eslint-disable @typescript-eslint/no-extra-semi */
export enum Comparison {
	Lower = -1,
	Equal,
	Greater
}

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

export type DeepNest<T> = T extends Record<keyof any, any>
	? {
		[K in keyof T]: DeepNest<T[K]>;
	}
	: T;

export type Flux<U extends Record<string, any>> = {
	[K in keyof U]: K;
};
export type Flip<T extends Record<string, string | number | boolean>> = {
	[K in keyof T as `${T[K]}`]: K;
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

export type If<T extends boolean, A, B = null> = T extends true
	? A
	: T extends false
	? B
	: A | B;
export type FulFill<T extends boolean = true> = T;
export type Capable<T> = T extends boolean ? T : never;
export type Reverse<T extends boolean = true> = true extends T ? false : true;

export type Callback<T = void> = () => T;
export type FuncCallback<P extends any[], R> = (...args: P) => R;

// Extract
export type SetIntersection<A, B> = A extends B ? A : never;
// Exclude
export type SetDifference<A, B> = A extends B ? never : A;

export type SetComplement<A, B extends A> = SetDifference<A, B>;
export type SymmetricDifference<A, B> = SetDifference<A | B, A & B>;
//

export type Comparator<
	A extends number,
	B extends number
> = `${A}` extends `-${infer AbsA}`
	? `${B}` extends `-${infer AbsB}`
		? ComparePositives<AbsB, AbsA>
		: Comparison.Lower
	: `${B}` extends `-${number}`
	? Comparison.Greater
	: ComparePositives<`${A}`, `${B}`>;

type ComparePositives<
	A extends string,
	B extends string,
	ByLength = CompareByLength<A, B>
> = ByLength extends Comparison.Equal ? CompareByDigits<A, B> : ByLength;

type CompareByLength<
	A extends string,
	B extends string
> = A extends `${infer AF}${infer AR}`
	? B extends `${infer BF}${infer BR}`
		? CompareByLength<AR, BR>
		: Comparison.Greater
	: B extends `${infer BF}${infer BR}`
	? Comparison.Lower
	: Comparison.Equal;

type CompareByDigits<
	A extends string,
	B extends string
> = `${A}|${B}` extends `${infer AF}${infer AR}|${infer BF}${infer BR}`
	? CompareDigits<AF, BF> extends Comparison.Equal
		? CompareByDigits<AR, BR>
		: CompareDigits<AF, BF>
	: Comparison.Equal;

type CompareDigits<A extends string, B extends string> = A extends B
	? Comparison.Equal
	: "0123456789" extends `${string}${A}${string}${B}${string}`
	? Comparison.Lower
	: Comparison.Greater;

export type ParseInt<S extends string | number> =
	`${S}` extends `${infer I extends number}` ? I : never;

export type Floor<S extends string | number> =
	`${S}` extends `${infer I extends number}.${infer _ extends number}`
		? I
		: `${S}` extends `${infer I1 extends number}`
		? I1
		: S;

export type RemoveLeadingZeros<S extends string> = S extends "0"
	? S
	: S extends `${"0"}${infer R}`
	? RemoveLeadingZeros<R>
	: S;

type InternalMinusOne<S extends string> =
	S extends `${infer Digit extends number}${infer Rest}`
		? Digit extends 0
			? `9${InternalMinusOne<Rest>}`
			: `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`
		: never;
export type MinusOne<T extends number> = ParseInt<
	RemoveLeadingZeros<Revert<InternalMinusOne<Revert<`${T}`>>>>
>;

type InternalAddOne<S extends string> =
	S extends `${infer Digit extends number}${infer Rest}`
		? Digit extends 0
			? `9${InternalAddOne<Rest>}`
			: `${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0][Digit]}${Rest}`
		: never;
export type AddOne<T extends number | string> = ParseInt<
	RemoveLeadingZeros<Revert<InternalAddOne<Revert<`${T}`>>>>
>;

export type ArrayConstruct<
	N extends number,
	Arr extends any[] = []
> = N extends 0 ? Arr : ArrayConstruct<MinusOne<N>, [...Arr, unknown]>;

export type ArrayLikeConstruct<N extends number, Obj = {}> = N extends 0
	? Obj
	: {
		[K in MinusOne<N>]: unknown;
	} & ArrayLikeConstruct<MinusOne<N>>;

// Object
export type Get<T, K> = K extends keyof T
	? T[K]
	: K extends `${infer R}.${infer F}`
	? R extends keyof T
		? Get<T[R], F>
		: never
	: never;

export type DeepPick<
	T extends Record<string, any>,
	P extends string
> = UnionToIntersection<
	P extends P
		? P extends `${infer Key}.${infer Rest}`
			? {
				[K in Key]: DeepPick<T[K], Rest>;
			}
			: P extends keyof T
			? Pick<T, P>
			: never
		: never
>;

type LengthOf<T extends Record<keyof any, any>> = UnionToTuple<
	keyof T
> & { length: number } extends { length: infer L extends number }
	? L
	: 0;

type x = LengthOf<{
	az: 2;
	c2: 1;
}>;
type y = LengthOf<{
	a: 23;
	4: 1;
}>;

export type DeepGet<
	T extends Record<string, any>,
	P extends string
> = P extends infer K ? Get<T, K> : never;

export type Camel<T> = T extends unknown[]
	? { [K in keyof T]: T[K] extends object ? Camel<T[K]> : T[K] }
	: {
		[K in keyof T as Camelize<K>]: T[K] extends object
			? Camel<T[K]>
			: T[K];
	};
export type Assign<A, B> = Copy<Pick<A, Exclude<keyof A, keyof B>> & B>;
export type Merge<A, B> = Copy<
	Omit<A, keyof B> &
		Omit<B, keyof A> & { [K in Extract<keyof A, keyof B>]: A[K] | B[K] }
>;
export type Intersect<A, B> = Copy<
	Omit<A, keyof B> &
		Omit<B, keyof A> & {
			[K in Extract<keyof A, keyof B>]: Copy<A[K] & B[K]>;
		}
>;

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

export type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];
export type Mix<T extends any[], R extends any[]> = T extends [
	infer A,
	...infer B
]
	? R extends [infer M, ...infer N]
		? [M, A, ...Mix<B, N>]
		: []
	: [];

export type ToArray<T> = T extends Record<number, any>
	? ObjToArray<T>
	: T extends any[]
	? T
	: [T];
export type ObjToArray<T, Acc extends unknown[] = []> = T extends Record<`${Acc["length"]}`, infer U> ? ObjToArray<T, [...Acc, U]> : Acc;

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

export type Head<S> = S extends `${infer First}${string}` ? First : never;
export type Tail<S> = S extends `${string}${infer Rest}` ? Rest : never;

export type Rotate<S> = `${Tail<S>}${Head<S>}`;
export type Revert<S> = S extends `${infer First}${infer Rest}`
	? `${Revert<Rest>}${First}`
	: "";

export type Zip<From, To> = Copy<
	From extends `${infer First}${infer Rest}`
		? Record<First, Head<To>> & Zip<Rest, Tail<To>>
		: {}
>;
export type Camelize<T> = T extends `${infer L}_${infer F}${infer O}`
	? Camelize<`${L}${Uppercase<F>}${O}`>
	: T;
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
export type IsNever<T> = [T] extends [never] ? true : false;
export type NotNever<T> = Reverse<IsNever<T>>;

export type Alike<X, Y> = Equal<DeepNest<X>, DeepNest<Y>>;
export type ExpectExtends<V, E> = E extends V ? true : false;

export type SameArgs<
	F extends (...args: any[]) => any,
	P extends any[]
> = P extends Parameters<F> ? true : false;

// prettier-ignore
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
// prettier-ignore
type UnionToFn<U> = (U extends any ? (k: () => U) => void : never) extends ((k: infer R) => void)? R : never

export type UnionToTuple<
	T,
	P extends any[] = []
> = UnionToFn<T> extends () => infer R
	? Exclude<T, R> extends never
		? [...P, R]
		: UnionToTuple<Exclude<T, R>, [...P, R]>
	: [];

type Random<I extends Nkhelv = 0> = UnionToTuple<Nkhelv>[I];

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

export type ReadonlyKeys<T> = AllKeysOf<{
	[Key in keyof T as Equal<T, Readonly<T>> extends true ? Key : never]: Key;
}>;
