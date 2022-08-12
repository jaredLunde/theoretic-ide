import { useGlobal, useTokens } from "@dash-ui/react";
import resetGlobalStyles from "@dash-ui/reset";
import { useAtom } from "jotai";
import * as React from "react";
import { mq, styles } from "@/dash.config";
import { fontFamilyAtom, fontScale, fontScaleAtom } from "@/styles/text";

/**
 * Injects global styles for the app
 */
export function GlobalStyles() {
  const [fontScaleKey] = useAtom(fontScaleAtom);
  const [fontFamily] = useAtom(fontFamilyAtom);
  useFillAvailable();
  useGlobal(styles, resetGlobalStyles, []);
  useGlobal(
    styles,
    (t) => ({
      "*, ::before, ::after, body": {
        position: "relative",
        margin: 0,
        overflowWrap: "break-word",
      },
      "*:focus": {
        outline: "none",
      },
      "::selection, ::-moz-selection": {
        backgroundColor: t.color.indigo3,
      },
      html: {
        fontSize: fontScale[fontScaleKey],
        overflowX: "hidden",

        ":focus-within": {
          scrollBehavior: "smooth",
        },
      },
      body: {
        minWidth: "100%",
        minHeight: t.vh,
        backgroundColor: t.color.bodyBg,
      },
      ".loud": {
        transitionProperty: "opacity,visibility",
        transitionDuration: t.transition.duration.slower,
        transitionTimingFunction: t.transition.timing.primary,
      },
      ".writing-mode-enabled .loud": {
        opacity: "0!important",
        visibility: "hidden",
      },
      ".writing-mode-disabled .loud": {
        opacity: 1,
        visibility: "visible",
      },
    }),
    [fontScaleKey]
  );
  useGlobal(
    styles,
    mq({
      default: (t) => ({
        body: {
          fontSize: t.font.size[100],
          fontFamily: t.font.family[fontFamily],
          color: t.color.text,
          textRendering: "optimizeSpeed",
        },
        "h1,h2,h3": {
          textRendering: "optimizeLegibility",
        },
        "h1,h2,h3,h4,h5,h6": {
          fontWeight: "inherit",
        },
        "code,pre": {
          fontFamily: t.font.family.mono,
        },
      }),
      retina: {
        "h1,h2,h3,h4,h5,h6": {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "coolGrayscale",
        },
      },
    }),
    [fontFamily]
  );

  return null;
}

function useFillAvailable() {
  const windowHeight = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);

      return () => {
        window.removeEventListener("resize", callback);
      };
    },
    () => (typeof window === "undefined" ? "100vh" : window.innerHeight + "px"),
    () => (typeof window === "undefined" ? "100vh" : window.innerHeight + "px")
  );

  useTokens(styles, { vh: windowHeight }, [windowHeight]);
}
