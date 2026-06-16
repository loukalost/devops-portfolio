// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("motion/react", () => import("../helpers/motion-react"));
vi.mock("next/image", () => import("../helpers/next-image"));
vi.mock("next/link", () => import("../helpers/next-link"));
vi.mock("next/navigation", () => import("../helpers/next-navigation"));

vi.mock("@/lib/projects", () => ({
  getProjects: vi.fn(),
}));

import ProjectsPage from "@/app/projets/page";
import { getProjects } from "@/lib/projects";
import { makeProject } from "../helpers/fixtures";

const allProjects = vi.mocked(getProjects);

async function renderList() {
  render(await ProjectsPage());
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Projects list page", () => {
  it("renders the page heading", async () => {
    allProjects.mockResolvedValue([]);

    await renderList();

    expect(screen.getByText("Tous les projets")).toBeInTheDocument();
  });

  it("renders every project returned by the data layer", async () => {
    allProjects.mockResolvedValue([
      makeProject({ id: "a", slug: "alpha", title: "Projet Alpha" }),
      makeProject({ id: "b", slug: "beta", title: "Projet Beta" }),
    ]);

    await renderList();

    expect(screen.getByText("Projet Alpha")).toBeInTheDocument();
    expect(screen.getByText("Projet Beta")).toBeInTheDocument();
  });

  it("links each card to its detail page", async () => {
    allProjects.mockResolvedValue([
      makeProject({ slug: "alpha", title: "Projet Alpha" }),
    ]);

    await renderList();

    expect(
      screen.getByRole("link", { name: "Projet Alpha" }),
    ).toHaveAttribute("href", "/projets/alpha");
  });

  it("shows the empty state when there are no projects", async () => {
    allProjects.mockResolvedValue([]);

    await renderList();

    expect(screen.getByText(/Aucun projet pour le moment/)).toBeInTheDocument();
  });
});
