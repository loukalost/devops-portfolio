/**
 * Lightweight mock of `motion/react` for jsdom tests.
 *
 * Animations are irrelevant to "does the page render the right content" tests,
 * and the real library relies on browser APIs (IntersectionObserver,
 * requestAnimationFrame, layout measurement) that are noisy/absent in jsdom.
 * We render every `motion.<tag>` as the plain DOM tag and stub the hooks.
 */
import * as React from "react";

type AnyProps = Record<string, unknown>;

// Animation-only props that must NOT reach the underlying DOM element.
const MOTION_ONLY = new Set([
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileInView",
  "whileDrag",
  "whilePress",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "layout",
  "layoutId",
  "layoutDependency",
  "custom",
  "viewport",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onViewportEnter",
  "onViewportLeave",
]);

function createMotionComponent(tag: string): React.FC<AnyProps> {
  const MotionMock: React.FC<AnyProps> = (props) => {
    const children = props.children as React.ReactNode;
    const ref = props.ref as React.Ref<unknown> | undefined;
    const clean: AnyProps = {};
    for (const key in props) {
      if (key === "children" || key === "ref" || MOTION_ONLY.has(key)) continue;
      clean[key] = props[key];
    }
    return React.createElement(tag, { ...clean, ref }, children);
  };
  MotionMock.displayName = `motion.${tag}`;
  return MotionMock;
}

const componentCache = new Map<string, React.FC<AnyProps>>();

export const motion: Record<string, React.FC<AnyProps>> = new Proxy(
  {} as Record<string, React.FC<AnyProps>>,
  {
    get(_target, key: string) {
      if (typeof key !== "string") return undefined;
      if (!componentCache.has(key)) {
        componentCache.set(key, createMotionComponent(key));
      }
      return componentCache.get(key);
    },
  },
);

export function AnimatePresence({ children }: { children?: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}

// Motion-value-like stub: enough surface for the components under test.
function motionValue(initial: unknown = 0) {
  return {
    get: () => initial,
    set: () => {},
    on: () => () => {},
    current: initial,
  };
}

export const useInView = () => true;
export const useMotionValue = (initial: unknown) => motionValue(initial);
export const useSpring = () => motionValue(0);
export const useTransform = () => motionValue(0);
export const useMotionTemplate = () => "";
export const useScroll = () => ({
  scrollY: motionValue(0),
  scrollYProgress: motionValue(0),
});
export const useReducedMotion = () => false;
