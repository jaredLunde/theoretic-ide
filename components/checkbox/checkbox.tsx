import { Checkbox as AccessibleCheckbox, Toggle } from "@accessible/checkbox";
import type { CheckboxProps as AccessibleCheckboxProps } from "@accessible/checkbox";
import * as React from "react";
import { Icon } from "@/components/icon";
import { mq, styles } from "@/dash.config";

/**
 * An accessible checkbox component that uses a native `<input type='checkbox'>`
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const [checked, setChecked] = React.useState(
      props.checked ?? props.defaultChecked ?? false
    );
    const [focused, setFocused] = React.useState(false);

    return (
      <AccessibleCheckbox
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
            className={checkbox({
              checked,
              unchecked: !checked,
              focused,
              disabled: props.disabled,
            })}
          >
            <span
              className={checkbox.checkmark({
                checked,
                unchecked: !checked,
              })}
            >
              <Icon name="System/check-fill" />
            </span>
          </span>
        </Toggle>
      </AccessibleCheckbox>
    );
  }
);

export interface CheckboxProps extends AccessibleCheckboxProps {}

export const checkbox = Object.assign(
  styles.variants({
    default: (t) => ({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      borderRadius: "0.1875em",
      border: `${t.borderWidth[50]} solid ${t.checkbox.color.unchecked.border}`,
      transition: `background-color ${t.transition.duration.faster} ${t.transition.timing.primary}`,
      height: "calc(1.15em)",
      width: "calc(1.15em)",
    }),

    unchecked: mq({
      default: (t) => ({
        backgroundColor: t.checkbox.color.unchecked.bg,
        "[disabled] ~ &": {
          boxShadow: "none",
        },
      }),
      hover: (t) => ({
        "&:hover": {
          backgroundColor: t.checkbox.color.hover.bg,
        },
        "[disabled] ~ &:hover": {
          backgroundColor: t.color.gray200,
          boxShadow: "none",
        },
      }),
    }),

    checked: mq({
      default: (t) => ({
        backgroundColor: t.checkbox.color.checked.bg,
        borderColor: t.checkbox.color.checked.border,
        boxShadow: "none",
      }),
      hover: (t) => ({
        "&:hover": {
          backgroundColor: t.checkbox.color.checked.bg,
        },
        "[disabled] ~ &:hover": {
          backgroundColor: t.checkbox.color.checked.bg,
        },
      }),
    }),

    focused: (t) => ({
      boxShadow: t.shadow.outline,
    }),

    disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  }),
  {
    checkmark: styles.variants({
      default: (t) => ({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        borderRadius: "0.333em",
        color: t.checkbox.color.icon,
        pointerEvents: "none",
        fontSize: "1.125em",

        span: {
          transitionProperty: "opacity",
          transitionDuration: t.transition.duration.faster,
          transitionTimingFunction: t.transition.timing.primary,
        },
      }),

      unchecked: {
        span: {
          opacity: 0,
        },
      },

      checked: {
        span: {
          opacity: 1,
        },
      },
    }),
  }
);
