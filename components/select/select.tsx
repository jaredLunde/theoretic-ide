import * as Dropdown from "@radix-ui/react-dropdown-menu";
import useMergedRef from "@react-hook/merged-ref";
import useSize from "@react-hook/size";
import useSwitch from "@react-hook/switch";
import clsx from "clsx";
import * as React from "react";
import { resetVendorButtonStyles } from "@/components/button";
import { Icon } from "@/components/icon";
import { styles } from "@/dash.config";
import { canTouch } from "@/utils/can-touch";

export const Select = Object.assign(
  React.forwardRef<HTMLSelectElement, SelectProps>(
    (
      {
        children,
        defaultOpen,
        open,
        onOpenChange,
        value,
        defaultValue,
        onChange,
        side = "bottom",
        sideOffset,
        align = "start",
        alignOffset,
        disabled,
        native,
        styles = selectStyles,
        style,
        ...props
      },
      outerRef
    ) => {
      const id = React.useId();
      const innerRef = React.useRef<HTMLSelectElement>(null);
      const ref = useMergedRef(outerRef, innerRef);
      const rootRef = React.useRef<HTMLDivElement>(null);
      const [selected, setSelected] = React.useState(value ?? defaultValue);
      const [isOpen, toggleIsOpen] = useSwitch(defaultOpen, open, onOpenChange);
      const [labelWidth] = useSize(rootRef);
      const renderNativeSelect = canTouch() || native;

      let selectedOption: React.ReactElement<OptionProps>;

      React.Children.forEach(
        children,
        (
          child:
            | React.ReactElement<OptionProps>
            | React.ReactElement<OptGroupProps>,
          i
        ) => {
          if (!("value" in child.props)) {
            React.Children.forEach(
              child.props.children,
              (child2: React.ReactElement<OptionProps>, i2) => {
                if (i === 0 && i2 === 0) {
                  // Pick the first by default
                  selectedOption = child2;
                } else if (child2.props.value === selected) {
                  selectedOption = child2;
                }
              }
            );
          } else if (i === 0) {
            // Pick the first by default
            selectedOption = child as React.ReactElement<OptionProps>;
          } else if (child.props.value === selected) {
            selectedOption = child as React.ReactElement<OptionProps>;
          }
        }
      );

      const labelElement = (
        <div className={clsx("select-label", styles("label"))}>
          {
            // @ts-expect-error
            typeof selectedOption !== "undefined" &&
              React.createElement(renderNativeSelect ? "label" : "div", {
                ...selectedOption.props,
                htmlFor: id,
                "aria-hidden": true,
                "data-is-label": true,
              })
          }

          <Icon
            name="System/arrow-down-s-line"
            size="1.125em"
            className="select-icon"
          />
        </div>
      );

      return (
        <div
          className={clsx("select", styles("root"))}
          style={style}
          data-disabled={disabled}
          ref={rootRef}
        >
          <select
            id={id}
            aria-label={props["aria-label"]}
            disabled={disabled}
            onChange={(e) => {
              onChange?.(e.target.value);
              setSelected(e.target.value);
            }}
            value={selected}
            style={
              renderNativeSelect
                ? {
                    position: "absolute",
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }
                : selectStyle
            }
            onKeyDown={(e) =>
              !renderNativeSelect &&
              (e.key === " " ||
                e.key === "Spacebar" ||
                e.key === "Enter" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowUp") &&
              toggleIsOpen.on()
            }
            ref={ref}
            {...props}
          >
            {React.Children.map(
              children,
              (
                child:
                  | React.ReactElement<OptionProps>
                  | React.ReactElement<OptGroupProps>
              ) => {
                if ("value" in child.props) {
                  return (
                    <option key={child.props.value} value={child.props.value}>
                      {child.props.textValue ||
                        (typeof child.props.children === "string"
                          ? child.props.children
                          : child.props.value)}
                    </option>
                  );
                }

                return (
                  <optgroup
                    label={
                      typeof child.props.label === "object"
                        ? child.props.label.label
                        : child.props.label
                    }
                  >
                    {React.Children.map(
                      child.props.children,
                      (child: React.ReactElement<OptionProps>) => {
                        return (
                          <option
                            key={child.props.value}
                            value={child.props.value}
                          >
                            {child.props.textValue ||
                              (typeof child.props.children === "string"
                                ? child.props.children
                                : child.props.value)}
                          </option>
                        );
                      }
                    )}
                  </optgroup>
                );
              }
            )}
          </select>

          {renderNativeSelect ? (
            labelElement
          ) : (
            <Dropdown.Root
              open={isOpen}
              onOpenChange={(open) => {
                if (innerRef.current?.matches(":disabled")) return;
                if (open) {
                  toggleIsOpen.on();
                } else {
                  toggleIsOpen.off();
                }
              }}
            >
              <Dropdown.Trigger asChild tabIndex={-1} aria-hidden>
                {labelElement}
              </Dropdown.Trigger>
              <Dropdown.Content
                align={align}
                alignOffset={alignOffset}
                avoidCollisions={false}
                side={side}
                sideOffset={sideOffset}
                style={{ width: labelWidth }}
                className={clsx("select-menu", styles("menu"))}
                aria-hidden
              >
                <Dropdown.RadioGroup
                  value={selected}
                  onValueChange={(value) => {
                    onChange?.(value);
                    setSelected(value);
                  }}
                  className={clsx("select-menu-options", styles("options"))}
                >
                  {children}
                </Dropdown.RadioGroup>
              </Dropdown.Content>
            </Dropdown.Root>
          )}
        </div>
      );
    }
  ),
  {
    Option: React.forwardRef<HTMLDivElement, OptionProps>(
      ({ className, textValue, ...props }, ref) => {
        return (
          <Dropdown.RadioItem
            ref={ref}
            className={clsx("select-menu-option", className)}
            textValue={textValue}
            {...props}
          />
        );
      }
    ),
    OptGroup: React.forwardRef<HTMLDivElement, OptGroupProps>(
      ({ label, className, children, ...props }, ref) => {
        return (
          <div
            ref={ref}
            className={clsx("select-menu-optgroup", className)}
            {...props}
          >
            {typeof label === "object" ? (
              label.element
            ) : (
              <div className="select-menu-optgroup-label">{label}</div>
            )}
            {children}
          </div>
        );
      }
    ),
  }
);

export const selectStyles = styles.variants({
  root: (t) => ({
    userSelect: "none",

    "> select:focus ~ .select-label": {
      boxShadow: t.shadow.outline,
    },

    ".select-label": {
      display: "grid",
      gridTemplateColumns: "1fr min-content",
      alignItems: "center",
      padding: `${t.pad[400]} ${t.pad.em400}`,
      borderRadius: t.radius.primary,
      backgroundColor: t.color.bodyBg,
      border: `${t.borderWidth[50]} solid ${t.color.blueGray300}`,
      width: "100%",
      height: "100%",
      textAlign: "left",
    },

    ".select-menu": {
      backgroundColor: t.color.blueGray200,
    },

    ".select-menu-option": {
      display: "flex",
      alignItems: "center",

      "> * + *": {
        marginLeft: t.gap[500],
        align: "center",
      },
    },
  }),

  menu: (t) => ({
    backgroundColor: t.color.bodyBg,
    border: `${t.borderWidth[50]} solid ${t.color.blueGray300}`,
    boxShadow: t.shadow[200],
    overflow: "auto",
    maxHeight: "80vh",
    padding: t.pad.em200,
    zIndex: t.zIndex.max,

    "& > * + *": {
      marginTop: t.gap.em100,
    },

    '&[data-side="top"]': {
      borderRadius: t.radius.primary,
      bottom: t.gap[200],

      "> *:first-child": {
        borderRadius: `${t.radius.primary} ${t.radius.primary} 0 0`,
        overflow: "hidden",
      },

      "> *:last-child": {
        borderRadius: `0 0 ${t.radius.primary} ${t.radius.primary}`,
        overflow: "hidden",
      },
    },

    '&[data-side="bottom"]': {
      borderRadius: t.radius.primary,
      top: t.gap[200],

      "> *:last-child": {
        borderRadius: `${t.radius.primary} ${t.radius.primary} 0 0`,
        overflow: "hidden",
      },
    },

    ".select-label": {
      ...resetVendorButtonStyles,
      padding: `${t.pad[300]} ${t.pad[400]}`,
      width: "100%",
      height: "100%",
      textAlign: "left",
    },

    ".select-menu-optgroup": {
      "& > * + *": {
        marginTop: t.gap.em100,
      },
    },

    ".select-menu-optgroup-label": {
      color: t.color.text400,
      padding: `${t.pad[300]} ${t.pad[400]} ${t.pad.em100}`,
      fontSize: t.font.size[50],
    },

    ".select-menu-option": {
      display: "flex",
      alignItems: "center",
      cursor: "default",
      padding: `${t.pad[300]} ${t.pad[400]}`,
      borderRadius: t.radius.primary,

      "> * + *": {
        marginLeft: t.gap[500],
        align: "center",
      },

      ":focus": {
        backgroundColor: t.color.blueGray200,
      },

      '&[data-state="checked"]': {
        color: t.color.text,
        backgroundColor: t.color.blueGray200,
      },
    },
  }),

  label: {
    display: "inline-block",
  },
  options: {},
});

const selectStyle: React.CSSProperties = {
  zIndex: -1,
  position: "absolute",
  fontSize: "1rem",
  height: 0,
  minHeight: 0,
  width: 0,
  minWidth: 0,
  border: "none",
  outline: "none",
  MozAppearance: "none",
  WebkitAppearance: "none",
  WebkitBoxShadow: "none",
  MozBoxShadow: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
  boxShadow: "none",
  appearance: "none",
};

export interface SelectProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
  native?: boolean;
  styles?: typeof selectStyles;
  style?: React.CSSProperties;
  side?: Dropdown.DropdownMenuContentProps["side"];
  sideOffset?: Dropdown.DropdownMenuContentProps["sideOffset"];
  align?: Dropdown.DropdownMenuContentProps["align"];
  alignOffset?: Dropdown.DropdownMenuContentProps["alignOffset"];
  children:
    | React.ReactElement<OptionProps>
    | React.ReactElement<OptGroupProps>
    | (React.ReactElement<OptGroupProps> | React.ReactElement<OptionProps>)[];
}

export interface OptGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: string | { label: string; element: React.ReactNode };
  children: React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[];
}

export interface OptionProps extends Dropdown.DropdownMenuRadioItemProps {
  as?: React.ElementType;
  textValue?: string;
  renderedAsLabel?: boolean;
  "data-is-label"?: boolean;
}
