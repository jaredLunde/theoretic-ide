/**
 * Rounds units to a fixed number (7)
 *
 * @param num - The number to round
 */
export function round(num: number) {
  return num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
}

/**
 * Converts `px` to `rem` units
 *
 * @param px - A number in `px` to convert to `rem`
 */
export function rem(px: number) {
  return `${round(px / 16)}rem` as const;
}

/**
 * Converts `px` to `em` units based on a base number.
 *
 * @param px - A number in `px` to convert to `em`
 * @param base - The base number that the resulting `em` is calculated relative to
 */
export function em(px: number, base = 16) {
  return `${round(px / base)}em` as const;
}
