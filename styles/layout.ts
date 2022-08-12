import layout from "@dash-ui/layout";
import { mediaQueries, styles } from "@/dash.config";

export const {
  box,
  hstack,
  vstack,
  zstack,
  inline,
  overlay,
  flexItem,
  grid,
  autoGrid,
  gridItem,
  bleed,
} = layout(styles, mediaQueries);
