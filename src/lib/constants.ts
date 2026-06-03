export const MODULES = [
  { num: 1, path: "/module/1", title: "Learn",    subtitle: "Feedback Literacy" },
  { num: 2, path: "/module/2", title: "Assess",   subtitle: "Self-Assessment" },
  { num: 3, path: "/module/3", title: "Practice", subtitle: "AI Planning", featured: true },
  { num: 4, path: "/module/4", title: "Transfer", subtitle: "Future Challenge" },
] as const;

export const DIMENSIONS = [
  "Managing Affect",
  "Appreciating Feedback",
  "Making Judgments",
  "Taking Action",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];
