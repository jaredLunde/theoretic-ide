import type { StyleValue } from "@dash-ui/styles";
import clsx from "clsx";
import omit from "lodash.omit";
import * as React from "react";
import { resetVendorButtonStyles } from "@/components/button";
import { Icon } from "@/components/icon";
import { compoundStyles, mq, responsiveStyles, styles } from "@/dash.config";
import type {
  DesignTokens,
  ResponsiveProp,
  Themes,
  Tokens,
} from "@/dash.config";
import type { Icons } from "@/types/icons";
import { reduce } from "@/utils/obj";

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      color = "primary",
      size = "sm",
      icon,
      fetching,
      disabled,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(className, { fetching }, iconButton({ color, size }))}
        aria-disabled={disabled}
        onClick={!fetching && !disabled ? onClick : undefined}
        {...props}
      >
        <Icon name={icon} />
      </button>
    );
  }
);

export interface IconButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "color" | "children"
  > {
  icon: Icons;
  /**
   * Select a button color
   *
   * @default "primary"
   */
  color?: Exclude<keyof typeof iconButton.styles.color.styles, "default">;
  /**
   * Select a button size
   *
   * @default "sm"
   */
  size?: ResponsiveProp<
    Exclude<keyof typeof iconButton.styles.size.styles, "default">
  >;
  /**
   * Select a button color
   *
   * @default "primary"
   */
  fetching?: boolean;
}

/**
 * These are variants for solid button styles you want to use most often
 * in your application.
 */
export const iconButton = compoundStyles(
  {
    default: styles.one((t) => ({
      ...resetVendorButtonStyles,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      borderRadius: t.radius.max,
      transitionProperty: "background-color",
      transitionDuration: t.transition.duration.fast,
      transitionTimingFunction: t.transition.timing.primary,

      "&[aria-disabled='true']": {
        cursor: "not-allowed",
        backgroundColor: t.iconButton.color.disabled.bg,
        color: t.iconButton.color.disabled.text,
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
        omit(styles.tokens.iconButton.color, "disabled"),
        (
          acc: Record<
            Exclude<keyof DesignTokens["button"]["color"], "disabled">,
            StyleValue<Tokens, Themes>
          >,
          key
        ) => {
          acc[key] = mq({
            default: (t) => ({
              backgroundColor: t.iconButton.color[key].bg,
              color: t.iconButton.color[key].text,
              textDecoration: "none",
            }),
            hover: (t) => ({
              "&:hover:not([aria-disabled='true']):not(.fetching)": {
                backgroundColor: t.iconButton.color[key].hoverBg,
                color: t.iconButton.color[key].hoverText,
                textDecoration: "none",
              },

              "&:active:not([aria-disabled='true']):not(.fetching)": {
                backgroundColor: t.iconButton.color[key].activeBg,
                color: t.iconButton.color[key].activeText,
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
        styles.tokens.iconButton.size,
        (
          acc: Record<
            keyof DesignTokens["button"]["size"],
            StyleValue<Tokens, Themes>
          >,
          key
        ) => {
          acc[key] = (t) => ({
            fontSize: t.iconButton.size[key].fontSize,
            padding: t.iconButton.size[key].padding,
          });

          return acc;
        },
        {}
      )
    ),
  },
  { atomic: true }
);
