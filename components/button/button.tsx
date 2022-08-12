import type { StyleValue } from "@dash-ui/styles";
import clsx from "clsx";
import omit from "lodash.omit";
import * as React from "react";
import { compoundStyles, mq, responsiveStyles, styles } from "@/dash.config";
import type {
  DesignTokens,
  ResponsiveProp,
  Themes,
  Tokens,
} from "@/dash.config";
import { hstack } from "@/styles/layout";
import { reduce } from "@/utils/obj";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = "primary",
      size = "sm",
      fetching,
      disabled,
      className,
      onClick,
      type,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(className, { fetching }, button({ color, size }))}
        disabled={disabled}
        type={fetching ? "button" : type}
        onClick={!fetching && !disabled ? onClick : undefined}
        {...props}
      >
        {fetching ? loaderElement : children}
      </button>
    );
  }
);

export function useA11yButton<P>(
  props: P
): React.HTMLAttributes<HTMLElement> & P {
  const clickedMouse = React.useRef(false);

  return {
    ...props,
    role: "button",
    tabIndex: 0,
    onTouchStart(e) {
      clickedMouse.current = true;
      (props as any).onTouchStart?.(e);
    },
    onMouseDown(e) {
      clickedMouse.current = true;
      (props as any).onMouseDown?.(e);
    },
    onClick(e) {
      // Only fire onClick if the keyboard was not used to initiate the click
      clickedMouse.current && (props as any).onClick?.(e);
      clickedMouse.current = false;
    },
    onKeyDown(e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        (props as any).onClick?.(e);
      }
    },
  };
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /**
   * Select a button color
   *
   * @default "primary"
   */
  color?: Exclude<keyof typeof button.styles.color.styles, "default">;
  /**
   * Select a button size
   *
   * @default "sm"
   */
  size?: ResponsiveProp<
    Exclude<keyof typeof button.styles.size.styles, "default">
  >;
  /**
   * Select a button color
   *
   * @default "primary"
   */
  fetching?: boolean;
}

/**
 * Resets all vendor `<button>` styles
 */
export const resetVendorButtonStyles = {
  padding: 0,
  border: "none",
  font: "inherit",
  color: "inherit",
  backgroundColor: "transparent",
  textDecoration: "none",
  appearance: "none",
  userSelect: "none",
  cursor: "default",
  verticalAlign: "middle",
  MozFocusInner: {
    border: 0,
    padding: 0,
    margin: 0,
  },
} as const;

export const resetVendorButton = styles.one(resetVendorButtonStyles);

/**
 * These are variants for solid button styles you want to use most often
 * in your application.
 */
export const button = compoundStyles(
  {
    default: styles.one((t) => ({
      ...resetVendorButtonStyles,
      lineHeight: t.font.leading[100],
      letterSpacing: t.font.tracking[-200],
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      borderRadius: t.radius.primary,
      transitionProperty: "background-color",
      transitionDuration: t.transition.duration.fast,
      transitionTimingFunction: t.transition.timing.primary,

      "&[disabled]": {
        cursor: "not-allowed",
        backgroundColor: t.button.color.disabled.bg,
        color: t.button.color.disabled.text,
      },

      "&.fetching": {
        cursor: "default",
      },

      ":focus-visible": {
        boxShadow: t.shadow.outline,
      },
    })),

    color: styles.variants(
      reduce(
        omit(styles.tokens.button.color, "disabled"),
        (
          acc: Record<
            Exclude<keyof DesignTokens["button"]["color"], "disabled">,
            StyleValue<Tokens, Themes>
          >,
          key
        ) => {
          acc[key] = mq({
            default: (t) => ({
              backgroundColor: t.button.color[key].bg,
              color: t.button.color[key].text,
              textDecoration: "none",
            }),
            hover: (t) => ({
              "&:hover:not([disabled]):not(.fetching)": {
                backgroundColor: t.button.color[key].hoverBg,
                color: t.button.color[key].hoverText,
                textDecoration: "none",
              },

              "&:active:not([disabled]):not(.fetching)": {
                backgroundColor: t.button.color[key].activeBg,
                color: t.button.color[key].activeText,
                textDecoration: "none",
              },
            }),
          });

          return acc;
        },
        {}
      )
    ),

    size: responsiveStyles.variants(
      reduce(
        styles.tokens.button.size,
        (
          acc: Record<
            keyof DesignTokens["button"]["size"],
            StyleValue<Tokens, Themes>
          >,
          key
        ) => {
          acc[key] = (t) => ({
            fontSize: t.button.size[key].fontSize,
            fontWeight: t.button.size[key].fontWeight,
            padding: t.button.size[key].padding,
          });

          return acc;
        },
        {}
      )
    ),
  },
  { atomic: true }
);

const loaderKeyframes = styles.keyframes({
  "0%,80%,100%": {
    transform: "scale(1)",
  },
  "40%": {
    transform: "scale(0)",
  },
});

export const loader = styles.variants({
  default: (t) => ({
    display: "inline-block",
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "center",
    backgroundColor: "currentColor",
    borderRadius: t.radius.max,
    width: "0.25em",
    height: "0.25em",
    animationFillMode: "both",
    animation: `${loaderKeyframes} 1.3333s infinite ${t.transition.timing.primary}`,
  }),
  first: {
    animationDelay: "0s",
  },
  second: (t) => ({
    animationDelay: "0.333s",
    marginLeft: t.gap.em200,
  }),
  third: (t) => ({
    animationDelay: "0.167s",
    marginLeft: t.gap.em200,
  }),
});

export const loaderElement = (
  <span className={hstack({ height: "1em", display: "inlineBlock" })}>
    <span className={loader("first")} />
    <span className={loader("second")} />
    <span className={loader("third")} />
  </span>
);
