import compound from "@dash-ui/compound";
import dashMq from "@dash-ui/mq";
import responsive from "@dash-ui/responsive";
import type { Responsive } from "@dash-ui/responsive";
import { compileStyles, createStyles, pathToToken } from "@dash-ui/styles";
import type {
  DashThemes,
  DashTokens,
  StyleCallback,
  StyleMap,
  Styles,
  StyleValue,
  TokensUnion,
} from "@dash-ui/styles";
import * as colors from "@radix-ui/colors";
import { persistAtom } from "@/stores/atoms";
import { em, rem } from "@/utils/unit";

/**
 * Design tokens
 * Mostly courtesy of: https://tailwindcss.com
 */
const colorSystem = {
  current: "currentColor",
  black: "#000",
  white: "#fff",
  transparent: "transparent",

  ...colors.crimson,
  ...colors.crimsonA,
  ...colors.indigo,
  ...colors.indigoA,
  ...colors.teal,
  ...colors.tealA,
  ...colors.cyan,
  ...colors.cyanA,
  ...colors.amber,
  ...colors.amberA,
  ...colors.slate,
  ...colors.slateA,
  ...colors.blackA,
  ...colors.whiteA,
} as const;

const typeSystem = {
  family: {
    sans: [
      `Inter`,
      `system-ui`,
      `-apple-system`,
      `BlinkMacSystemFont`,
      `Segoe UI`,
      `Roboto`,
      `sans-serif`,
    ]
      .map((s) => `"${s}"`)
      .join(","),
    serif: ["Lora", "Palatino", "Times New Roman", "Times", "serif"]
      .map((s) => `"${s}"`)
      .join(","),
    mono: [
      "JetBrains Mono",
      "Monaco",
      "Andale Mono",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ]
      .map((s) => `"${s}"`)
      .join(","),
  } as const,

  size: {
    50: "0.75rem",
    100: "0.875rem",
    200: "1rem",
    300: "1.125rem",
    400: "1.25rem",
    500: "1.5rem",
    600: "1.875rem",
    700: "2.25rem",
    800: "3rem",
    900: "4rem",
  },

  leading: {
    100: "1",
    200: "1.25",
    300: "1.375",
    400: "1.5",
    500: "1.625",
    600: "2",
    em100: "0.75em",
    em200: "1em",
    em300: "1.25em",
    em400: "1.5em",
    em500: "1.75em",
    em600: "2em",
    em700: "2.25em",
    em800: "2.5em",
  },

  tracking: {
    [-300]: "-0.05em",
    [-200]: "-0.025em",
    100: "0",
    200: "0.025em",
    300: "0.05em",
    400: "0.1em",
  },
} as const;

const padScale = {
  none: "0",

  100: "0.0625rem",
  200: "0.125rem",
  300: "0.25rem",
  400: "0.5rem",
  500: "1rem",
  600: "2rem",
  700: "4rem",
  800: "8rem",
  900: "16rem",

  em100: "0.125em",
  em200: "0.25em",
  em300: "0.5em",
  em400: "0.75em",
  em500: "1em",
  em600: "1.25em",
  em700: "2em",
  em800: "3.25em",
  em900: "5.25em",
} as const;

const radiusScale = {
  none: "0",
  primary: "0.375rem",
  100: "0.125rem",
  200: "0.25rem",
  300: "0.375rem",
  400: "0.5rem",
  500: "1rem",
  max: "625rem",
} as const;

const gapScale = {
  none: "0",
  auto: "auto",

  [-100]: "-0.0625rem",
  [-200]: "-0.125rem",
  [-300]: "-0.25rem",
  [-400]: "-0.5rem",
  [-500]: "-1rem",
  [-600]: "-2rem",
  [-700]: "-4rem",
  [-800]: "-8rem",
  [-900]: "-16rem",

  100: "0.0625rem",
  200: "0.125rem",
  300: "0.25rem",
  400: "0.5rem",
  500: "1rem",
  600: "2rem",
  700: "4rem",
  800: "8rem",
  900: "16rem",

  "-em100": "-0.125em",
  "-em200": "-0.25em",
  "-em300": "-0.5em",
  "-em400": "-0.75em",
  "-em500": "-1em",
  "-em600": "-1.25em",
  "-em700": "-2em",
  "-em800": "-3.25em",
  "-em900": "-5.25em",

  em100: "0.125em",
  em200: "0.25em",
  em300: "0.5em",
  em400: "0.75em",
  em500: "1em",
  em600: "1.25em",
  em700: "2em",
  em800: "3.25em",
  em900: "5.25em",
} as const;

const transitionSystem = {
  duration: {
    faster: "120ms",
    fast: "240ms",
    normal: "320ms",
    slow: "480ms",
    slower: "640ms",
  },
  timing: {
    primary: "cubic-bezier(0.4, 0, 0.2, 1)",
    accelerated: "cubic-bezier(0.4, 0, 1, 1)",
    decelerated: "cubic-bezier(0, 0, 0.2, 1)",
    elastic: "cubic-bezier(0.8, -0.5, 0.2, 1.4)",
    bounce: "cubic-bezier(0.8, 0.5, 0.2, 1.4)",
  },
} as const;

const zScale = {
  min: 0,
  100: 1,
  200: 10,
  300: 100,
  400: 1000,
  500: 10000,
  600: 100000,
  700: 1000000,
  800: 10000000,
  900: 100000000,
  max: 2147483647,
} as const;
const borderWidthScale = {
  none: 0,
  // Hairline borders
  50:
    (typeof window === "undefined"
      ? 1
      : "devicePixelRatio" in window && devicePixelRatio >= 2
      ? 0.5
      : 1) + "px",
  100: 1 + "px",
  200: 2 + "px",
  300: 4 + "px",
} as const;

const tokens = {
  vh: "100vh",
  font: typeSystem,
  radius: radiusScale,
  pad: padScale,
  gap: gapScale,
  transition: transitionSystem,
  zIndex: zScale,
  borderWidth: borderWidthScale,
  color: colorSystem,
};

export const themes = {
  light: {
    shadow: {
      none: "none",
      primary:
        "0 0 12px -3px rgba(0, 0, 0, 0.2), 0 0 6px -2px rgba(0, 0, 0, 0.2)",
      100: "0 0 0 1px rgba(0, 0, 0, 0.05)",
      200: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      300: "0 0 12px -3px rgba(0, 0, 0, 0.2), 0 0 6px -2px rgba(0, 0, 0, 0.2)",
      400: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      500: "0 0 15px -3px rgba(0, 0, 0, 0.2), 0 0 6px -2px rgba(0, 0, 0, 0.2)",
      600: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      700: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      inset: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      outline: "0 0 3px 3px rgba(66, 153, 225, 0.5)",
    },

    color: {
      bodyBg: pathToToken<Tokens>("color.white"),

      primary: pathToToken<Tokens>("color.indigo7"),
      secondary: pathToToken<Tokens>("color.slate7"),

      text: pathToToken<Tokens>("color.slate12"),
      text500: pathToToken<Tokens>("color.slate11"),
      text400: pathToToken<Tokens>("color.slate10"),

      danger: pathToToken<Tokens>("color.crimson10"),
      info: pathToToken<Tokens>("color.indigo10"),
      warning: pathToToken<Tokens>("color.amber10"),
      success: pathToToken<Tokens>("color.teal10"),
    },

    button: {
      color: {
        primary: {
          bg: pathToToken<Tokens>("color.blueGray900"),
          text: pathToToken<Tokens>("color.white"),
          hoverBg: pathToToken<Tokens>("color.blueGray700"),
          hoverText: pathToToken<Tokens>("color.white"),
          activeBg: pathToToken<Tokens>("color.black"),
          activeText: pathToToken<Tokens>("color.white"),
        },
        secondary: {
          bg: pathToToken<Tokens>("color.blue600"),
          text: pathToToken<Tokens>("color.white"),
          hoverBg: pathToToken<Tokens>("color.blue500"),
          hoverText: pathToToken<Tokens>("color.white"),
          activeBg: pathToToken<Tokens>("color.blue800"),
          activeText: pathToToken<Tokens>("color.white"),
        },
        disabled: {
          bg: pathToToken<Tokens>("color.gray300"),
          text: pathToToken<Tokens>("color.gray700"),
        },
      },

      size: {
        xs: {
          fontSize: pathToToken<Tokens>("font.size.100"),
          fontWeight: 500,
          padding: `${pathToToken<Tokens>("gap.em300")} ${pathToToken<Tokens>(
            "gap.em400"
          )}`,
        },
        sm: {
          fontSize: pathToToken<Tokens>("font.size.100"),
          fontWeight: 500,
          padding: `${pathToToken<Tokens>("gap.em400")} ${pathToToken<Tokens>(
            "gap.em500"
          )}`,
        },
        md: {
          fontSize: pathToToken<Tokens>("font.size.200"),
          fontWeight: 500,
          padding: `${rem(16)} ${rem(22)}`,
        },
        lg: {
          fontSize: pathToToken<Tokens>("font.size.400"),
          fontWeight: 500,
          padding: `${rem(22)} ${rem(30)}`,
        },
      },
    },

    iconButton: {
      color: {
        primary: {
          bg: pathToToken<Tokens>("color.blueGray100"),
          text: pathToToken<Tokens>("color.current"),
          hoverBg: pathToToken<Tokens>("color.blueGray200"),
          hoverText: pathToToken<Tokens>("color.blueGray900"),
          activeBg: pathToToken<Tokens>("color.blueGray300"),
          activeText: pathToToken<Tokens>("color.blueGray900"),
        },
        secondary: {
          bg: pathToToken<Tokens>("color.blueGray600"),
          text: pathToToken<Tokens>("color.white"),
          hoverBg: pathToToken<Tokens>("color.blueGray500"),
          hoverText: pathToToken<Tokens>("color.white"),
          activeBg: pathToToken<Tokens>("color.blueGray700"),
          activeText: pathToToken<Tokens>("color.white"),
        },
        disabled: {
          bg: pathToToken<Tokens>("color.gray300"),
          text: pathToToken<Tokens>("color.gray700"),
        },
      },

      size: {
        xs: {
          fontSize: pathToToken<Tokens>("font.size.100"),
          padding: pathToToken<Tokens>("gap.em200"),
        },
        sm: {
          fontSize: pathToToken<Tokens>("font.size.100"),
          padding: pathToToken<Tokens>("gap.em300"),
        },
        md: {
          fontSize: pathToToken<Tokens>("font.size.200"),
          padding: pathToToken<Tokens>("gap.em300"),
        },
        lg: {
          fontSize: pathToToken<Tokens>("font.size.300"),
          padding: pathToToken<Tokens>("gap.em400"),
        },
      },
    },

    input: {
      color: {
        blurred: {
          text: pathToToken<Tokens>("color.blueGray700"),
          hoverText: pathToToken<Tokens>("color.blueGray900"),
          border: pathToToken<Tokens>("color.blueGray300"),
          hoverBorder: pathToToken<Tokens>("color.blueGray400"),
        },
        focused: {
          text: pathToToken<Tokens>("color.blueGray900"),
          border: pathToToken<Tokens>("color.blueGray400"),
        },
        prefix: {
          bg: pathToToken<Tokens>("color.blueGray100"),
        },
        readOnly: {
          bg: pathToToken<Tokens>("color.blueGray100"),
          text: pathToToken<Tokens>("color.blueGray600"),
          border: pathToToken<Tokens>("color.blueGray400"),
        },
        disabled: {
          bg: pathToToken<Tokens>("color.gray200"),
          text: pathToToken<Tokens>("color.gray700"),
          border: pathToToken<Tokens>("color.blueGray400"),
        },
      },
    },

    avatar: {
      color: {
        text: pathToToken<Tokens>("color.blueGray500"),
        bg: pathToToken<Tokens>("color.blueGray200"),
      },
    },

    toast: {
      color: {
        bg: pathToToken<Tokens>("color.blueGray900"),
        text: pathToToken<Tokens>("color.white"),
        icon: pathToToken<Tokens>("color.blueGray400"),
      },
    },

    checkbox: {
      color: {
        unchecked: {
          bg: pathToToken<Tokens>("color.transparent"),
          border: pathToToken<Tokens>("color.blueGray300"),
        },
        checked: {
          bg: pathToToken<Tokens>("color.blueGray900"),
          border: pathToToken<Tokens>("color.blueGray900"),
        },
        hover: {
          bg: pathToToken<Tokens>("color.blueGray200"),
        },
        icon: pathToToken<Tokens>("color.white"),
      },
    },

    switch: {
      color: {
        off: {
          bg: pathToToken<Tokens>("color.blueGray300"),
          hoverBg: pathToToken<Tokens>("color.blueGray400"),
          border: pathToToken<Tokens>("color.blueGray300"),
        },
        on: {
          bg: pathToToken<Tokens>("color.blue500"),
          hoverBg: pathToToken<Tokens>("color.blue400"),
          border: pathToToken<Tokens>("color.blue500"),
        },
      },
    },
  },
} as const;

/**
 * A `styles` instance that is configured to use your design tokens
 * and themes.
 *
 * @see https://github.com/dash-ui/styles
 */
export const styles = createStyles({
  tokens,
  themes,
});

/**
 * These are the media queries you're using throughout your app.
 * These media queries will be available in media query props and
 * through the `mq()` helper below.
 */
export const mediaQueries = {
  /**
   * min-width: 0
   */
  min: `only screen and (min-width: 0)`,
  /**
   * min-width: 560px
   */
  xs: `only screen and (min-width: ${em(560)})`,
  /**
   * min-width: 768px
   */
  sm: `only screen and (min-width: ${em(768)})`,
  /**
   * min-width: 1024px
   */
  md: `only screen and (min-width: ${em(1024)})`,
  /**
   * min-width: 1280px
   */
  lg: `only screen and (min-width: ${em(1280)})`,
  /**
   * min-width: 1440px
   */
  xl: `only screen and (min-width: ${em(1440)})`,
  /**
   * High DPI devices
   */
  retina: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
  /**
   * Hover-enabled devices
   */
  hover: "(hover: hover)",
} as const;

/**
 * A helper for adding media queries to Dash `styles.variants`, `styles.one`,
 * `styles.cls`, etc. without having to type `@media blah blah` every
 * time.
 *
 * @see https://github.com/dash-ui/mq
 */
export const mq = dashMq(styles, mediaQueries);

/**
 * A function for adding responsive props/styles to components
 *
 * @see https://github.com/dash-ui/responsive
 */
export const responsiveStyles = responsive(styles, mediaQueries);

/**
 * A function for creating compound/multi-variant styles
 *
 * @see https://github.com/dash-ui/compound
 */
export const compoundStyles = compound(styles);

/**
 * A function for piping acceptable Dash style values left-to-right and returning a
 * compiled styled string.
 *
 * @param styles - A Dash styles instance
 * @example
 * ```ts
 * const pipeStyles = pipe(styles)
 *
 * const style = style.one(
 *   pipeStyles(
 *     row({gap: 300}),
 *     text({variant: 'body'}),
 *     t => ({
 *       color: t.color.primary,
 *     })
 *   )
 * )
 * ```
 */
function pipe<Tokens extends DashTokens, Themes extends DashThemes>(
  styles: Styles<Tokens, Themes>
) {
  return (
      ...css: StyleValue<Tokens, Themes>[]
    ): StyleCallback<Tokens, Themes> =>
    (t) =>
      css.reduce<string>((acc, c) => acc + compileStyles(c, t), "");
}

export const pipeStyles = pipe(styles);

/**
 * An localsStorage atom that stores the name of the current theme
 *
 * @see https://github.com/pmndrs/jotai
 */
export const themeAtom = persistAtom<keyof Themes>("theme", "light");

export type Tokens = typeof tokens;
export type Themes = typeof themes;
export type DesignTokens = TokensUnion<Tokens, Themes>;
export type ThemeNames = keyof Themes;
export type MediaQueries = typeof mediaQueries;
export type ResponsiveProp<Variant> =
  | Variant
  | Responsive<Variant, MediaQueries>;
export type TokenVariants<T extends Record<string | number, unknown>> =
  StyleMap<Extract<keyof T, string | number>, Tokens, Themes>;
