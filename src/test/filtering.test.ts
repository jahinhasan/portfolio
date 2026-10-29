import { describe, expect, it } from "vitest";
import { filterProjects, presentCategories } from "@/features/projects/filtering";
import { isProjectFeatured } from "@/features/projects/useProjects";
import { projects } from "@/data/projects";

describe("filterProjects", () => {
  it("returns everything for no filters", () => {
    expect(filterProjects(projects, "all", "")).toHaveLength(projects.length);
  });

  it("filters by category", () => {
    const web = filterProjects(projects, "web", "");
    expect(web.length).toBeGreaterThan(0);
    expect(web.every((p) => p.category === "web")).toBe(true);
  });

  it("searches project names case-insensitively", () => {
    const result = filterProjects(projects, "all", "shopsync");
    expect(result.map((p) => p.id)).toContain("shopsync");
  });

  it("searches technology tags", () => {
    const result = filterProjects(projects, "all", "fastapi");
    expect(result.map((p) => p.id)).toContain("aprs");
  });

  it("searches taglines", () => {
    const result = filterProjects(projects, "all", "marketplace");
    expect(result.length).toBeGreaterThan(0);
  });

  it("ignores whitespace-only queries", () => {
    expect(filterProjects(projects, "all", "   ")).toHaveLength(projects.length);
  });

  it("returns empty for unmatched queries", () => {
    expect(filterProjects(projects, "all", "blockchain-ai-crypto")).toEqual([]);
  });

  it("combines category and query filters", () => {
    const result = filterProjects(projects, "automation", "pdf");
    expect(result.map((p) => p.id)).toContain("pdf-merger-tool");
    const wrongCategory = filterProjects(projects, "web", "pdf");
    expect(wrongCategory.map((p) => p.id)).not.toContain("pdf-merger-tool");
  });

  it("preserves input order", () => {
    const input = [...projects].reverse();
    expect(filterProjects(input, "all", "").map((p) => p.id)).toEqual(input.map((p) => p.id));
  });
});

describe("presentCategories", () => {
  it("lists each category once, in first-seen order", () => {
    const categories = presentCategories(projects);
    expect(new Set(categories).size).toBe(categories.length);
    expect(categories).toContain("web");
    expect(categories).toContain("robotics");
  });
});

describe("isProjectFeatured", () => {
  it("defaults to the data-file flag", () => {
    const featured = projects.find((p) => p.id === "shopsync");
    const unfeatured = projects.find((p) => p.id === "pdf-merger-tool");
    expect(isProjectFeatured(featured!, {})).toBe(true);
    expect(isProjectFeatured(unfeatured!, {})).toBe(false);
  });

  it("override wins over the data-file flag, both directions", () => {
    const shopsync = projects.find((p) => p.id === "shopsync")!;
    const pdf = projects.find((p) => p.id === "pdf-merger-tool")!;
    expect(isProjectFeatured(shopsync, { shopsync: false })).toBe(false);
    expect(isProjectFeatured(pdf, { "pdf-merger-tool": true })).toBe(true);
  });
});
