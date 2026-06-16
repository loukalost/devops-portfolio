/** Minimal Project/Post factories for rendering tests. */
import type { Project } from "@/lib/projects";
import type { Post } from "@/lib/posts";

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "prj-1",
    slug: "projet-alpha",
    title: "Projet Alpha",
    description: "Une application web de démonstration.",
    content: null,
    coverImage: null,
    tags: ["React", "Next.js"],
    githubUrl: null,
    demoUrl: null,
    featured: true,
    order: 0,
    published: true,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  } as Project;
}

export function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: "post-1",
    slug: "mon-premier-article",
    title: "Mon premier article",
    excerpt: "Un court résumé de l'article.",
    content: "Le contenu de l'article en quelques mots.",
    coverImage: null,
    tags: ["devops"],
    published: true,
    publishedAt: new Date("2026-01-02T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-02T00:00:00Z"),
    ...overrides,
  } as Post;
}
