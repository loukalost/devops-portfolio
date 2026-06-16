import { describe, it, expect } from "vitest";
import { slugify, formatDate, readingMinutes } from "@/lib/format";

describe("slugify", () => {
  it("replaces spaces with dashes and lowercases", () => {
    expect(slugify("Mon Super Projet")).toBe("mon-super-projet");
  });

  it("strips accents (diacritics)", () => {
    expect(slugify("Crème Brûlée à l'Été")).toBe("creme-brulee-a-l-ete");
  });

  it("removes punctuation and special characters", () => {
    expect(slugify("Hello, World! (v2)")).toBe("hello-world-v2");
  });

  it("collapses repeated separators into a single dash", () => {
    expect(slugify("a   b___c")).toBe("a-b-c");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("  !Bonjour!  ")).toBe("bonjour");
  });

  it("handles the documentation example", () => {
    expect(slugify("Mon Super Projet !")).toBe("mon-super-projet");
  });

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("leaves an already-valid slug untouched", () => {
    expect(slugify("deja-un-slug")).toBe("deja-un-slug");
  });
});

describe("formatDate", () => {
  it("formats a Date object in French", () => {
    const result = formatDate(new Date(2026, 5, 15));
    expect(result).toMatch(/15/);
    expect(result).toMatch(/juin/);
    expect(result).toMatch(/2026/);
  });

  it("accepts an ISO string", () => {
    const result = formatDate("2026-06-15T12:00:00Z");
    expect(result).toMatch(/juin/);
    expect(result).toMatch(/2026/);
  });

  it("returns an empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("returns an empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });
});

describe("readingMinutes", () => {
  it("returns at least 1 minute for a short text", () => {
    expect(readingMinutes("three little words")).toBe(1);
  });

  it("returns 1 minute for ~200 words", () => {
    const text = Array.from({ length: 200 }, () => "word").join(" ");
    expect(readingMinutes(text)).toBe(1);
  });

  it("returns 2 minutes for ~400 words", () => {
    const text = Array.from({ length: 400 }, () => "word").join(" ");
    expect(readingMinutes(text)).toBe(2);
  });

  it("rounds (300 words -> 2 minutes)", () => {
    const text = Array.from({ length: 300 }, () => "word").join(" ");
    expect(readingMinutes(text)).toBe(2);
  });

  it("returns 1 minute for an empty string", () => {
    expect(readingMinutes("")).toBe(1);
  });

  it("does not count repeated whitespace as words", () => {
    expect(readingMinutes("   a    b   ")).toBe(1);
  });
});
