export interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

// The greeting in Module3.tsx already asks the Stage 1 main question
// ("How did you feel when you received this feedback?"), so SCRIPT[0]
// is the Stage 1 follow-up (score 0–1). Each index maps to one user turn.
const SCRIPT: string[] = [
  // user turn 1 — student answered Stage 1 main question → follow-up (score 0–1)
  "Thanks for sharing that. What could help you stay engaged with this feedback, even if it feels uncomfortable?",
  // user turn 2 — student answered Stage 1 follow-up → Stage 2 main question
  "Good. Now, what do you think your instructor is trying to help you improve with this feedback?",
  // user turn 3 — student answered Stage 2 main question → follow-up (score 0–1)
  "Can you explain that in your own words, without copying the original wording?",
  // user turn 4 — student answered Stage 2 follow-up → Stage 3 main question
  "Which feedback point is most important for improving this assignment, and why?",
  // user turn 5 — student answered Stage 3 main question → follow-up (score 0–1)
  "What resources, knowledge, or support would help you improve in that area?",
  // user turn 6 — student answered Stage 3 follow-up → Stage 4 main question
  "What specific revision plan will you use to improve your assignment?",
  // user turn 7 — student answered Stage 4 main question → follow-up (score 0–1)
  "How will you monitor your progress and know whether your revision is successful?",
  // user turn 8+ — Action Summary
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
