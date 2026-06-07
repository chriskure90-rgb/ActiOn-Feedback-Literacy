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

const COACH_PROMPT =
  `You are an expert AI feedback literacy coach for university students. ` +
  `Your role is to help students work through teacher feedback using the four ` +
  `feedback literacy dimensions:\n` +
  `1. Managing Affect — help them recognise and regulate emotional reactions\n` +
  `2. Appreciating Feedback — help them see feedback as a resource, not an attack\n` +
  `3. Making Judgments — help them evaluate their own work critically against criteria\n` +
  `4. Taking Action — guide them to form concrete, actionable revision steps\n\n` +
  `Keep responses concise (2–4 sentences). Ask one focused follow-up question per ` +
  `turn. Be warm, encouraging, and academically rigorous. Never give the student ` +
  `the answer outright — use Socratic questioning to help them discover it themselves.`;

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
