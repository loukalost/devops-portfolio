import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins multiple class names", () => {
    expect(cn("px-2", "font-bold")).toBe("px-2 font-bold");
  });

  it("merges conflicting Tailwind classes (last one wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignores falsy conditional values", () => {
    expect(cn("a", false && "b", null, undefined, "c")).toBe("a c");
  });

  it("accepts arrays of classes", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });
});
