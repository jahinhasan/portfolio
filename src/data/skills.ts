import type { SkillGroup } from "@/types";

/**
 * Skill inventory — only technologies with evidence in the CV or in a public
 * repository (see the `evidence` project ids on each entry; hover any skill
 * on the site to see where it was used).
 * No proficiency percentages: usage is the only honest signal.
 */

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Programming Languages",
    skills: [
      { name: "Python", evidence: ["smartroute-lab", "aprs", "snake-agent", "web-scraper-tool", "pdf-merger-tool", "focus-app"] },
      { name: "TypeScript", evidence: ["aprs", "rover-ui"] },
      { name: "JavaScript", evidence: ["shopsync", "hotel-management"] },
      { name: "PHP", evidence: ["shopsync", "hotel-management"] },
      { name: "Dart", evidence: ["rpg-the-student-life", "safemind", "focus-app"] },
      { name: "SQL", evidence: ["shopsync", "aprs", "hotel-management"] },
      { name: "C++ (Arduino)", evidence: ["team-infinity"] },
    ],
  },
  {
    id: "frontend",
    label: "Frontend Development",
    skills: [
      { name: "React", evidence: ["aprs", "rover-ui"] },
      { name: "React Router", evidence: ["rover-ui", "aprs"] },
      { name: "TanStack Query", evidence: ["aprs"] },
      { name: "Three.js / R3F", evidence: ["rover-ui"] },
      { name: "Tailwind CSS", evidence: ["shopsync", "rover-ui", "aprs"] },
      { name: "Alpine.js", evidence: ["shopsync"] },
      { name: "Blade", evidence: ["shopsync"] },
      { name: "Vite", evidence: ["rover-ui", "aprs"] },
    ],
  },
  {
    id: "backend",
    label: "Backend Development",
    skills: [
      { name: "Laravel", evidence: ["shopsync"] },
      { name: "FastAPI", evidence: ["aprs"] },
      { name: "REST API design", evidence: ["aprs", "hotel-management", "shopsync"] },
      { name: "WebSockets (Reverb/Pusher)", evidence: ["shopsync"] },
      { name: "Pest / PHPUnit", evidence: ["shopsync"] },
      { name: "pytest", evidence: ["smartroute-lab"] },
      { name: "Vitest", evidence: ["aprs"] },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    skills: [
      { name: "MySQL", evidence: ["shopsync", "hotel-management"] },
      { name: "PostgreSQL", evidence: ["aprs"] },
      { name: "SQLite", evidence: ["aprs", "smartroute-lab"] },
      { name: "SQLAlchemy + Alembic", evidence: ["aprs"] },
      { name: "Cloud Firestore", evidence: ["rpg-the-student-life", "safemind"] },
    ],
  },
  {
    id: "automation",
    label: "Automation & Developer Tools",
    skills: [
      { name: "Git & GitHub", evidence: ["shopsync", "smartroute-lab", "aprs", "snake-agent", "web-scraper-tool"] },
      { name: "GitHub Actions (CI)", evidence: ["smartroute-lab", "focus-app"] },
      { name: "Docker & Compose", evidence: ["aprs", "shopsync"] },
      { name: "pandas", evidence: ["web-scraper-tool", "smartroute-lab"] },
      { name: "BeautifulSoup4", evidence: ["web-scraper-tool"] },
      { name: "pypdf", evidence: ["pdf-merger-tool"] },
      { name: "Tkinter / CustomTkinter", evidence: ["pdf-merger-tool", "web-scraper-tool", "focus-app"] },
      { name: "Nginx / Caddy", evidence: ["aprs"] },
    ],
  },
  {
    id: "systems",
    label: "Systems & Networking",
    skills: [
      { name: "Routing algorithms (Dijkstra)", evidence: ["smartroute-lab"] },
      { name: "Network simulation", evidence: ["smartroute-lab"] },
      { name: "Linux", evidence: ["smartroute-lab", "aprs", "team-infinity"] },
      { name: "Serial protocols (UART)", evidence: ["team-infinity"] },
      { name: "Embedded sensors", evidence: ["team-infinity"] },
    ],
  },
  {
    id: "aiml",
    label: "AI/ML & Robotics",
    skills: [
      { name: "PyTorch (deep RL)", evidence: ["snake-agent"] },
      { name: "scikit-learn", evidence: ["smartroute-lab", "aprs"] },
      { name: "XGBoost", evidence: ["aprs"] },
      { name: "YOLOv5 + OpenCV", evidence: ["team-infinity"] },
      { name: "Gemini API", evidence: ["focus-app"] },
      { name: "Model evaluation (MAE/RMSE, leakage control)", evidence: ["smartroute-lab"] },
    ],
  },
];
