/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * @param condition - Condition to test
 * @param format - Message to display on invariant failure.
 */
export function invariant<T>(condition: T, format: string): asserts condition {
  if (!condition) {
    const error = new Error(format);
    // @ts-expect-error
    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}
