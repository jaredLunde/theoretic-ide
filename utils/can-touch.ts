export function canTouch() {
  if (cachedCanTouch !== void 0) {
    return cachedCanTouch;
  }

  if (typeof window === "undefined") return false;

  if (
    "ontouchstart" in window ||
    // @ts-expect-error
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    cachedCanTouch = true;
    return true;
  }

  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
    ""
  );
  cachedCanTouch = !!window.matchMedia(query).matches;
  return cachedCanTouch;
}

let cachedCanTouch: boolean;
const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
