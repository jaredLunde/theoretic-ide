import clsx from "clsx";
import * as React from "react";
import { loaderElement, resetVendorButtonStyles } from "@/components/button";
import type { ResponsiveProp } from "@/dash.config";
import { compoundStyles, styles } from "@/dash.config";
import { text } from "@/styles/text";

export const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      variant,
      color,
      size,
      weight,
      leading,
      tracking,
      font,
      fetching,
      children,
      ...props
    },
    ref
  ) => (
    <button
      {...props}
      className={clsx(
        props.className,
        fetching && "fetching",
        textButton({ variant, color, size, weight, leading, tracking, font })
      )}
      ref={ref}
    >
      {fetching ? loaderElement : children}
    </button>
  )
);

export const textButton = compoundStyles(
  {
    default: styles.one((t) => ({
      ...resetVendorButtonStyles,
      cursor: "pointer",
      "&:focus-visible": {
        borderRadius: t.radius.primary,
        outline: `${t.borderWidth[200]} solid ${t.color.secondary}`,
      },
    })),
    ...text.styles,
  } as const,
  { atomic: true }
);

export interface TextButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  color?: ResponsiveProp<keyof typeof text.styles["color"]["styles"]>;
  size?: ResponsiveProp<keyof typeof text.styles["size"]["styles"]>;
  leading?: ResponsiveProp<keyof typeof text.styles["leading"]["styles"]>;
  tracking?: ResponsiveProp<keyof typeof text.styles["tracking"]["styles"]>;
  font?: ResponsiveProp<keyof typeof text.styles["font"]["styles"]>;
  weight?: ResponsiveProp<
    Exclude<keyof typeof text.styles["weight"]["styles"], "default">
  >;
  variant?: ResponsiveProp<
    Exclude<keyof typeof text.styles["variant"]["styles"], "default">
  >;
  fetching?: boolean;
}
