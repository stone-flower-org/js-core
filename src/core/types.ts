export type PredicateFunc<T> = (value: T, index: number, arr: T[]) => boolean;

export type BinaryPredicateFunc<T> = (value: T, index: number, arr: T[]) => number;

export type MemoizedFunc<F extends Func> = F & { clearCache: VoidFunc };

export type ISOPeriod = [string, string];

export type NullableISOPeriod = [string | null, string | null];

export type KeyOfType<T, U, B = false> = {
  [P in keyof T]: B extends true ? (T[P] extends U ? (U extends T[P] ? P : never) : never) : T[P] extends U ? P : never;
}[keyof T];

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};

export type Entries<O extends object, K extends keyof O = keyof O, V = O[K]> = [K, V][];

export type UnionValues<O extends object> = O[keyof O];

export type ComparatorResult = number;

export type Comparator<T = unknown> = (a: T, b: T) => ComparatorResult;

export type Diff<T, U> = T extends U ? never : T;

export type NonNullable<T> = Diff<T, null | undefined>;

export type Nullable<T> = T | null | undefined;

export type VoidFunc = () => void;

export type Func = (...args: unknown[]) => unknown;

export type ValidObjectKey = string | number | symbol;

export interface Constructor<P extends unknown[] = unknown[], T = object> {
  new (...args: P): T;
}

export type TimeoutId = ReturnType<typeof setTimeout>;
