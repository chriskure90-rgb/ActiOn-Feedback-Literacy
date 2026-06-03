export interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

const SCRIPT: string[] = [
  "It sounds like you felt a bit thrown by the feedback. That's completely normal — our emotional reaction is the first thing we need to notice. Once you've named it, it loses some of its power. What would it feel like to read that feedback again as if it came from a helpful mentor rather than a judge?",
  "That reframe is a great first step. Now let's look at what the teacher is actually offering you. Every critique is implicitly a map: it tells you where the gap is between your work and the standard. Looking at the feedback in front of you, what does it tell you the teacher *values* in a strong essay?",
  "Exactly — structure, completeness, and evidence are all things the teacher cares about. The feedback isn't random; it reflects clear criteria. Does reading it this way change how you feel about it?",
  "Good. Now let's shift into making judgments about your own work. If you had to be your own strict-but-fair reviewer, which of the three points in the feedback do you think is the *most* important to address first, and why?",
  "Strong instinct. Prioritising the structural issue makes sense — readers can't evaluate evidence they can't follow. When you re-read your introduction now, do you see the gap the teacher described? What's missing or misaligned?",
  "You're identifying the issue precisely. That's the hardest part. Now let's turn insight into action. Can you write down one concrete thing you will do this week — something specific enough that you could tick it off a to-do list?",
  "Perfect. Specific, time-bound, and tied directly to the feedback. That's a real action plan. As a final step: is there anything you'd want to clarify with your teacher before the revision, or do you feel you have enough to move forward?",
  "You've worked through all four dimensions today — managing your initial reaction, appreciating what the feedback offers, judging your own work honestly, and forming a concrete action step. That's the full feedback literacy cycle. Well done. Save your action point somewhere visible and revisit it after you've made the revisions.",
];

const CLOSERS: string[] = [
  "It sounds like you've got a solid grip on this. Is there any other part of the feedback you'd like to explore?",
  "You're asking exactly the right questions. Keep that critical-but-constructive mindset when you sit down to revise.",
  "Remember: the goal of revision isn't perfection — it's demonstrable improvement on the points raised. How are you feeling about getting started?",
];

export async function getMockCoachReply(
  history: ChatMessage[],
  _feedback: string,
): Promise<string> {
  const delay = 800 + Math.random() * 800;
  await new Promise((resolve) => setTimeout(resolve, delay));
  const aiTurns = history.filter((m) => m.role === "ai").length;
  const scriptIndex = Math.max(0, aiTurns - 2);
  if (scriptIndex < SCRIPT.length) return SCRIPT[scriptIndex]!;
  return CLOSERS[(scriptIndex - SCRIPT.length) % CLOSERS.length]!;
}
