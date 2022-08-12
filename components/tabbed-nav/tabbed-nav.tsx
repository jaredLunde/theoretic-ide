import clsx from "clsx";
import * as React from "react";
import { Icon } from "@/components/icon";
import type { NavLinkProps } from "@/components/link";
import { NavLink } from "@/components/link";
import { mq, pipeStyles, styles } from "@/dash.config";
import { grid, hstack, vstack } from "@/styles/layout";
import { text } from "@/styles/text";
import type { Icons } from "@/types/icons";

export const TabbedNav = Object.assign(
  React.forwardRef<HTMLElement, TabbedNavProps>(
    ({ className, direction = "vertical", ...props }, ref) => {
      return (
        <nav
          ref={ref}
          className={clsx(className, tabbedNav(direction))}
          {...props}
        />
      );
    }
  ),
  {
    Tab: React.forwardRef<HTMLAnchorElement, TabbedNavTabProps>(
      ({ className, icon, active, children, ...props }, ref) => {
        return (
          <NavLink
            className={clsx(className, tab({ hasIcon: !!icon, active }))}
            ref={ref}
            {...props}
          >
            {typeof icon === "string" ? <Icon name={icon} /> : icon}
            {typeof children === "string" ? <span>{children}</span> : children}
          </NavLink>
        );
      }
    ),
  }
);

export interface TabbedNavProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Change the direction that the tabs render in.
   *
   * @default "vertical"
   */
  direction?: "horizontal" | "vertical";
}

export type TabbedNavTabProps = NavLinkProps & {
  icon?: Icons | React.ReactElement;
  active?: boolean;
};

export const tabbedNav = styles.variants({
  default: text.css({ leading: 200 }),
  vertical: vstack.css({ gap: 300 }),
  horizontal: hstack.css({
    width: "100%",
    gap: 300,
    distribute: "center",
  }),
});

export const tab = styles.variants({
  default: pipeStyles(
    grid.css({
      cols: 1,
      pad: ["em300", "em400"],
      gap: "em400",
      radius: "primary",
      alignY: "start",
      maxWidth: "100%",
    }),
    mq({
      default: (t) => ({
        backgroundColor: "transparent",
        color: t.color.text,
        fontWeight: 500,
        textDecoration: "none",

        '&[aria-current="page"]': {
          backgroundColor: t.color.blueGray800,
          color: t.color.white,
        },

        code: {
          padding: `0 ${t.pad.em200}`,
          color: t.color.text,
          backgroundColor: t.color.white,
          borderWidth: t.borderWidth[50],
          borderColor: t.color.blueGray200,
          borderStyle: "solid",
          borderRadius: t.radius.primary,
        },
      }),
      hover: (t) => ({
        "&:hover": {
          backgroundColor: t.color.blueGray200,
        },

        '&[aria-current="page"]:hover': {
          backgroundColor: t.color.blueGray800,
        },
      }),
    })
  ),

  hasIcon: pipeStyles(
    (t) => ({
      "> :first-child": {
        position: "relative",
        top: t.pad[200],
      },
    }),
    grid.css({
      cols: ["min-content", "auto"],
      pad: "em300",
    })
  ),

  active: mq({
    default: (t) => ({
      backgroundColor: t.color.blueGray800,
      color: t.color.white,
    }),
    hover: (t) => ({
      "&:hover": {
        backgroundColor: t.color.blueGray800,
      },
    }),
  }),
});
