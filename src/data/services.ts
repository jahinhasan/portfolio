/**
 * "What I Can Help With" — services offered as a freelance developer.
 * Deliberately modest: each line maps to work already visible in the
 * project catalog. Nothing here claims agency-scale delivery.
 */

export interface Service {
  id: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "responsive-sites",
    title: "Responsive Websites",
    description:
      "Websites that hold up from a 320px phone to a 1920px desktop — semantic HTML, modern CSS, and layouts tested at real breakpoints.",
  },
  {
    id: "frontend-dev",
    title: "Frontend Development",
    description:
      "Interactive interfaces built with React, TypeScript, and Tailwind CSS — componentized, accessible, and typed end to end.",
  },
  {
    id: "landing-pages",
    title: "Landing Pages",
    description:
      "Fast, single-purpose pages for a product, event, or portfolio — optimized markup, meta tags, and a build you can deploy anywhere.",
  },
  {
    id: "ui-fixes",
    title: "UI Improvements & Bug Fixing",
    description:
      "Fixing broken layouts, inconsistent styling, and interaction bugs in an existing frontend — or reworking a UI that has outgrown its first version.",
  },
  {
    id: "api-integration",
    title: "API Integration",
    description:
      "Wiring a frontend to REST APIs — authentication, error and loading states, and typed contracts instead of hopeful fetch calls.",
  },
  {
    id: "maintenance",
    title: "Website Maintenance",
    description:
      "Ongoing care for an existing site: dependency updates, small feature additions, content changes, and keeping the build green.",
  },
];
