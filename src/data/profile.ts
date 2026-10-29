/**
 * Central profile data — edit here, the site updates everywhere.
 *
 * ⚠ Items marked NEEDS CONFIRMATION are safe defaults, not verified facts.
 * See README → "Content you should confirm" for the full checklist.
 */

export const profile = {
  name: "Md. Jahin Hasan",
  shortName: "Jahin Hasan",
  role: "Software Developer — Web Development & Automation",
  location: "Rangpur, Bangladesh",
  email: "jahinhasan01@gmail.com",
  phoneDisplay: "+880 1783-839992",
  phoneHref: "tel:+8801783839992",
  github: "https://github.com/jahinhasan",
  /**
   * NEEDS CONFIRMATION: set your real LinkedIn profile URL here.
   * While null, no LinkedIn link is rendered anywhere on the site.
   */
  linkedin: null as string | null,
  /** Served from /public/documents — replace the placeholder with your official CV. */
  cvPath: "/documents/Md_Jahin_Hasan_CV.pdf",

  heroHeadline: "Building useful software. Automating repetitive work. Exploring intelligent systems.",
  heroIntro:
    "I'm a CSE undergraduate at BAUST, Rangpur. I build web applications end to end, write tools that take repetitive work off my own hands, and study how systems behave below the user interface.",

  /** Openness stated as a goal, not an availability status. */
  goal: "Looking for internship opportunities where I can contribute to real projects and grow as an engineer.",

  /** NEEDS CONFIRMATION: canonical site URL used in metadata — update after choosing a domain. */
  siteUrl: "https://jahinhasan.github.io/portfolio/",
} as const;

export const aboutParagraphs: string[] = [
  "I study Computer Science and Engineering at Bangladesh Army University of Science and Technology (BAUST) in Rangpur. My work sits at the intersection of web development and automation: I like shipping applications that do something concrete, then writing the small tools that make building and maintaining them less repetitive.",
  "That range shows up in my projects. ShopSync is a Laravel marketplace with realtime chat, order lifecycles, and payment verification. SmartRoute Lab is a network routing simulator where I compared hand-written Dijkstra against ML-assisted route selection — and documented, honestly, where the ML lost to the analytic baseline. APRS is an event-driven backend that reconstructs failed payment flows and gates automated recovery behind fresh-evidence checks. Around those sit practical tools: a threaded web scraper, a PDF manipulation tool, and a small reinforcement-learning agent that learned to play Snake.",
  "I care about systems beyond the UI: how data flows, what happens when a request fails halfway, and whether a claim can be reproduced from the code that made it. Most of my repositories are runnable from a single command, with tests or benchmarks where they add value.",
];
