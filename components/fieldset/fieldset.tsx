import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
import * as React from "react";
import { mq, responsiveStyles, styles } from "@/dash.config";
import type { ResponsiveProp } from "@/dash.config";
import { reduce } from "@/utils/obj";

export const Fieldset = Object.assign(
  React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
    ({ variant = "column", className, ...props }, ref) => {
      return (
        <fieldset
          className={clsx(className, fieldset(variant))}
          ref={ref}
          {...props}
        />
      );
    }
  ),
  {
    Legend: React.forwardRef<HTMLDivElement, LegendProps>(
      ({ className, children, ...props }, ref) => {
        return (
          <React.Fragment>
            <VisuallyHidden.Root asChild>
              <legend
                {...reduce(
                  props,
                  (acc: Record<string, unknown>, key) => {
                    if (!key.startsWith("aria-") && key !== "role") return acc;
                    acc[key] = props[key];
                    return acc;
                  },
                  {}
                )}
              >
                {children}
              </legend>
            </VisuallyHidden.Root>
            <div
              aria-hidden
              className={clsx(className, legend())}
              ref={ref}
              {...reduce(
                props,
                (acc: Record<string, unknown>, key) => {
                  if (key.startsWith("aria-") || key === "role") return acc;
                  acc[key] = props[key];
                  return acc;
                },
                {}
              )}
            >
              {children}
            </div>
          </React.Fragment>
        );
      }
    ),
  }
);

export const fieldset = responsiveStyles.variants({
  default: {
    display: "grid",
    border: 0,
    padding: 0,
    minWidth: 0,
    width: "100%",

    "body:not(:-moz-handler-blocked) &": {
      display: "grid",
    },

    "&[disabled]": {
      opacity: 0.5,
    },
  },

  column: (t) => ({
    gridTemplateColumns: "1fr",
    gap: t.gap[500],
  }),

  row: mq({
    min: (t) => ({
      gridTemplateColumns: "1fr",
      gap: t.gap[500],
      alignItems: "start",
    }),
    sm: {
      gridTemplateColumns: "1fr 1fr",
    },
    lg: (t) => ({
      gap: t.gap[600],
    }),
  }),
});

export const legend = styles.one((t) => ({
  float: "left",
  width: "auto",
  padding: 0,
  margin: 0,

  "+ *": {
    clear: "left",
  },

  h2: {
    fontSize: t.font.size[300],
    fontWeight: 500,
  },
  h3: {
    fontSize: t.font.size[100],
    fontWeight: 700,
  },
  p: {
    fontSize: t.font.size[100],
    lineHeight: t.font.leading[200],
    color: t.color.text500,
  },
}));

export interface FieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  variant?: ResponsiveProp<"column" | "row">;
}

export interface LegendProps extends React.HTMLAttributes<HTMLDivElement> {
  form?: HTMLLegendElement["form"];
}
