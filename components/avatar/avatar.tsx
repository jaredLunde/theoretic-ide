/* eslint-disable @next/next/no-img-element */
import * as RadixAvatar from "@radix-ui/react-avatar";
import clsx from "clsx";
import * as React from "react";
import { compoundStyles, responsiveStyles, styles } from "@/dash.config";
import type { ResponsiveProp } from "@/dash.config";

export const Avatar = React.forwardRef<
  HTMLImageElement | HTMLDivElement,
  AvatarProps
>(({ src, size = "sm", className, alt, fallback = "HI", ...props }, ref) => {
  return (
    <RadixAvatar.Root asChild>
      <div className={clsx(className, avatar({ size }))}>
        {/*@ts-expect-error: div ref vs. img ref*/}
        <RadixAvatar.Image asChild ref={ref}>
          <img
            src={src}
            aria-hidden={!props["aria-label"]}
            alt={alt}
            {...props}
          />
        </RadixAvatar.Image>

        <RadixAvatar.Fallback asChild className={avatar.fallback()} ref={ref}>
          <div>{fallback}</div>
        </RadixAvatar.Fallback>
      </div>
    </RadixAvatar.Root>
  );
});

const avatar = Object.assign(
  compoundStyles(
    {
      default: styles.one((t) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "nowrap",
        borderRadius: "0.333em",
        overflow: "hidden",
        contain: "strict",
        backgroundColor: t.avatar.color.bg,

        img: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },
      })),
      size: responsiveStyles.lazy((value: keyof typeof sizes) => {
        return sizes[value];
      }),
    },
    { atomic: true }
  ),
  {
    fallback: styles.one((t) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: t.avatar.color.text,
      lineHeight: t.font.leading[100],
      letterSpacing: t.font.tracking[-200],
      fontWeight: 600,
      width: "100%",
      height: "100%",
      fontSize: "0.48em",
    })),
  }
);

const sizes = {
  xs: {
    width: 16,
    height: 16,
    fontSize: 16,
  },
  sm: {
    width: 24,
    height: 24,
    fontSize: 24,
  },
  md: {
    width: 32,
    height: 32,
    fontSize: 32,
  },
  lg: {
    width: 72,
    height: 72,
    fontSize: 72,
  },
  xl: {
    width: 144,
    height: 144,
    fontSize: 144,
  },
} as const;

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  size?: ResponsiveProp<keyof typeof sizes>;
  fallback?: React.ReactNode;
}
