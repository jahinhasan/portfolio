import type { SectionId } from "@/types";

export interface SectionMeta {
  id: SectionId;
  /** Short label used in the navbar and customization panel. */
  label: string;
  /** Numbered kicker shown above each section heading. */
  index: string;
  /** Whether the section renders as a full-width section on the page. */
  inNavbar: boolean;
}

/** Canonical section metadata. Order here is the default page order. */
export const sections: SectionMeta[] = [
  { id: "hero", label: "Home", index: "00", inNavbar: true },
  { id: "about", label: "About", index: "01", inNavbar: true },
  { id: "skills", label: "Skills", index: "02", inNavbar: true },
  { id: "projects", label: "Projects", index: "03", inNavbar: true },
  { id: "archive", label: "Archive", index: "04", inNavbar: true },
  { id: "experience", label: "Experience", index: "05", inNavbar: true },
  { id: "education", label: "Education", index: "06", inNavbar: true },
  { id: "achievements", label: "Achievements", index: "07", inNavbar: true },
  { id: "contact", label: "Contact", index: "08", inNavbar: true },
];

export const defaultSectionOrder: SectionId[] = sections.map((s) => s.id);

export function getSectionMeta(id: SectionId): SectionMeta {
  const meta = sections.find((s) => s.id === id);
  if (!meta) throw new Error(`Unknown section: ${id}`);
  return meta;
}
