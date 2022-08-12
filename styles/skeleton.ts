import { compoundStyles, styles } from "@/dash.config";
import { box } from "@/styles/layout";

export const skeleton = compoundStyles(
  {
    default: styles.one({
      display: "inline-block",
      verticalAlign: "text-bottom",
      animationName: styles.keyframes({
        "0%": {
          opacity: "0.6",
        },
        "50%": {
          opacity: "1",
        },
        "100%": {
          opacity: "0.6",
        },
      }),
      animationDuration: "1.67s",
      animationIterationCount: "infinite",
      animationTimingFunction: "ease-in-out",
    }),

    /**
     * Sets the skeleton variant.
     * - `text`: automatically uses a height of `1em`
     * - `rect`: for rectangles, has a `primary` border radius
     * - `circle`: adds a `max` border radius
     *
     * @default rect
     */
    variant: styles.lazy((variant: "text" | "rect" | "circle") => (t) => ({
      backgroundColor: t.color.blue100,
      height: variant === "text" ? "1em" : "auto",
      borderRadius: variant === "circle" ? "full" : "primary",
    })),
    ...box.styles,
  },
  { atomic: true }
);
