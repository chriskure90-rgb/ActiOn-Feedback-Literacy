/* ─────────────────────────────────────────────────────────────────────────
 * Demo data for presentation purposes only.
 * Keys in DEMO_MODULE2_ANSWERS match the `${sIdx}-${qIdx}` format used by
 * Module 2's `key()` helper and are chosen to produce:
 *   Managing Affect      2 / 3
 *   Appreciating Feedback 3 / 3
 *   Making Judgements    1 / 3  ← Growth Focus (lowest)
 *   Taking Action        2 / 3
 * ───────────────────────────────────────────────────────────────────────── */

export const DEMO_MODULE2_ANSWERS: Record<string, number> = {
  "0-0": 1, "0-1": 2, "0-2": 1, // Managing Affect      → 2/3
  "1-0": 2, "1-1": 1, "1-2": 0, // Appreciating Feedback → 3/3
  "2-0": 0, "2-1": 0, "2-2": 0, // Making Judgements     → 1/3
  "3-0": 1, "3-1": 0, "3-2": 0, // Taking Action         → 2/3
};

export const DEMO_MODULE3_SETUP = {
  title: "Essay: Climate Policy in the EU",
  instructions:
    "Write a 1500-word essay evaluating the effectiveness of climate policy in the European Union. " +
    "Your essay should include a clear argument, relevant academic sources, and critical discussion.",
  feedback:
    "Your topic is interesting and you use some relevant evidence. However, the main argument is not " +
    "clear enough. Several paragraphs describe policy examples but do not explain how they support your " +
    "claim. You should improve the structure of your argument and use stronger evidence to support your main points.",
};

export const DEMO_MODULE4_RESPONSES: [string, string, string, string] = [
  "When I receive difficult feedback, I will pause before reacting and identify whether I feel frustrated, embarrassed, or discouraged.",
  "I will ask what skill or area my instructor is trying to help me improve.",
  "I will compare feedback comments with the assignment criteria and choose the points that will most improve the quality of my work.",
  "I will choose one or two priority feedback points, create a concrete action plan, and set a realistic deadline.",
];
