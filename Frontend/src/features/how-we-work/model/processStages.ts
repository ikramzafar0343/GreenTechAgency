export type ProcessAppearance = "accent" | "dark";

export type ProcessStage = {
  id: string;
  number: string;
  title: string;
  bullets: readonly [string, string, string];
  outcome: string;
  appearance: ProcessAppearance;
};

export const HOW_WE_WORK_INTRO = {
  eyebrow: "HOW WE WORK",
  heading: "A Clear Process. From Idea to Impact.",
  introduction:
    "We turn business goals into practical digital solutions through discovery, strategy, design, development, and testing. Every stage has clear deliverables, shared feedback, and an agreed next step.",
  ctaLabel: "Discuss Your Project",
  ctaHref: "/contact",
} as const;

export const PROCESS_STAGES: readonly ProcessStage[] = [
  {
    id: "discovery",
    number: "01",
    title: "Discovery",
    bullets: ["Goals & audience", "Current challenges", "Scope & priorities"],
    outcome: "Outcome: A shared project brief",
    appearance: "accent",
  },
  {
    id: "strategy",
    number: "02",
    title: "Strategy",
    bullets: ["Research & insights", "Roadmap & milestones", "Success measures"],
    outcome: "Outcome: An agreed action plan",
    appearance: "dark",
  },
  {
    id: "design",
    number: "03",
    title: "Design",
    bullets: ["User journeys", "Visual direction", "Experience design"],
    outcome: "Outcome: A reviewed creative direction",
    appearance: "accent",
  },
  {
    id: "development",
    number: "04",
    title: "Development",
    bullets: ["Build & integrations", "Content & tracking", "Functional reviews"],
    outcome: "Outcome: A working solution for review",
    appearance: "dark",
  },
  {
    id: "testing",
    number: "05",
    title: "Test & Refine",
    bullets: [
      "Device & usability checks",
      "Performance reviews",
      "Feedback & refinements",
    ],
    outcome: "Outcome: A launch-ready solution",
    appearance: "accent",
  },
  {
    id: "launch",
    number: "06",
    title: "Launch & Improve",
    bullets: [
      "Release & handover",
      "Results monitoring",
      "Agreed improvements",
    ],
    outcome: "Outcome: A measured next-step plan",
    appearance: "dark",
  },
] as const;

export const PROCESS_CONNECTOR_ORDER = [
  "discovery",
  "strategy",
  "design",
  "development",
  "testing",
  "launch",
] as const;
