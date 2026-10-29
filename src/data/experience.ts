import type { Achievement, EducationEntry, ExperienceEntry } from "@/types";

/**
 * Experience, education, and achievements.
 *
 * There is no employment history to claim yet — this timeline presents
 * project work and team activity honestly. Dates marked NEEDS CONFIRMATION
 * should be checked against the latest CV before publishing.
 */

export const experience: ExperienceEntry[] = [
  {
    id: "independent-projects",
    period: "2025 — present",
    title: "Independent Projects",
    org: "Self-directed",
    kind: "project",
    points: [
      "Designed and shipped a Laravel multi-vendor marketplace (orders, realtime chat, loyalty, moderation) with Pest feature tests.",
      "Built an event-driven payment-recovery backend (FastAPI + PostgreSQL + XGBoost) with an append-only audit log and a React operations frontend.",
      "Developed an honest-ML network routing simulator with CI, seeded benchmarks, and published limitations.",
      "Trained a deep-RL Snake agent (100k episodes, PyTorch) and built practical automation tools: a threaded web scraper and a local PDF workbench.",
    ],
    link: { label: "github.com/jahinhasan", href: "https://github.com/jahinhasan?tab=repositories" },
  },
  {
    id: "academic-group-projects",
    period: "2025 — present",
    title: "Academic Group Projects",
    org: "BAUST, CSE Department",
    kind: "project",
    points: [
      "Contributed backend and frontend work to team submissions, including a realtime Flutter/Firebase learning platform (Clean Architecture + Riverpod).",
      "Implemented Firestore-backed features with security rules, demo-mode fallbacks, and widget tests in a team mental-health support app.",
      "Worked in version-controlled team workflows: task division, code review, and integration of independently built modules.",
    ],
    // NEEDS CONFIRMATION: per-project role details against the latest CV.
  },
  {
    id: "robotics",
    period: "2025",
    title: "Robotics — Team Infinity",
    org: "National robotics competition team",
    kind: "activity",
    points: [
      "Built the vision stack for a competition rover: YOLOv5 detector with a threaded OpenCV capture pipeline streaming commands to an Arduino over serial.",
      "Implemented ultrasonic obstacle-avoidance firmware in C++ that overrides vision commands as a safety layer.",
      "Earned 2nd Runner-Up in the Line Follower Robot Competition at UIU CSE Fest 2025.",
    ],
    link: { label: "Team Infinity repository", href: "https://github.com/jahinhasan/Team_Infinity" },
  },
];

export const education: EducationEntry[] = [
  {
    id: "baust-cse",
    degree: "B.Sc. in Computer Science and Engineering",
    institution: "Bangladesh Army University of Science and Technology (BAUST)",
    location: "Rangpur, Bangladesh",
    // NEEDS CONFIRMATION: enrollment year and expected graduation — kept
    // undated rather than guessed.
    period: "Undergraduate, in progress",
    notes: [
      "Coursework and self-study across web systems, databases, networking, and software engineering.",
      "Applied the coursework directly in team projects and independent builds — see the sections above.",
    ],
  },
];

export const achievements: Achievement[] = [
  {
    id: "uiu-line-follower",
    title: "2nd Runner-Up — Line Follower Robot Competition",
    org: "UIU CSE Fest 2025",
    year: "2025",
    description:
      "Placed third overall with a line-follower robot built and tuned by our team against university-level competition.",
  },
];
