import { Checkbox, Toggle } from "@accessible/checkbox";
import type { CheckboxProps } from "@accessible/checkbox";
import clsx from "clsx";
import * as React from "react";
import type { ResponsiveProp } from "@/dash.config";
import { mq, responsiveStyles, styles } from "@/dash.config";

/**
 * An accessible switch component that uses a native `<input type='checkbox'>`
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ size = 24, ...props }, ref) => {
    const [checked, setChecked] = React.useState(
      props.checked ?? props.defaultChecked ?? false
    );
    const [focused, setFocused] = React.useState(false);

    return (
      <Checkbox
        {...props}
        onFocus={(e) => {
          props.onFocus?.(e);
          setFocused(true);
        }}
        onBlur={(e) => {
          props.onBlur?.(e);
          setFocused(false);
        }}
        onChange={(checked) => {
          props.onChange?.(checked);
          setChecked(checked);
        }}
        ref={ref}
      >
        <Toggle>
          <span
            className={clsx(
              toggleSwitch({
                on: checked,
                off: !checked,
                focused,
                disabled: props.disabled,
              }),
              toggleSwitch.size(size)
            )}
          >
            <span
              className={toggleSwitch.thumb({
                on: checked,
                off: !checked,
              })}
            />
          </span>
        </Toggle>
      </Checkbox>
    );
  }
);

export interface SwitchProps extends Omit<CheckboxProps, "size"> {
  size?: ResponsiveProp<number>;
}

export const toggleSwitch = Object.assign(
  styles.variants({
    default: (t) => ({
      display: "inline-flex",
      alignItems: "center",
      borderRadius: t.radius.max,
      transition: `background-color ${t.transition.duration.normal} ${t.transition.timing.primary}`,

      "[disabled]": {
        opacity: 0.5,
      },
    }),

    off: mq({
      default: (t) => ({
        backgroundColor: t.switch.color.off.bg,
      }),
      hover: (t) => ({
        "&:hover": {
          backgroundColor: t.switch.color.off.hoverBg,
        },
        "[disabled] ~ &:hover": {
          backgroundColor: t.switch.color.off.bg,
        },
      }),
    }),

    on: mq({
      default: (t) => ({
        backgroundColor: t.switch.color.on.bg,
      }),
      hover: (t) => ({
        "&:hover": {
          backgroundColor: t.switch.color.on.hoverBg,
        },
        "[disabled] ~ &:hover": {
          backgroundColor: t.switch.color.on.bg,
        },
      }),
    }),

    focused: (t) => ({
      boxShadow: t.shadow.outline,
    }),

    disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  }),
  {
    size: responsiveStyles.lazy((size: number) => ({
      width: `calc(${size * 2}px - 4px)`,
      height: size,
      padding: 2,
    })),
    thumb: styles.variants({
      default: (t) => ({
        display: "inline-block",
        transition: `transform ${t.transition.duration.fast} ${t.transition.timing.primary}`,
        width: `50%`,
        height: "100%",
        borderRadius: t.radius.max,
        backgroundColor: t.color.white,
        boxShadow: t.shadow[100],
        pointerEvents: "none",
      }),

      off: {
        transform: "translateX(0)",
      },

      on: {
        transform: `translateX(100%)`,
      },
    }),
  }
);
