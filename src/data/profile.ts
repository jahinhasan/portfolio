/**
 * Central profile data — edit here, the site updates everywhere.
 *
 * ⚠ Items marked NEEDS CONFIRMATION are safe defaults, not verified facts.
 * See README → "Before you publish" for the full checklist.
 */

export const profile = {
  name: "Jahin Hasan",
  shortName: "Jahin Hasan",
  /** The positioning line, shown in the hero and metadata. */
  role: "Frontend Developer | Web Developer | Automation Enthusiast",
  location: "Bangladesh",
  email: "jahinhasan01@gmail.com",
  phoneDisplay: "+880 1783-839992",
  phoneHref: "tel:+8801783839992",
  github: "https://github.com/jahinhasan",
  /**
   * NEEDS CONFIRMATION: set your real LinkedIn profile URL here.
   * While null, no LinkedIn link is rendered anywhere on the site.
   */
  linkedin: null as string | null,
  /** Served from /public/documents — your official CV. */
  cvPath: "/documents/Md_Jahin_Hasan_CV.pdf",

  /** Hero headline, rendered as an oversized display composition. */
  heroHeadline: "Building digital experiences.",
  /** Exact hero intro copy. */
  heroIntro:
    "I'm Jahin Hasan — a developer focused on responsive web applications, interactive interfaces, and practical software solutions.",
  /** Freelance availability, stated plainly. */
  availability: "Available for freelance projects",

  /** NEEDS CONFIRMATION: canonical site URL used in metadata — update after choosing a domain. */
  siteUrl: "https://jahinhasan.github.io/portfolio/",
} as const;

export const aboutParagraphs: string[] = [
  "I'm a Computer Science and Engineering student at Bangladesh Army University of Science and Technology (BAUST), Rangpur. I got into programming by building things for my own use — course tools, small automations, websites — and that habit stuck: I learn a stack by shipping something real with it.",
  "My experience covers both frontend and backend work. On the frontend I build responsive interfaces with React, TypeScript, and Tailwind CSS; on the backend I've shipped a Laravel + MySQL marketplace with realtime chat and role-based dashboards. I care about the details users actually feel — layout at every viewport, load time, keyboard access, and states when things go wrong.",
  "Automation is the thread running through everything: if a task is repetitive, I'd rather write the tool that does it — desktop utilities in Python, scrapers, file pipelines. I keep my projects honest and runnable: public repositories, documented setup, and tests where they add value.",
];
