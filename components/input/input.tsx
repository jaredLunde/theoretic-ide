import useMergedRef from "@react-hook/merged-ref";
import clsx from "clsx";
import * as React from "react";
import { mq, pipeStyles, styles } from "@/dash.config";
import { hstack } from "@/styles/layout";
import { text } from "@/styles/text";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      prefix,
      suffix,
      required,
      hideLabelOnFocus,
      focusImmediately,
      ...props
    },
    outerRef
  ) => {
    const labelId = React.useId();
    const [focused, setFocused] = React.useState(false);
    const [entered, setEntered] = React.useState(
      !!(props.value ?? props.defaultValue)
    );
    const typing = (!props.readOnly && !props.disabled && focused) || entered;
    const innerRef = React.useRef<HTMLInputElement>();
    const ref = useMergedRef(outerRef, innerRef);

    React.useEffect(() => {
      if (focusImmediately && innerRef.current) {
        innerRef.current.focus();
      }
    }, [focusImmediately]);

    return (
      <div
        className={clsx(
          className,
          input({
            focused: focused && !props.readOnly,
            disabled: props.disabled,
            readOnly: props.readOnly,
          })
        )}
      >
        <div
          className={input.visualStyles({
            typing: typing && label && !hideLabelOnFocus,
            readOnly: props.readOnly,
          })}
        >
          <div />
          {label && (
            // eslint-disable-next-line jsx-a11y/aria-role
            <div id={labelId} role="label">
              <div
                className={input.label({
                  typing: typing && !hideLabelOnFocus,
                  hideLabel: typing && hideLabelOnFocus,
                })}
              >
                {label}
              </div>
            </div>
          )}
          <div />
        </div>

        <div>
          <div>{!label || (label && typing) ? prefix : null}</div>

          <input
            {...props}
            ref={ref}
            placeholder={
              !label || (label && typing) ? props.placeholder : undefined
            }
            required={required}
            onChange={(e) => {
              props.onChange?.(e);
              setEntered(!!e.target.value);
            }}
            onFocus={(e) => {
              props.onFocus?.(e);
              setFocused(true);
            }}
            onBlur={(e) => {
              props.onBlur?.(e);
              setFocused(false);
            }}
            aria-labelledby={
              props["aria-labelledby"] || label
                ? clsx(props["aria-labelledby"], label && labelId)
                : undefined
            }
          />

          <div>{suffix}</div>
        </div>
      </div>
    );
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  focusImmediately?: boolean;
  hideLabelOnFocus?: boolean;
}

export const resetVendorInputStyles = {
  display: "inline-block",
  verticalAlign: "middle",
  margin: 0,
  padding: 0,
  lineHeight: 1,
  border: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
  boxShadow: "none",
  appearance: "none",
  outline: "none",
  color: "currentColor",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  letterSpacing: "inherit",

  ":focus": {
    outline: "none",
    boxShadow: "none",
  },
} as const;

export const input = Object.assign(
  styles.variants({
    default: mq({
      default: (t) => ({
        display: "inline-block",
        color: t.input.color.blurred.border,
        width: "100%",
        borderRadius: t.radius.primary,
        transitionProperty: "color",
        transitionDuration: t.transition.duration.slow,
        transitionTimingFunction: t.transition.timing.primary,

        input: {
          ...resetVendorInputStyles,
          color: t.input.color.blurred.text,
          lineHeight: t.font.leading[300],
          padding: `${t.pad.em400} ${t.pad.em400}`,
          width: "100%",
          transitionProperty: "color",
          transitionDuration: t.transition.duration.fast,
          transitionTimingFunction: t.transition.timing.primary,

          '&:not(:focus)[aria-invalid="true"]': {
            color: t.color.danger,
            backgroundColor: t.color.crimsonA3,
          },
        },

        "> div:last-child": {
          display: "grid",
          gridTemplateColumns: "min-content 1fr min-content",
          alignItems: "stretch",
        },
      }),
      hover: (t) => ({
        ":hover": {
          color: t.input.color.blurred.hoverBorder,

          input: {
            color: t.input.color.blurred.hoverText,
          },
        },
      }),
    }),

    focused: (t) => ({
      color: t.input.color.focused.border,

      input: {
        caretColor: t.color.text,
        color: t.input.color.focused.text,
      },
    }),

    disabled: mq({
      default: (t) => ({
        opacity: 0.5,
        backgroundColor: t.input.color.disabled.bg,
        color: t.input.color.disabled.border,

        input: {
          cursor: "not-allowed",
          color: t.input.color.disabled.text,
        },
      }),
      hover: (t) => ({
        backgroundColor: t.input.color.disabled.bg,
      }),
    }),

    readOnly: mq({
      default: (t) => ({
        color: t.input.color.readOnly.border,
        input: {
          cursor: "default",
        },
      }),
      hover: {
        ":hover": {
          backgroundColor: "transparent",
        },
      },
    }),
  }),
  {
    visualStyles: styles.variants({
      default: (t) => ({
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        height: "100%",
        width: "100%",
        color: "currentColor",
        zIndex: t.zIndex[100],
        borderRadius: t.radius.primary,

        "> *": {
          flexShrink: 0,
          height: "100%",
          border: `${t.borderWidth[50]} solid currentColor`,

          ":first-child": {
            minWidth: 6,
            borderRightWidth: 0,
            borderRadius: `${t.radius.primary} 0 0 ${t.radius.primary}`,
          },

          ":nth-child(2):not(:last-child)": {
            display: "flex",
            width: "max-content",
            alignItems: "center",
            borderRightWidth: 0,
            borderLeftWidth: 0,
            padding: `0 6px`,
          },

          ":last-child": {
            flexGrow: 1,
            borderLeftWidth: 0,
            borderRadius: `0 ${t.radius.primary} ${t.radius.primary} 0`,
          },
        },
      }),

      readOnly: (t) => ({
        backgroundColor: t.input.color.readOnly.bg,
      }),

      typing: {
        "> *:nth-child(2):not(:last-child)": {
          borderTopColor: "transparent",
        },
      },
    }),

    label: styles.variants({
      default: (t) => ({
        display: "inline-block",
        color: t.input.color.blurred.text,
        fontWeight: 500,
        transformOrigin: "top left",
        transform: "translate3d(0, 0, 0)",
        transitionProperty: "font-size, transform",
        transitionDuration: t.transition.duration.fast,
        transitionTimingFunction: t.transition.timing.primary,
      }),

      hideLabel: {
        opacity: 0,
      },

      typing: (t) => ({
        fontSize: t.font.size[50],
        color: t.input.color.focused.text,
        transform: `translate3d(0, -1.45em, 0)`,
      }),
    }),
  } as const
);

export const prefix = {
  fill: styles.one(
    pipeStyles(
      (t) => ({
        backgroundColor: t.input.color.prefix.bg,
      }),
      hstack.css({
        height: "100%",
        align: "center",
        radius: ["primary", "none", "none", "primary"],
        border: [["none", 50, "none", "none"], "current"],
        pad: ["none", "em400", "none", "em400"],
      }),
      text.css({ weight: 400 })
    )
  ),
};
