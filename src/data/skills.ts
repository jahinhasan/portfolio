import type { SkillGroup } from "@/types";

/**
 * Skill inventory — only technologies with evidence in a public repository
 * (see the `evidence` project ids on each entry; hover any skill on the site
 * to see where it was used). No proficiency percentages: usage is the only
 * honest signal.
 */

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "HTML5", evidence: ["shopsync", "hotel-management", "rover-ui"] },
      { name: "CSS3", evidence: ["shopsync", "hotel-management", "rover-ui"] },
      { name: "JavaScript", evidence: ["shopsync", "hotel-management", "rover-ui"] },
      { name: "TypeScript", evidence: ["rover-ui", "aprs"] },
      { name: "React", evidence: ["rover-ui", "aprs"] },
      { name: "Vite", evidence: ["rover-ui", "aprs"] },
      { name: "Tailwind CSS", evidence: ["shopsync", "rover-ui"] },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "PHP", evidence: ["shopsync", "hotel-management"] },
      { name: "Laravel", evidence: ["shopsync"] },
      { name: "Python", evidence: ["focus-app", "web-scraper-tool", "pdf-merger-tool", "snake-agent", "smartroute-lab", "aprs"] },
    ],
  },
  {
    id: "databases",
    label: "Database",
    skills: [{ name: "MySQL", evidence: ["shopsync", "hotel-management"] }],
  },
  {
    id: "tools",
    label: "Tools",
    skills: [
      { name: "Git & GitHub", evidence: ["shopsync", "rover-ui", "focus-app", "rpg-the-student-life", "smartroute-lab"] },
      { name: "GitHub Actions (CI)", evidence: ["smartroute-lab", "focus-app"] },
    ],
  },
];
