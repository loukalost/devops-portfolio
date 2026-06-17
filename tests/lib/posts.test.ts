import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: { findMany: vi.fn(), findFirst: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { getPosts, getLatestPosts, getPostBySlug } from "@/lib/posts";

const findMany = vi.mocked(prisma.post.findMany);
const findFirst = vi.mocked(prisma.post.findFirst);

function makePost(id: string) {
  return { id, slug: `post-${id}`, published: true } as never;
}

// The lib functions log caught errors via console.error. We silence (and
// assert on) it so the expected error-path output doesn't pollute the run.
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.clearAllMocks();
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
});

describe("getPosts", () => {
  it("returns the posts provided by Prisma", async () => {
    const rows = [makePost("a"), makePost("b")];
    findMany.mockResolvedValue(rows);
    await expect(getPosts()).resolves.toEqual(rows);
  });

  it("returns an empty array when Prisma throws", async () => {
    findMany.mockRejectedValue(new Error("DB unavailable"));
    await expect(getPosts()).resolves.toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe("getLatestPosts", () => {
  it("limits to 3 posts by default", async () => {
    findMany.mockResolvedValue([
      makePost("a"),
      makePost("b"),
      makePost("c"),
      makePost("d"),
    ]);
    const result = await getLatestPosts();
    expect(result).toHaveLength(3);
  });

  it("respects the limit argument", async () => {
    findMany.mockResolvedValue([makePost("a"), makePost("b"), makePost("c")]);
    const result = await getLatestPosts(1);
    expect(result.map((p) => p.id)).toEqual(["a"]);
  });
});

describe("getPostBySlug", () => {
  it("returns null when Prisma throws", async () => {
    findFirst.mockRejectedValue(new Error("DB unavailable"));
    await expect(getPostBySlug("post-a")).resolves.toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });
});
