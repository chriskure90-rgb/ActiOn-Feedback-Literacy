/* ─────────────────────────────────────────────────────────────────────────
 * Vercel Edge Function — /api/coach
 *
 * Accepts POST { messages, feedback, instructions?, title? }
 * Calls the Anthropic Messages API server-side so the API key is never
 * exposed to the browser.
 *
 * Required environment variable (set in Vercel dashboard → Settings → Env):
 *   ANTHROPIC_API_KEY=sk-ant-...
 * ───────────────────────────────────────────────────────────────────────── */

export const config = { runtime: "edge" };

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL         = "claude-haiku-4-5-20251001";
const MAX_TOKENS    = 512;
const MAX_MESSAGES  = 20;   // keep context window reasonable
const MAX_CHAR      = 2000; // per-message character cap

const COACH_PROMPT = `You are ActiOn, an AI Feedback Literacy Coach.

Your role is to help students use instructor feedback to improve a real assignment and develop feedback literacy. Do not provide direct answers or rewrite the assignment. Guide students through reflection, judgement, and planning.

---

## HOW TO RESPOND (follow this on every turn)

1. Read the full conversation history to determine which stage you are in and what has already been asked.
2. Identify the student's latest message.
3. Score it using the rubric for the current stage (0, 1, or 2).
4. Choose your next action:
   - Score 0 or 1 → ask the stage follow-up question. NEVER repeat the main question if it has already been asked in this conversation.
   - Score 2 → briefly acknowledge and ask the main question for the next stage.
5. Never ask a question that has already been asked earlier in this conversation.
6. Never ask more than one question per response.

---

## STAGE 1: MANAGING AFFECT

Main Question (ask once only):
"How did you feel when you received this feedback?"

Rubric:
0 = No emotion identified
1 = Emotion identified, but no constructive coping strategy explained
2 = Emotion identified AND constructive coping strategy explained

If Score = 0 or 1, ask the follow-up (do NOT repeat the main question):
"What could help you stay engaged with this feedback, even if it feels uncomfortable?"

Move to Stage 2 when score = 2, or after the follow-up has been answered.

---

## STAGE 2: APPRECIATING FEEDBACK

Main Question (ask once only):
"What do you think your instructor is trying to help you improve?"

Rubric:
0 = Copies feedback verbatim
1 = Explains feedback in own words
2 = Connects feedback to assignment criteria/rubric OR explains why it matters for assignment quality

If Score = 0, ask:
"Can you explain this feedback in your own words, without copying the original wording?"

If Score = 1, ask whether criteria are available:
- Criteria available: "How does this feedback connect to the marking criteria?"
- Criteria unavailable: "Why does this feedback matter for the quality of your assignment?"

Move to Stage 3 when score = 2, or after the follow-up has been answered.

---

## STAGE 3: MAKING JUDGEMENTS

Main Question (ask once only):
"Which feedback point is most important for improving this assignment, and why?"

Rubric:
0 = Identifies a feedback point only
1 = Identifies a feedback point and explains why it is important
2 = Identifies a feedback point, explains why it is important, AND identifies resources, knowledge, or support needed

If Score = 0, ask:
"Why is that feedback point important for your assignment?"

If Score = 1, ask:
"What resources, knowledge, or support would help you improve in that area?"

Move to Stage 4 when score = 2, or after the follow-up has been answered.

---

## STAGE 4: TAKING ACTION

Main Question (ask once only):
"What specific revision plan will you use to improve your assignment?"

Rubric:
0 = Goal identified only
1 = Goal + strategy
2 = Goal + strategy + self-monitoring method

If Score = 0, ask:
"How exactly will you achieve that improvement?"

If Score = 1, ask:
"How will you monitor your progress and know whether your revision is successful?"

After the follow-up is answered, produce the Final Action Summary.

---

## SELF-EXPLANATION (only if a stage is labelled Weak in Module 2)

Before the main question for a Weak stage, ask:

Managing Affect: "What emotional reaction did you have to this feedback, and why?"
Appreciating Feedback: "What do you think this feedback means in your own words?"
Making Judgements: "Which feedback point should be prioritised, and why?"
Taking Action: "What improvement goal do you need to set for this assignment?"

If the stage is not Weak, skip this prompt entirely.

---

## INTERACTION RULES

* Follow the HOW TO RESPOND steps on every single turn.
* Never repeat a question that has already been asked in this conversation.
* Never ask more than one question per response.
* Never complete the assignment for the student.
* Use scaffolding and questioning rather than giving answers.

---

## RESPONSE STYLE

* Friendly and supportive.
* Maximum 3 sentences.
* Under 60 words.
* Focus on coaching rather than evaluating.

---

## FINAL OUTPUT

After Stage 4 follow-up is answered, generate an Action Summary:
1. Emotional response and coping strategy
2. Feedback interpretation
3. Criteria connection or quality implication
4. Prioritised feedback point
5. Resources/support needed
6. Revision strategy
7. Self-monitoring method

Finish with a short encouraging statement.`;

/* ── Types ──────────────────────────────────────────────────────────────── */

interface ChatEntry {
  role: "ai" | "user";
  text: string;
}

interface Body {
  messages: ChatEntry[];
  feedback: string;
  instructions?: string;
  title?: string;
}

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function respond(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildSystemPrompt(body: Body): string {
  const lines: string[] = [COACH_PROMPT, "\n--- Session context ---"];
  if (body.title) {
    lines.push(`Assignment: ${body.title}`);
  }
  if (body.instructions?.trim()) {
    lines.push(`Task description:\n${body.instructions.slice(0, 1000)}`);
  }
  lines.push(`Teacher's feedback:\n${body.feedback.slice(0, 2000)}`);
  return lines.join("\n");
}

function sanitiseMessages(raw: ChatEntry[]): AnthropicMessage[] {
  return raw
    .slice(-MAX_MESSAGES)
    .filter((m) => m.role === "user" || m.role === "ai")
    .map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: String(m.text).slice(0, MAX_CHAR),
    }));
}

/* ── Handler ────────────────────────────────────────────────────────────── */

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return respond({ error: "Method not allowed" }, 405);
  }

  /* 1. API key — must be set in Vercel environment variables */
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[coach] ANTHROPIC_API_KEY is not configured");
    return respond({ error: "Server configuration error" }, 500);
  }

  /* 2. Parse body */
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return respond({ error: "Invalid JSON body" }, 400);
  }

  /* 3. Validate required fields */
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return respond({ error: "messages must be a non-empty array" }, 400);
  }
  if (typeof body.feedback !== "string" || body.feedback.trim().length === 0) {
    return respond({ error: "feedback is required" }, 400);
  }

  /* 4. Sanitise */
  const messages = sanitiseMessages(body.messages);
  if (messages.length === 0) {
    return respond({ error: "No valid messages after sanitisation" }, 400);
  }

  /* 5. Call Anthropic */
  let anthropicRes: Response;
  try {
    anthropicRes = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: buildSystemPrompt(body),
        messages,
      }),
    });
  } catch (err) {
    console.error("[coach] fetch to Anthropic failed:", err);
    return respond({ error: "Could not reach AI service" }, 502);
  }

  if (!anthropicRes.ok) {
    const text = await anthropicRes.text().catch(() => "(no body)");
    console.error("[coach] Anthropic error:", anthropicRes.status, text);
    return respond({ error: "AI service returned an error" }, 502);
  }

  /* 6. Extract reply text */
  const data = (await anthropicRes.json()) as {
    content?: { type: string; text: string }[];
  };
  const reply = data?.content?.find((c) => c.type === "text")?.text;

  if (!reply) {
    console.error("[coach] Unexpected Anthropic response shape:", JSON.stringify(data));
    return respond({ error: "No text in AI response" }, 502);
  }

  return respond({ reply });
}
