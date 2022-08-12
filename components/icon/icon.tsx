import clsx from "clsx";
import * as React from "react";
import { compoundStyles, responsiveStyles, styles } from "@/dash.config";
import type { DesignTokens, ResponsiveProp } from "@/dash.config";
import { text } from "@/styles/text";
import type { Icons } from "@/types/icons";

/**
 * A component for rendering icon styles from design tokens. Icons
 * must be a component that returns an `<svg>`.
 *
 * If using the `size` prop, your `<svg>` must not have `width` or `height`
 * properties set on it. If using the `color` prop, your `fill` and
 * `strokeColor` props must be set to `"currentColor"`.
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ name, color, size = "1em", className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(className, icon({ color, size, name }))}
        role={props.hasOwnProperty("role") ? props.role : "img"}
        aria-hidden={!props["aria-label"]}
        {...props}
      />
    );
  }
);

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /**
   * Set a size on the icon. Sizing this way requires that your SVG has no `width`
   * or `height` properties or styles set on it.
   */
  size?: ResponsiveProp<
    string | number | [string | number | null, string | number | null]
  >;
  /**
   * Set a color for the icon. Coloring requires that your SVG having `currentColor`
   * as its `fill` or `strokeColor`.
   */
  color?: ResponsiveProp<keyof DesignTokens["color"]>;
  /**
   * A URL to an image/svg file
   */
  name: ResponsiveProp<Icons>;
}

export const icon = compoundStyles(
  {
    default: styles.one({
      display: "inline-block",
      verticalAlign: "text-bottom",
      maskPosition: "center",
      maskRepeat: "no-repeat",
      maskSize: "cover",
      backgroundColor: "currentColor",
    }),
    /**
     * A URL to an image/svg file
     */
    name: responsiveStyles.lazy((name: string) => ({
      maskImage: `url(/icons/${name}.svg)`,
    })),
    /**
     * A responsive style for adding color to icons
     */
    color: text.styles.color,
    /**
     * A responsive style for icon sizing
     */
    size: responsiveStyles.lazy(
      (
        value:
          | null
          | string
          | number
          | [string | number | null, string | number | null]
      ) => {
        const initialWidth = Array.isArray(value) ? value[0] : value;
        let height = Array.isArray(value) ? value[1] : value;
        const width =
          initialWidth !== null && initialWidth !== ""
            ? initialWidth
            : height !== null && height !== ""
            ? "auto"
            : "1em";
        height =
          height !== null && height !== ""
            ? height
            : initialWidth !== null && initialWidth !== ""
            ? "auto"
            : "1em";

        return {
          width,
          height,
          contain: width !== "auto" && height !== "auto" ? "strict" : "none",
        };
      }
    ),
  },
  { atomic: true }
);
