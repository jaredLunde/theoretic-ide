export const keys: <T>(obj: T) => (keyof T)[] = Object.keys;
export const values: <T>(obj: T) => T[keyof T][] = Object.values;
export const entries: <T>(obj: T) => [keyof T, T[keyof T]][] = Object.entries;
export function reduce<T, U>(
  obj: T,
  fn: (acc: U, key: keyof T, currentIndex: number, arr: (keyof T)[]) => U,
  init: U extends {} ? Partial<U> : U
): U {
  return keys(obj).reduce(fn, init as U);
}
