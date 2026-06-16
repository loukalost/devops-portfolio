import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Prisma: no real database access is needed to test the business
// logic (ordering, fallback to non-featured projects, etc.).
vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: { findMany: vi.fn(), findFirst: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
} from "@/lib/projects";

const findMany = vi.mocked(prisma.project.findMany);
const findFirst = vi.mocked(prisma.project.findFirst);

// Build a minimal project; only fields used by the tests are set.
function makeProject(overrides: Record<string, unknown> = {}) {
  return {
    id: "1",
    slug: "project",
    featured: false,
    ...overrides,
  } as never;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getProjects", () => {
  it("returns the projects provided by Prisma", async () => {
    const rows = [makeProject({ id: "a" }), makeProject({ id: "b" })];
    findMany.mockResolvedValue(rows);
    await expect(getProjects()).resolves.toEqual(rows);
  });

  it("returns an empty array when Prisma throws", async () => {
    findMany.mockRejectedValue(new Error("DB unavailable"));
    await expect(getProjects()).resolves.toEqual([]);
  });
});

describe("getFeaturedProjects", () => {
  it("returns only the featured projects when some exist", async () => {
    findMany.mockResolvedValue([
      makeProject({ id: "a", featured: true }),
      makeProject({ id: "b", featured: false }),
      makeProject({ id: "c", featured: true }),
    ]);
    const result = await getFeaturedProjects();
    expect(result.map((p) => p.id)).toEqual(["a", "c"]);
  });

  it("falls back to all projects when none are featured", async () => {
    findMany.mockResolvedValue([
      makeProject({ id: "a", featured: false }),
      makeProject({ id: "b", featured: false }),
    ]);
    const result = await getFeaturedProjects();
    expect(result.map((p) => p.id)).toEqual(["a", "b"]);
  });

  it("respects the limit argument", async () => {
    findMany.mockResolvedValue([
      makeProject({ id: "a", featured: true }),
      makeProject({ id: "b", featured: true }),
      makeProject({ id: "c", featured: true }),
    ]);
    const result = await getFeaturedProjects(2);
    expect(result).toHaveLength(2);
  });
});

describe("getProjectBySlug", () => {
  it("returns null when Prisma throws", async () => {
    findFirst.mockRejectedValue(new Error("DB unavailable"));
    await expect(getProjectBySlug("project")).resolves.toBeNull();
  });
});
