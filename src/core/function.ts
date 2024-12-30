import { areArraysShallowlyEqual } from './array';
import { isType } from './object';
import { Args, Class, Func, MemoizedFunc, TypeByName, TypeName } from './types';

export interface MemoizeFuncOptions {
  cacheSize?: number;
}

export const inverseComparator =
  <T>(comparator: (a: T, b: T) => number) =>
  (a: T, b: T) =>
    -1 * comparator(a, b);

export const defaultComparator = (a: unknown, b: unknown) => {
  if (a === b) return 0;
  return (a as number) > (b as number) ? 1 : -1;
};

export const voidFunc = (): void => undefined;

export const memoizeFunc = <F extends Func>(
  func: F,
  { cacheSize = Infinity }: MemoizeFuncOptions = {},
): MemoizedFunc<F> => {
  const cache: [Parameters<F>, ReturnType<F>][] = [];

  const memoizedFunc = function (...args: Parameters<F>) {
    let call = cache.find(([prevArgs, prevResult]) =>
      areArraysShallowlyEqual(prevArgs, args) ? prevResult : undefined,
    );

    if (!call) {
      call = [args, func(...args) as ReturnType<F>];
      cache.push(call);
      if (cache.length > cacheSize) cache.shift();
    }

    return call[1];
  } as MemoizedFunc<F>;

  memoizedFunc.clearCache = function () {
    cache.splice(0);
  };

  return memoizedFunc;
};

export class FunctionComposer<P = void, R = unknown> {
  constructor(protected func: (param: P) => R) {}

  next<X>(newFunc: (param: R) => X) {
    return new FunctionComposer((x: P) => newFunc(this.func(x)));
  }

  produce() {
    return this.func;
  }
}

export const compose = <P = void, R = unknown>(func: (param: P) => R) => new FunctionComposer<P, R>(func);

// TODO: write unit tests
export const createSingleArgInstanceValidation =
  <T>(proto: Class<T>, onError?: (...args: Args) => T) =>
  (...args: Args): T => {
    if (args[0] instanceof proto) return args[0] as T;
    if (onError) return onError(...args);
    throw new Error(`Provided arg must have instance of ${proto.name}`);
  };

// TODO: write unit tests
export const createSingleArgTypeValidation =
  <T extends TypeName>(type: T, onError?: (...args: Args) => TypeByName[T]) =>
  (...args: Args): TypeByName[T] => {
    if (isType(args[0], type)) return args[0];
    if (onError) return onError(...args);
    throw new Error(`Provided arg must have ${type} type`);
  };
