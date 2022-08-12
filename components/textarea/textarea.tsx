import useMergedRef from "@react-hook/merged-ref";
import clsx from "clsx";
import * as React from "react";
import { resetVendorInputStyles } from "@/components/input";
import { mq, pipeStyles, styles } from "@/dash.config";
import { hstack } from "@/styles/layout";
import { text } from "@/styles/text";

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      prefix,
      suffix,
      required,
      hideLabelOnFocus,
      autoResize,
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
    const [value, setValue] = React.useState(props.value ?? props.defaultValue);
    const [resizeStyle, setResizeStyle] = React.useState<React.CSSProperties>(
      {}
    );
    const typing = (!props.readOnly && !props.disabled && focused) || entered;
    const innerRef = React.useRef<HTMLTextAreaElement>();
    const ref = useMergedRef(outerRef, innerRef);

    React.useEffect(() => {
      if (focusImmediately && innerRef.current) {
        innerRef.current.focus();
      }
    }, [focusImmediately]);

    React.useLayoutEffect(() => {
      if (autoResize) {
        if (!value) {
          setResizeStyle((current) =>
            current.height === void 0 ? current : {}
          );
        } else {
          const target = innerRef.current;
          if (!target) return;

          setResizeStyle((current) => {
            // Setting this to `auto` first ensures that we get an
            // accurate assessment of the height when a user deletes
            // text.
            target.style.height = "auto";
            const nextHeight = target.scrollHeight;

            if (nextHeight === current.height) {
              target.style.height = target.scrollHeight + "px";
              return current;
            }

            return {
              height: nextHeight,
            };
          });
        }
      }
    }, [value, autoResize]);

    return (
      <div
        className={clsx(
          className,
          textarea({
            focused: focused && !props.readOnly,
            disabled: props.disabled,
            readOnly: props.readOnly,
          })
        )}
      >
        <div
          className={textarea.visualStyles({
            typing: typing && label && !hideLabelOnFocus,
            readOnly: props.readOnly,
          })}
        >
          <div />
          {label && (
            // eslint-disable-next-line jsx-a11y/aria-role
            <div id={labelId} role="label">
              <div
                className={textarea.label({
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

          <textarea
            {...props}
            ref={ref}
            placeholder={
              !label || (label && typing) ? props.placeholder : undefined
            }
            required={required}
            style={
              props.style
                ? Object.assign(props.style, resizeStyle)
                : resizeStyle
            }
            onChange={(e) => {
              props.onChange?.(e);
              setEntered(!!e.target.value);
              setValue(e.target.value);
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

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "prefix"> {
  label?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  focusImmediately?: boolean;
  hideLabelOnFocus?: boolean;
  autoResize?: boolean;
}

export const textarea = Object.assign(
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

        textarea: {
          ...resetVendorInputStyles,
          resize: "vertical",
          color: t.input.color.blurred.text,
          lineHeight: t.font.leading[300],
          padding: `${t.pad.em400} ${t.pad.em400}`,
          width: "100%",
          transitionProperty: "color",
          transitionDuration: t.transition.duration.fast,
          transitionTimingFunction: t.transition.timing.primary,
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

          textarea: {
            color: t.input.color.blurred.hoverText,
          },
        },
      }),
    }),

    focused: (t) => ({
      color: t.input.color.focused.border,

      textarea: {
        caretColor: t.color.text,
        color: t.input.color.focused.text,
      },
    }),

    disabled: mq({
      default: (t) => ({
        opacity: 0.5,
        backgroundColor: t.input.color.disabled.bg,
        color: t.input.color.disabled.border,

        textarea: {
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
        textarea: {
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
            alignItems: "flex-start",
            borderRightWidth: 0,
            borderLeftWidth: 0,
            padding: `10px 6px`,
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
