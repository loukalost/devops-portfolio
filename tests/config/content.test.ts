import { describe, it, expect } from "vitest";
import {
  navItems,
  skillGroups,
  allSkills,
  timeline,
} from "@/config/content";

describe("navItems", () => {
  it("has at least one entry", () => {
    expect(navItems.length).toBeGreaterThan(0);
  });

  it("every entry has a non-empty label and href", () => {
    for (const item of navItems) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.length).toBeGreaterThan(0);
    }
  });
});

describe("skillGroups", () => {
  it("every group has a title and at least one skill", () => {
    for (const group of skillGroups) {
      expect(group.title.length).toBeGreaterThan(0);
      expect(group.skills.length).toBeGreaterThan(0);
    }
  });
});

describe("allSkills", () => {
  it("contains no duplicates", () => {
    expect(allSkills.length).toBe(new Set(allSkills).size);
  });

  it("contains a known skill", () => {
    expect(allSkills).toContain("TypeScript");
  });

  it("aggregates every group's skills (deduplicated)", () => {
    const expected = new Set(skillGroups.flatMap((g) => g.skills));
    expect(allSkills.length).toBe(expected.size);
    for (const skill of expected) {
      expect(allSkills).toContain(skill);
    }
  });
});

describe("timeline", () => {
  it("only uses the 'education' or 'work' types", () => {
    for (const item of timeline) {
      expect(["education", "work"]).toContain(item.type);
    }
  });

  it("every entry has a period, title and organization", () => {
    for (const item of timeline) {
      expect(item.period.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.organization.length).toBeGreaterThan(0);
    }
  });
});
