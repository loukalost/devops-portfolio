// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Heavy/browser-only dependencies are replaced by lightweight mocks so we can
// focus on what the page actually renders.
vi.mock("motion/react", () => import("../helpers/motion-react"));
vi.mock("next/image", () => import("../helpers/next-image"));
vi.mock("next/link", () => import("../helpers/next-link"));
vi.mock("next/navigation", () => import("../helpers/next-navigation"));

// Data layer is mocked: no database access in unit tests.
vi.mock("@/lib/projects", () => ({
  getFeaturedProjects: vi.fn(),
  getProjects: vi.fn(),
}));
vi.mock("@/lib/posts", () => ({
  getLatestPosts: vi.fn(),
  getPosts: vi.fn(),
}));

import Home from "@/app/page";
import { getFeaturedProjects } from "@/lib/projects";
import { getLatestPosts } from "@/lib/posts";
import { makeProject, makePost } from "../helpers/fixtures";

const featured = vi.mocked(getFeaturedProjects);
const latest = vi.mocked(getLatestPosts);

// The page is an async Server Component: await it to get the element tree.
async function renderHome() {
  render(await Home());
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Home page", () => {
  it("renders the hero heading", async () => {
    featured.mockResolvedValue([makeProject()]);
    latest.mockResolvedValue([makePost()]);

    await renderHome();

    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent(/Bonjour, je suis/);
  });

  it("renders every main section heading", async () => {
    featured.mockResolvedValue([makeProject()]);
    latest.mockResolvedValue([makePost()]);

    await renderHome();

    expect(screen.getByText("Quelques mots sur moi")).toBeInTheDocument();
    expect(screen.getByText("Technologies & outils")).toBeInTheDocument();
    expect(screen.getByText("Réalisations sélectionnées")).toBeInTheDocument();
    expect(screen.getByText("Formation & expériences")).toBeInTheDocument();
    expect(screen.getByText("Travaillons ensemble")).toBeInTheDocument();
  });

  it("fetches featured projects and the 3 latest posts", async () => {
    featured.mockResolvedValue([]);
    latest.mockResolvedValue([]);

    await renderHome();

    expect(featured).toHaveBeenCalledTimes(1);
    expect(latest).toHaveBeenCalledWith(3);
  });

  it("renders the featured projects passed from the data layer", async () => {
    featured.mockResolvedValue([
      makeProject({ id: "a", title: "Projet Alpha" }),
      makeProject({ id: "b", title: "Projet Beta" }),
    ]);
    latest.mockResolvedValue([]);

    await renderHome();

    expect(screen.getByText("Projet Alpha")).toBeInTheDocument();
    expect(screen.getByText("Projet Beta")).toBeInTheDocument();
  });

  it("shows a link to all projects when projects exist", async () => {
    featured.mockResolvedValue([makeProject()]);
    latest.mockResolvedValue([]);

    await renderHome();

    const link = screen.getByRole("link", { name: /Tous les projets/ });
    expect(link).toHaveAttribute("href", "/projets");
  });

  it("shows the empty state when there are no projects", async () => {
    featured.mockResolvedValue([]);
    latest.mockResolvedValue([]);

    await renderHome();

    expect(screen.getByText(/Aucun projet pour le moment/)).toBeInTheDocument();
  });

  it("renders the latest posts section when posts exist", async () => {
    featured.mockResolvedValue([]);
    latest.mockResolvedValue([makePost({ title: "Mon article DevOps" })]);

    await renderHome();

    expect(screen.getByText("Derniers articles")).toBeInTheDocument();
    expect(screen.getByText("Mon article DevOps")).toBeInTheDocument();
  });

  it("hides the latest posts section when there are no posts", async () => {
    featured.mockResolvedValue([]);
    latest.mockResolvedValue([]);

    await renderHome();

    expect(screen.queryByText("Derniers articles")).not.toBeInTheDocument();
  });
});
