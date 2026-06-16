// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("motion/react", () => import("../helpers/motion-react"));
vi.mock("next/image", () => import("../helpers/next-image"));
vi.mock("next/link", () => import("../helpers/next-link"));
vi.mock("next/navigation", () => import("../helpers/next-navigation"));

vi.mock("@/lib/projects", () => ({
  getProjectBySlug: vi.fn(),
}));

import ProjectPage from "@/app/projets/[slug]/page";
import { getProjectBySlug } from "@/lib/projects";
import { makeProject } from "../helpers/fixtures";

const bySlug = vi.mocked(getProjectBySlug);

// The page receives `params` as a Promise (Next 16 App Router).
async function renderProject(slug = "projet-alpha") {
  render(await ProjectPage({ params: Promise.resolve({ slug }) }));
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Project page", () => {
  it("looks the project up by its slug", async () => {
    bySlug.mockResolvedValue(makeProject());

    await renderProject("projet-alpha");

    expect(bySlug).toHaveBeenCalledWith("projet-alpha");
  });

  it("renders the title and description", async () => {
    bySlug.mockResolvedValue(
      makeProject({ title: "Super Projet", description: "Ma description." }),
    );

    await renderProject();

    expect(
      screen.getByRole("heading", { level: 1, name: "Super Projet" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ma description.")).toBeInTheDocument();
  });

  it("renders the project tags", async () => {
    bySlug.mockResolvedValue(makeProject({ tags: ["Docker", "CI/CD"] }));

    await renderProject();

    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("CI/CD")).toBeInTheDocument();
  });

  it("renders the GitHub and demo links when provided", async () => {
    bySlug.mockResolvedValue(
      makeProject({
        githubUrl: "https://github.com/me/projet",
        demoUrl: "https://demo.example.com",
      }),
    );

    await renderProject();

    expect(
      screen.getByRole("link", { name: /Voir le code/ }),
    ).toHaveAttribute("href", "https://github.com/me/projet");
    expect(
      screen.getByRole("link", { name: /Voir la démo/ }),
    ).toHaveAttribute("href", "https://demo.example.com");
  });

  it("omits the external links when none are provided", async () => {
    bySlug.mockResolvedValue(makeProject({ githubUrl: null, demoUrl: null }));

    await renderProject();

    expect(screen.queryByRole("link", { name: /Voir le code/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Voir la démo/ })).toBeNull();
  });

  it("renders the cover image when present", async () => {
    bySlug.mockResolvedValue(
      makeProject({ title: "Avec image", coverImage: "/cover.png" }),
    );

    await renderProject();

    const img = screen.getByRole("img", { name: "Avec image" });
    expect(img).toHaveAttribute("src", "/cover.png");
  });

  it("shows a fallback when the project has no detailed content", async () => {
    bySlug.mockResolvedValue(makeProject({ content: null }));

    await renderProject();

    expect(
      screen.getByText("Pas de description détaillée pour ce projet."),
    ).toBeInTheDocument();
  });

  it("renders the markdown content when present", async () => {
    bySlug.mockResolvedValue(
      makeProject({ content: "## Architecture\n\nDétails techniques." }),
    );

    await renderProject();

    expect(
      screen.getByRole("heading", { level: 2, name: "Architecture" }),
    ).toBeInTheDocument();
  });

  it("links back to the projects list", async () => {
    bySlug.mockResolvedValue(makeProject());

    await renderProject();

    expect(
      screen.getByRole("link", { name: /Retour aux projets/ }),
    ).toHaveAttribute("href", "/projets");
  });

  it("triggers a 404 when the project does not exist", async () => {
    bySlug.mockResolvedValue(null);

    await expect(
      ProjectPage({ params: Promise.resolve({ slug: "inconnu" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
