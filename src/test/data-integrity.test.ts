import { describe, expect, it } from "vitest";
import { defaultProjectOrder, projects, projectCategoryLabels } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { sections } from "@/data/navigation";
import { accentPresets } from "@/data/theme";
import { achievements, education, experience } from "@/data/experience";
import { readableForeground } from "@/lib/color";

describe("project data integrity", () => {
  it("has unique ids", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("order array covers every project exactly once", () => {
    expect(new Set(defaultProjectOrder).size).toBe(projects.length);
    expect(new Set(defaultProjectOrder)).toEqual(new Set(projects.map((p) => p.id)));
  });

  it("github links point at jahinhasan's existing repositories", () => {
    for (const p of projects) {
      expect(p.github).toMatch(/^https:\/\/github\.com\/jahinhasan\/[\w.-]+$/);
    }
  });

  it("every project has detail content", () => {
    for (const p of projects) {
      expect(p.details.problem.length).toBeGreaterThan(40);
      expect(p.details.approach.length).toBeGreaterThan(0);
      expect(p.details.features.length).toBeGreaterThan(0);
      expect(p.details.learnings.length).toBeGreaterThan(0);
      expect(p.tech.length).toBeGreaterThan(0);
    }
  });

  it("no live demo is claimed (none is verified)", () => {
    // Flip this expectation only when a real, working demo URL exists.
    for (const p of projects) expect(p.demo).toBeUndefined();
  });

  it("categories are all known to the label map", () => {
    for (const p of projects) {
      expect(projectCategoryLabels[p.category]).toBeTruthy();
    }
  });

  it("the deduplicated mirror repo is not listed as its own card", () => {
    const mirrors = projects.filter((p) => p.mirrorOf === "payment-recovery-digital-twin");
    expect(mirrors).toHaveLength(1);
    expect(mirrors[0]!.id).toBe("aprs");
    expect(projects.some((p) => p.id === "payment-recovery-digital-twin")).toBe(false);
  });

  it("features exactly the four flagship projects", () => {
    const featured = projects.filter((p) => p.featured).map((p) => p.id);
    expect(featured).toEqual(["rover-ui", "shopsync", "focus-app", "rpg-the-student-life"]);
  });
});

describe("skills data integrity", () => {
  it("every skill cites at least one real project as evidence", () => {
    const ids = new Set(projects.map((p) => p.id));
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.evidence.length, `${group.id}/${skill.name}`).toBeGreaterThan(0);
        for (const e of skill.evidence) {
          expect(ids.has(e), `${skill.name} cites unknown project ${e}`).toBe(true);
        }
      }
    }
  });

  it("skill names are unique across groups", () => {
    const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name));
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("navigation and theme data", () => {
  it("covers the ten required sections exactly once", () => {
    expect(sections.map((s) => s.id)).toEqual([
      "hero",
      "about",
      "projects",
      "skills",
      "services",
      "experience",
      "education",
      "achievements",
      "archive",
      "contact",
    ]);
  });

  it("ships six accent presets with valid hex", () => {
    expect(accentPresets).toHaveLength(6);
    for (const preset of accentPresets) {
      expect(preset.hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("every preset keeps a readable foreground", () => {
    for (const preset of accentPresets) {
      expect(readableForeground(preset.hex)).toMatch(/^#(ffffff|101014)$/);
    }
  });
});

describe("experience data", () => {
  it("claims no employment — project and activity entries only", () => {
    for (const e of experience) {
      expect(["project", "activity"]).toContain(e.kind);
    }
  });

  it("includes the verified UIU achievement", () => {
    expect(
      achievements.some(
        (a) => a.title.includes("Line Follower") && a.org.includes("UIU CSE Fest 2025"),
      ),
    ).toBe(true);
  });

  it("education lists BAUST without invented dates", () => {
    expect(education[0]!.institution).toContain("BAUST");
    expect(education[0]!.period).not.toMatch(/\d{4}/); // no fabricated years
  });
});
