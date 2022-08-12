import type {
  CustomDomComponent,
  CustomMotionComponentConfig,
} from "framer-motion/types/render/dom/motion-proxy";
import * as React from "react";
const actual = jest.requireActual("framer-motion");

const validMotionProps = new Set([
  "initial",
  "animate",
  "exit",
  "style",
  "variants",
  "transition",
  "transformTemplate",
  "transformValues",
  "custom",
  "inherit",
  "layout",
  "layoutId",
  "onLayoutAnimationComplete",
  "onLayoutMeasure",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "drag",
  "dragControls",
  "dragListener",
  "dragConstraints",
  "dragDirectionLock",
  "dragSnapToOrigin",
  "_dragX",
  "_dragY",
  "dragElastic",
  "dragMomentum",
  "dragPropagation",
  "dragTransition",
  "whileDrag",
  "onPan",
  "onPanStart",
  "onPanEnd",
  "onPanSessionStart",
  "onTap",
  "onTapStart",
  "onTapCancel",
  "onHoverStart",
  "onHoverEnd",
  "whileFocus",
  "whileTap",
  "whileHover",
  "layoutScroll",
]);

// https://github.com/framer/motion/blob/main/src/render/dom/motion.ts
function custom<Props>(
  Component: string | React.ComponentType<Props>,
  _customMotionComponentConfig: CustomMotionComponentConfig = {}
): CustomDomComponent<Props> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return React.forwardRef((props, ref) => {
    const domProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !validMotionProps.has(key))
    );

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Component ref={ref} {...domProps} />
    );
  });
}

const componentCache = new Map<string, unknown>();
const motion = new Proxy(custom, {
  get: (_target, key: string) => {
    if (!componentCache.has(key)) {
      componentCache.set(key, custom(key));
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return componentCache.get(key)!;
  },
});

module.exports = {
  __esModule: true,
  ...actual,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <React.Fragment>{children}</React.Fragment>
  ),
  motion,
};
