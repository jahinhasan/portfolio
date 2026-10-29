/** All main page sections, in canonical (default) order. */
export type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "archive"
  | "experience"
  | "education"
  | "achievements"
  | "contact";

export type ThemeMode = "dark" | "light";

export type ProjectCategoryId =
  | "web"
  | "backend"
  | "automation"
  | "ai-ml"
  | "networking"
  | "mobile"
  | "robotics";

export type ProjectStatus = "active" | "complete" | "coursework";

export interface Project {
  /** Stable slug — used for DOM ids, detail dialogs, and preference storage. */
  id: string;
  name: string;
  /** One-sentence explanation shown on cards. */
  tagline: string;
  category: ProjectCategoryId;
  /** Actual technologies used, verified against the repository. */
  tech: string[];
  github: string;
  /** Only set when a working public demo exists. */
  demo?: string;
  featured: boolean;
  year: string;
  status: ProjectStatus;
  /**
   * Human role label, e.g. "Personal project" or "Group project — backend".
   * Keep honest: verify team/solo before changing.
   */
  role: string;
  /** Longer-form detail-view content. */
  details: ProjectDetails;
  /** Path under /public for a real screenshot. When omitted, generated art is shown. */
  screenshot?: string;
  /** When this repo mirrors another repository of the same project. */
  mirrorOf?: string;
}

export interface ProjectDetails {
  problem: string;
  approach: string[];
  features: string[];
  learnings: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  /** Skills verified by the CV or public repositories. */
  skills: Skill[];
}

export interface Skill {
  name: string;
  /** Project ids where this is actually used — shown as evidence on hover/focus. */
  evidence: string[];
}

export interface ExperienceEntry {
  id: string;
  period: string;
  title: string;
  org: string;
  kind: "project" | "activity";
  points: string[];
  /** Link to the repository or competition evidence, if public. */
  link?: { label: string; href: string };
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  notes: string[];
}

export interface Achievement {
  id: string;
  title: string;
  org: string;
  year: string;
  description: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Lucide icon name resolved in the contact section. */
  icon: "github" | "linkedin" | "mail" | "phone";
}

/** Persisted visitor preferences (localStorage). */
export interface Preferences {
  /** Schema version — bump to invalidate stale stored shapes. */
  version: 1;
  theme: ThemeMode;
  /** Hex color, e.g. "#7c5cff". Empty string means the preset default. */
  accent: string;
  sectionOrder: SectionId[];
  projectOrder: string[];
  projectLayout: "grid" | "list";
  /** Projects the visitor promoted/demoted locally (id -> featured). */
  featuredOverrides: Record<string, boolean>;
}
