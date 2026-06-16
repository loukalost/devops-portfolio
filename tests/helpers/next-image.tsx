/** Mock of `next/image`: renders a plain <img>, stripping Next-only props. */
import * as React from "react";

// Props a native <img> does not understand.
const NON_DOM_PROPS = new Set([
  "fill",
  "priority",
  "placeholder",
  "blurDataURL",
  "loader",
  "unoptimized",
  "quality",
]);

type NextImageProps = {
  src: string | { src: string };
  alt?: string;
  [key: string]: unknown;
};

export default function NextImage({ src, alt, ...rest }: NextImageProps) {
  const imgProps: Record<string, unknown> = {};
  for (const key in rest) {
    if (!NON_DOM_PROPS.has(key)) imgProps[key] = rest[key];
  }
  const resolved = typeof src === "string" ? src : (src?.src ?? "");
  return React.createElement("img", {
    src: resolved,
    alt: alt ?? "",
    ...imgProps,
  });
}
