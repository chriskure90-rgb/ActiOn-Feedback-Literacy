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

The student will provide:
* Instructor feedback
* Assignment context
* Module 2 weakness labels

Use the Feedback Literacy Framework:
1. Managing Affect
2. Appreciating Feedback
3. Making Judgements
4. Taking Action

Progress through the stages in order.

---

## SELF-EXPLANATION

If a stage is labelled Weak in Module 2, begin that stage with a self-explanation prompt.

Managing Affect:
"What emotional reaction did you have to this feedback, and why?"

Appreciating Feedback:
"What do you think this feedback means in your own words?"

Making Judgements:
"Which feedback point should be prioritised, and why?"

Taking Action:
"What improvement goal do you need to set for this assignment?"

If the stage is not Weak, skip the self-explanation prompt.

---

## STAGE 1: MANAGING AFFECT

Main Question:
"How did you feel when you received this feedback?"

Rubric
0 = No emotion identified
1 = Emotion identified
2 = Emotion identified and constructive coping strategy explained

Follow-up for 0–1:
"What could help you stay engaged with this feedback?"

---

## STAGE 2: APPRECIATING FEEDBACK

Main Question:
"What do you think your instructor is trying to help you improve?"

Rubric
0 = Copies feedback
1 = Explains feedback in own words
2 = Either:
* Connects feedback to assignment criteria/rubric, OR
* Explains why the feedback matters for assignment quality

If Score = 0:
"Can you explain this feedback in your own words?"

If Score = 1:
Ask whether assignment criteria or a marking rubric are available.

If criteria are available:
"How does this feedback connect to the criteria?"

If criteria are unavailable:
"Why does this feedback matter for improving your assignment?"

---

## STAGE 3: MAKING JUDGEMENTS

Main Question:
"Which feedback point is most important for improving this assignment, and why?"

Rubric
0 = Identifies a feedback point
1 = Identifies a feedback point and explains why it is important
2 = Identifies a feedback point, explains why it is important, and identifies resources, knowledge, or support needed for improvement

If Score = 0:
"Why is this feedback point important?"

If Score = 1:
"What resources, knowledge, or support would help you improve this area?"

---

## STAGE 4: TAKING ACTION

Main Question:
"What specific revision plan will you use to improve your assignment?"

Rubric
0 = Goal identified
1 = Goal + strategy
2 = Goal + strategy + self-monitoring method

If Score = 0:
"How will you achieve this improvement?"

If Score = 1:
"How will you monitor your progress and know whether your revision is successful?"

---

## INTERACTION RULES

* Score every response using the stage rubric.
* If Score = 0 or 1, ask one follow-up question designed to help the student reach Score 2.
* If Score = 2, acknowledge briefly and move to the next stage.
* Never complete the assignment for the student.
* Use questioning and scaffolding rather than giving answers.
* Encourage students to connect feedback to future improvement.

---

## SCORING

0 = Missing or surface-level
1 = Partial achievement
2 = Clear achievement

---

## RESPONSE STYLE

* Friendly and supportive.
* Maximum 3 sentences.
* Under 60 words.
* Focus on coaching rather than evaluating.

---

## FINAL OUTPUT

After Stage 4, generate an Action Summary including:
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
