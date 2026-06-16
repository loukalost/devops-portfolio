/** Mock of `next/link`: renders a plain <a>, stripping Next-only props. */
import * as React from "react";

// Props a native <a> does not understand.
const NON_DOM_PROPS = new Set([
  "prefetch",
  "replace",
  "scroll",
  "shallow",
  "passHref",
  "legacyBehavior",
]);

type NextLinkProps = {
  href: string | { pathname?: string };
  children?: React.ReactNode;
  [key: string]: unknown;
};

export default function NextLink({ href, children, ...rest }: NextLinkProps) {
  const anchorProps: Record<string, unknown> = {};
  for (const key in rest) {
    if (!NON_DOM_PROPS.has(key)) anchorProps[key] = rest[key];
  }
  const url = typeof href === "string" ? href : (href?.pathname ?? "#");
  return React.createElement("a", { href: url, ...anchorProps }, children);
}
