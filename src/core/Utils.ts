/**
 * Keys that is ok in record
 */
 export type Keys = string | number | symbol;

 /**
  * Copy a object
  */
 export type Copy<T> = {
     [K in keyof T]: T[K];
 };
 
 /**
  * DeepReadonly
  */
 export type DeepReadonly<T> = T extends object
     ? Copy<{
             readonly [K in keyof T]: DeepReadonly<T[K]>;
       }>
     : T;
 
 /**
  * Merge X and Y, where Y overrides X's prop
  */
 export type Merge<X, Y> = {
     [K in keyof X | keyof Y]: K extends keyof X
         ? X[K]
         : K extends keyof Y
         ? Y[K]
         : never;
 };
 
 /**
  * Removes `[X: string]` or any simliar index that does not specify names
  */
 export type RemoveIndex<T> = {
     [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K];
 };
 
 /**
  * get keys of all T's prop
  * @example type LangKeys = NestedKeys<{"a": {"b": 1, "c": 1}, "b": {"c": 2, "d": 3}}> // "b" | "c" | "d"
  */
 export type NestedKeys<T> = {
     [K in keyof T]: keyof T[K];
 }[keyof T];
 
 /**
  * deep nest T to not be obfuscated
  */
 export type DeepNest<T> = T extends Record<string | number | symbol, any>
     ? {
             [K in keyof T]: DeepNest<T[K]>;
       }
     : T;
 
 /**
  * Let T's V be K and K be K
  */
 export type Flux<U extends Record<string, any>> = {
     [K in keyof U]: K;
 };
 
 /**
  * @private
  */
 type MatchNameHelper<T, L> = {
     [K in keyof T]: T[K] extends L ? K : never;
 }[keyof T];
 
 /**
  * @private
  */
 type NotMatchNameHelper<T, L> = {
     [K in keyof T]: T[K] extends L ? never : K;
 }[keyof T];
 
 /**
  * Match key's names
  */
 export type MatchNames<
     T extends Record<string, any>,
     L,
     M extends boolean = true
 > = M extends true ? MatchNameHelper<T, L> : NotMatchNameHelper<T, L>;
 
 /**
  * Match key's names and return vals
  */
 export type Match<
     T extends Record<string, any>,
     L,
     M extends boolean = true
 > = Pick<T, MatchNames<T, L, M>>;
 
 /**
  * true -> false, false -> true
  */
 export type Reverse<T extends boolean> = true extends T ? false : true;
 
 /**
  * summon a callback that returns T
  */
 export type Callback<T = void> = () => T;
 
 /**
  * summon a callback that have args P and returns T
  */
 export type FuncCallback<P extends any[], R> = (...args: P) => R;
 
 /**
  * Returns same values of A and B
  */
 export type SetIntersection<A, B> = A extends B ? A : never;
 
 /**
  * Returns differ values of A and B
  */
 export type SetDifference<A, B> = A extends B ? never : A;
 
 /**
  * Returns differ values of both A and B which extends A
  */
 export type SetComplement<A, B extends A> = SetDifference<A, B>;
 
 /**
  * Returns differ values of A and B
  */
 export type SymmetricDifference<A, B> = SetDifference<A | B, A & B>;
 
 /**
  * Basically merge A and B in overridance of B but A is removed in keys of B
  */
 export type Assign<A, B> = Copy<Pick<A, Exclude<keyof A, keyof B>> & B>;
 
 /**
  * values of a record
  */
 export type ValueOf<T extends Record<Keys, Keys>> = T[keyof T];
 
 /**
  * HAHAHHEHHAHHCUWHA NO NEED EXPLAINATION>>>!>>!
  */
 export type Awaitable<T> = T | PromiseLike<T>;
 
 /**
  * check is X = Y and boolean returns brrr
  */
 export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
     T
 >() => T extends Y ? 1 : 2
     ? true
     : false;
 
 /**
  * From X remove properties that exist in Y
  */
 export type Diff<X extends object, Y extends object> = Pick<
     X,
     SetDifference<keyof X, keyof Y>
 >;
 
 /**
  * name says everything
  */
 export type IsAny<T> = 0 extends 1 & T ? true : false;
 
 /**
  * check is X != Y and boolean returns brrr
  */
 export type NotEqual<X, Y> = Reverse<Equal<X, Y>>;
 
 /**
  * !(name says everything)
  */
 export type NotAny<T> = Reverse<IsAny<T>>;
 
 /**
  * check is nested X = nested Y
  */
 export type Alike<X, Y> = Equal<DeepNest<X>, DeepNest<Y>>;
 
 /**
  * check does Y extends X
  */
 export type ExpectExtends<X, Y> = Y extends X ? true : false;
 
 /**
  * check does F have the params as P
  */
 export type SameArgs<
     F extends (...args: any[]) => any,
     P extends any[]
 > = P extends Parameters<F> ? true : false;
 
 /**
  * Idiot
  */
 export type UnionToIntersection<U> = (
     U extends any ? (k: U) => void : never
 ) extends (k: infer I) => void
     ? I
     : never;
 
 /**
  * I'm lazy to write beyond this point
  */
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
 