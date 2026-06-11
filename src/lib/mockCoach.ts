export interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

// Follows the ActiOn rubric: Stage 1 → 2 → 3 → 4, with one follow-up per stage.
const SCRIPT: string[] = [
  // Stage 1 — Managing Affect: main question
  "How did you feel when you received this feedback?",
  // Stage 1 — Managing Affect: follow-up (score 0–1)
  "Thanks for sharing that. What could help you stay engaged with this feedback despite that reaction?",
  // Stage 2 — Appreciating Feedback: main question
  "What do you think your instructor is trying to help you improve with this feedback?",
  // Stage 2 — Appreciating Feedback: follow-up (score 0–1)
  "Can you explain that feedback in your own words, without copying the original wording?",
  // Stage 3 — Making Judgements: main question
  "Which feedback point is most important for improving this assignment, and why?",
  // Stage 3 — Making Judgements: follow-up (score 0–1)
  "What resources, knowledge, or support would help you improve in that area?",
  // Stage 4 — Taking Action: main question
  "What specific revision plan will you use to improve your assignment?",
  // Stage 4 — Taking Action: follow-up (score 0–1)
  "How will you monitor your progress and know whether your revision is successful?",
  // Final — Action Summary
  "Here is your Action Summary:\n\n1. Emotional response and coping strategy: noted\n2. Feedback interpretation: recorded\n3. Criteria connection or quality implication: identified\n4. Prioritised feedback point: selected\n5. Resources and support needed: listed\n6. Revision strategy: set\n7. Self-monitoring method: defined\n\nYou have worked through all four stages of the Feedback Literacy Framework. You are well prepared to begin your revision.",
];

export async function getMockCoachReply(
  history: ChatMessage[],
  _feedback: string,
): Promise<string> {
  const delay = 800 + Math.random() * 800;
  await new Promise((resolve) => setTimeout(resolve, delay));
  const userTurns = history.filter((m) => m.role === "user").length;
  const index = Math.min(userTurns - 1, SCRIPT.length - 1);
  return SCRIPT[Math.max(0, index)]!;
}
