/* eslint-disable jsx-a11y/anchor-has-content */
import type { LinkProps as NextLinkProps } from "next/link";
import NextLink from "next/link";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import * as React from "react";
import { routes } from "@/routes.config";

export { default as NextLink } from "next/link";

function LinkBase<
  To extends keyof typeof routes = keyof typeof routes,
  Params extends Parameters<typeof routes[To]>[0] = Parameters<
    typeof routes[To]
  >[0]
>(
  {
    to,
    params,
    replace,
    locale,
    scroll,
    shallow,
    ...props
  }: LinkProps<To, Params>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  // @ts-expect-error - it will be undefined sometimes, but that's ok
  const href = routes[to](params);
  return (
    <NextLink
      href={href}
      replace={replace}
      locale={locale}
      scroll={scroll}
      shallow={shallow}
    >
      <a ref={ref} {...props} />
    </NextLink>
  );
}

export const Link = React.forwardRef(LinkBase) as <
  To extends keyof typeof routes,
  Params extends Parameters<typeof routes[To]>[0]
>(
  props: LinkProps<To, Params> & {
    ref?: Parameters<typeof LinkBase>[1];
  }
) => ReturnType<typeof LinkBase>;

function NavLinkBase<
  To extends keyof typeof routes,
  Params extends Parameters<typeof routes[To]>[0]
>(
  {
    to,
    params,
    isActive,
    replace,
    locale,
    scroll,
    shallow,
    ...props
  }: NavLinkProps<To, Params>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  // @ts-expect-error - it will be undefined sometimes, but that's ok
  const href = routes[to](params);
  const navLink = useNavLink({ as: undefined, href, isActive });

  return (
    <NextLink
      href={href}
      replace={replace}
      locale={locale}
      scroll={scroll}
      shallow={shallow}
    >
      <a ref={ref} {...props} {...navLink.props} />
    </NextLink>
  );
}

export const NavLink = React.forwardRef(NavLinkBase) as <
  To extends keyof typeof routes = keyof typeof routes,
  Params extends Parameters<typeof routes[To]>[0] = Parameters<
    typeof routes[To]
  >[0]
>(
  props: NavLinkProps<To, Params> & {
    ref?: Parameters<typeof NavLinkBase>[1];
  }
) => ReturnType<typeof NavLinkBase>;

export function useNavLink({
  href,
  as,
  isActive,
}: NextLinkProps & { isActive?: NavLinkProps<any, any>["isActive"] }) {
  const router = useRouter();
  const active =
    typeof isActive === "function"
      ? isActive({ router, as, href })
      : isActive
      ? router.asPath.match(isActive)
      : router.asPath === href || router.asPath === as;

  return React.useMemo(
    () =>
      ({
        active,
        props: { "aria-current": active ? "page" : undefined },
      } as const),
    [active]
  );
}

export type LinkProps<
  To extends keyof typeof routes = keyof typeof routes,
  Params extends Parameters<typeof routes[To]>[0] = Parameters<
    typeof routes[To]
  >[0]
> = (Params extends undefined
  ? {
      to: To;
      params?: never;
    }
  : {
      to: To;
      params: Params;
    }) &
  Pick<NextLinkProps, "replace" | "locale" | "scroll" | "shallow"> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export type NavLinkProps<
  To extends keyof typeof routes = keyof typeof routes,
  Params extends Parameters<typeof routes[To]>[0] = Parameters<
    typeof routes[To]
  >[0]
> = LinkProps<To, Params> & {
  isActive?:
    | RegExp
    | (({
        as,
        href,
        router,
      }: {
        as: NextLinkProps["as"];
        href: NextLinkProps["href"];
        router: NextRouter;
      }) => boolean);
};
