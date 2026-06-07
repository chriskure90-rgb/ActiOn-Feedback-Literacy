/* ─────────────────────────────────────────────────────────────────────────
 * Frontend wrapper for the /api/coach serverless function.
 *
 * In development (npm run dev) the mock coach is used so no API key or
 * running Vercel server is needed locally.
 *
 * In production (Vercel) all requests go to /api/coach which calls
 * Anthropic server-side — the API key is never sent to the browser.
 * ───────────────────────────────────────────────────────────────────────── */

import { getMockCoachReply } from "./mockCoach";
import type { ChatMessage } from "./mockCoach";

export type { ChatMessage };

export interface SetupData {
  title: string;
  instructions: string;
  feedback: string;
}

export async function getCoachReply(
  history: ChatMessage[],
  setup: SetupData,
): Promise<string> {
  /* Local dev: use the offline mock so no API key is needed */
  if (import.meta.env.DEV) {
    return getMockCoachReply(history, setup.feedback);
  }

  /* Production: proxy through the Vercel serverless function */
  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history,
      feedback: setup.feedback,
      instructions: setup.instructions,
      title: setup.title,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Coach API error ${response.status}`);
  }

  const { reply } = (await response.json()) as { reply?: string };
  if (!reply) throw new Error("No reply received from AI coach");
  return reply;
}
