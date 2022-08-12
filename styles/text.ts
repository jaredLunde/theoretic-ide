import type { DesignTokens, TokenVariants } from "@/dash.config";
import { compoundStyles, mq, responsiveStyles, styles } from "@/dash.config";
import { persistAtom } from "@/stores/atoms";
import { reduce } from "@/utils/obj";

export const text = compoundStyles(
  {
    /**
     * Select a text variant
     */
    variant: responsiveStyles.variants({
      heading300: mq({
        default: (t) => ({
          fontSize: t.font.size[800],
          lineHeight: t.font.leading[100],
          letterSpacing: t.font.tracking[100],
          fontWeight: 700,
        }),
        sm: (t) => ({
          fontSize: t.font.size[900],
        }),
      }),
      heading200: mq({
        default: (t) => ({
          fontSize: t.font.size[600],
          lineHeight: t.font.leading[100],
          letterSpacing: t.font.tracking[100],
          fontWeight: 700,
        }),
        sm: (t) => ({
          fontSize: t.font.size[700],
        }),
      }),
      heading100: mq({
        default: (t) => ({
          fontSize: t.font.size[400],
          lineHeight: t.font.leading[100],
          letterSpacing: t.font.tracking[-200],
          fontWeight: 700,
        }),
        sm: (t) => ({
          fontSize: t.font.size[500],
        }),
      }),
      subheading: mq({
        default: (t) => ({
          fontSize: t.font.size[500],
          lineHeight: t.font.leading[200],
          letterSpacing: t.font.tracking[-200],
          fontWeight: 500,
        }),
        sm: (t) => ({
          fontSize: t.font.size[700],
        }),
      }),
      caption: (t) => ({
        fontSize: t.font.size[100],
        lineHeight: t.font.leading[300],
        letterSpacing: t.font.tracking[100],
        fontWeight: 300,
      }),
      action: (t) => ({
        fontSize: t.font.size[100],
        lineHeight: t.font.leading[300],
        letterSpacing: t.font.tracking[-200],
        textTransform: "uppercase",
        textRendering: "optimizeLegibility",
        fontWeight: 600,
      }),
    }),
    /**
     * Select a font weight
     */
    weight: responsiveStyles.variants({
      100: {
        fontWeight: 100,
      },
      200: {
        fontWeight: 200,
      },
      300: {
        fontWeight: 300,
      },
      400: {
        fontWeight: 400,
      },
      500: {
        fontWeight: 500,
      },
      600: {
        fontWeight: 600,
      },
      700: {
        fontWeight: 700,
      },
      800: {
        fontWeight: 800,
      },
      900: {
        fontWeight: 900,
      },
    }),
    align: responsiveStyles.variants({
      left: {
        textAlign: "left",
      },
      center: {
        textAlign: "center",
      },
      right: {
        textAlign: "right",
      },
    }),
    /**
     * Creates `line-height` styles for all of your `font.leading`
     * design tokens.
     */
    leading: responsiveStyles.variants(
      reduce(
        styles.tokens.font.leading,
        (obj: TokenVariants<DesignTokens["font"]["leading"]>, key) => {
          obj[key] = ({ font }) => ({
            lineHeight: font.leading[key],
          });

          return obj;
        },
        {}
      )
    ),
    /**
     * Creates `letter-spacing` styles for all of your `font.tracking`
     * design tokens.
     */
    tracking: responsiveStyles.variants(
      reduce(
        styles.tokens.font.tracking,
        (obj: TokenVariants<DesignTokens["font"]["tracking"]>, key) => {
          obj[key] = ({ font }) => ({
            letterSpacing: font.tracking[key],
          });

          return obj;
        },
        {}
      )
    ),
    /**
     * Creates font `color` styles for all of your `color`
     * design tokens.
     */
    color: responsiveStyles.variants(
      reduce(
        styles.tokens.color,
        (obj: TokenVariants<DesignTokens["color"]>, key) => {
          obj[key] = ({ color }) => ({
            color: color[key],
          });

          return obj;
        },
        {}
      )
    ),
    /**
     * Creates `font-family` styles for all of your `font.family`
     * design tokens.
     */
    font: responsiveStyles.variants(
      reduce(
        styles.tokens.font.family,
        (obj: TokenVariants<DesignTokens["font"]["family"]>, key) => {
          obj[key] = ({ font }) => ({
            fontFamily: font.family[key],
          });

          return obj;
        },
        {}
      )
    ),
    /**
     * Creates `font-size` styles for all of your `font.size`
     * design tokens.
     */
    size: responsiveStyles.variants(
      reduce(
        styles.tokens.font.size,
        (obj: TokenVariants<DesignTokens["font"]["size"]>, key) => {
          obj[key] = ({ font }) => ({
            fontSize: font.size[key],
          });

          return obj;
        },
        {}
      )
    ),
  },
  { atomic: true }
);

export const fontScale = {
  xs: "75%",
  sm: "87%",
  md: "100%",
  lg: "112%",
  xl: "125%",
} as const;

export const fontScaleAtom = persistAtom<keyof typeof fontScale>(
  "fontSize",
  "md"
);

export const fontFamilyAtom = persistAtom<keyof DesignTokens["font"]["family"]>(
  "fontFamily",
  "sans"
);
