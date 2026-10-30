import type { SectionId } from "@/types";

export interface SectionMeta {
  id: SectionId;
  /** Short label used in the navbar and customization panel. */
  label: string;
  /** Numbered kicker shown above each section heading. */
  index: string;
  /** Whether the section appears in the minimal desktop navbar. */
  inNavbar: boolean;
}

/**
 * Canonical section metadata. Order here is the default page order.
 * The desktop nav stays minimal (About / Projects / Skills / Contact);
 * every section remains reachable via scroll and the mobile menu.
 */
export const sections: SectionMeta[] = [
  { id: "hero", label: "Home", index: "00", inNavbar: false },
  { id: "about", label: "About", index: "01", inNavbar: true },
  { id: "projects", label: "Projects", index: "02", inNavbar: true },
  { id: "skills", label: "Skills", index: "03", inNavbar: true },
  { id: "services", label: "Services", index: "04", inNavbar: false },
  { id: "experience", label: "Experience", index: "05", inNavbar: false },
  { id: "education", label: "Education", index: "06", inNavbar: false },
  { id: "achievements", label: "Achievements", index: "07", inNavbar: false },
  { id: "archive", label: "Archive", index: "08", inNavbar: false },
  { id: "contact", label: "Contact", index: "09", inNavbar: true },
];

export const defaultSectionOrder: SectionId[] = sections.map((s) => s.id);

export function getSectionMeta(id: SectionId): SectionMeta {
  const meta = sections.find((s) => s.id === id);
  if (!meta) throw new Error(`Unknown section: ${id}`);
  return meta;
}
