import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Circle,
  FileText,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";
import { cn } from "../lib/utils";
import type { Dimension } from "../lib/constants";
import { getMockCoachReply } from "../lib/mockCoach";

// ─── To switch to the live Anthropic API, replace this import: ────────────────
// import { getLiveCoachReply as getMockCoachReply } from "@/lib/coachApi";
// ─────────────────────────────────────────────────────────────────────────────

/* ─── Types ──────────────────────────────────────────────────── */

type ChatRole = "ai" | "user";

interface ChatMessage {
  role: ChatRole;
  text: string;
}

type ProgressStatus = "done" | "active" | "todo";

interface ProgressItem {
  dim: Dimension;
  status: ProgressStatus;
}

/* ─── Static data ────────────────────────────────────────────── */

const PROGRESS: ProgressItem[] = [
  { dim: "Managing Affect",       status: "done"   },
  { dim: "Appreciating Feedback", status: "done"   },
  { dim: "Making Judgments",      status: "active" },
  { dim: "Taking Action",         status: "todo"   },
];

const SEED_MESSAGES: ChatMessage[] = [
  {
    role: "ai",
    text: "Hi! I'm here to help you turn your teacher's feedback into a concrete improvement plan. Let's start with how the feedback made you feel.",
  },
  {
    role: "user",
    text: "Honestly, a bit discouraged. The teacher said my argument was unclear.",
  },
  {
    role: "ai",
    text: "That's a very human reaction. Naming the feeling already helps. Let's reframe — what specifically did the teacher highlight as unclear?",
  },
];

export const COACH_SYSTEM_PROMPT = `You are an expert AI feedback literacy coach for university students. Your role is to help students work through teacher feedback using the four feedback literacy dimensions:
1. Managing Affect — help them recognise and regulate emotional reactions
2. Appreciating Feedback — help them see feedback as a resource, not an attack
3. Making Judgments — help them evaluate their own work critically against criteria
4. Taking Action — guide them to form concrete, actionable revision steps

Keep responses concise (2–4 sentences). Ask one focused follow-up question per turn. Be warm, encouraging, and academically rigorous. Never give the student the answer outright — use Socratic questioning to help them discover it themselves.`;

/* ─── Module 3 ───────────────────────────────────────────────── */

export default function Module3() {
  const [feedback, setFeedback] = useState(
    "Your argument is interesting but the structure makes it hard to follow. The introduction promises three points, but only two are developed. Evidence is solid where present, however several claims in section 2 lack sources.",
  );
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  const send = useCallback(async () => {
    const text = message.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", text };
    const nextChat = [...chat, userMsg];
    setChat(nextChat);
    setMessage("");
    setIsLoading(true);

    try {
      // ── Mock: replace `getMockCoachReply` import to go live ──────────────
      const aiText = await getMockCoachReply(nextChat, feedback);
      // ─────────────────────────────────────────────────────────────────────
      setChat((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [message, chat, isLoading, feedback]);

  return (
    <ModuleLayout current={3}>
      <ModuleHeader
        eyebrow="Module 3 · Practice · Core"
        title="Build your improvement plan with an AI coach"
        description="Paste your teacher's feedback below. The coach guides you through each dimension and helps you draft a concrete next step."
      />

      <div className="grid gap-5 lg:grid-cols-12">
        {/* ── Left sidebar ── */}
        <div className="lg:col-span-4 space-y-4">
          <AssignmentCard />

          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <label
              htmlFor="feedback-input"
              className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3"
            >
              Teacher's feedback
            </label>
            <textarea
              id="feedback-input"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full min-h-[130px] rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none text-foreground placeholder:text-muted-foreground transition"
              placeholder="Paste your teacher's feedback here…"
            />
          </div>

          <ProgressTracker progress={PROGRESS} />
        </div>

        {/* ── Main chat panel ── */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border-2 border-primary bg-white overflow-hidden shadow-card-lg flex flex-col" style={{ minHeight: 540 }}>

            {/* Chat header */}
            <div className="bg-primary px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white leading-tight">AI Feedback Coach</div>
                  <div className="text-[11px] text-white/65 mt-0.5">Currently: Making Judgments</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <span className="text-[11px] text-white/70 animate-pulse font-medium">
                    Thinking…
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                    Demo mode
                  </span>
                )}
              </div>
            </div>

            {/* Dimension progress strip */}
            <div className="bg-primary-soft border-b border-border px-5 py-2 flex items-center gap-3">
              {PROGRESS.map((p) => (
                <div key={p.dim} className="flex items-center gap-1.5">
                  {p.status === "done" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0" />
                  ) : p.status === "active" ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-border shrink-0" />
                  )}
                  <span className={cn(
                    "text-[10px] font-semibold hidden sm:block",
                    p.status === "done" ? "text-teal" : p.status === "active" ? "text-primary" : "text-muted-foreground/60",
                  )}>
                    {p.dim.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-surface/40">
              {chat.map((m, i) => (
                <ChatBubble key={i} message={m} />
              ))}
              {isLoading && (
                <div className="flex gap-3 items-end">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary text-white flex items-center justify-center shadow-card">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-white border border-border shadow-card">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input bar */}
            <div className="border-t border-border bg-white px-4 py-3 shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your response to the coach… (Enter to send)"
                  rows={2}
                  className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button
                  onClick={send}
                  disabled={isLoading || !message.trim()}
                  className="rounded-lg bg-primary text-white p-3 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-card"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 ml-0.5">
                Shift + Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>

      <NavFooter
        prev={{ path: "/module/2", label: "Back to Assess" }}
        next={{ path: "/module/4", label: "Continue to Transfer" }}
      />
    </ModuleLayout>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function AssignmentCard() {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
        <FileText className="w-3.5 h-3.5" /> Assignment
      </div>
      <h3 className="font-bold text-primary text-sm mb-3">Essay: Climate policy in the EU</h3>
      <dl className="space-y-2">
        {[
          { label: "Course",    value: "POL 204" },
          { label: "Grade",     value: "B−" },
          { label: "Submitted", value: "Mar 12" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAi = message.role === "ai";
  return (
    <div className={cn("flex gap-2.5 items-end", !isAi && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-card",
        isAi ? "bg-primary text-white" : "bg-muted text-muted-foreground",
      )}>
        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div className={cn(
        "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isAi
          ? "bg-white border border-border text-foreground rounded-bl-sm shadow-card"
          : "bg-primary text-white rounded-br-sm shadow-card",
      )}>
        {message.text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </div>
  );
}

function ProgressTracker({ progress }: { progress: ProgressItem[] }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-card">
      <h3 className="font-bold text-primary text-sm mb-0.5">Literacy dimensions</h3>
      <p className="text-[11px] text-muted-foreground mb-4">Progress through the coaching session</p>
      <ul className="space-y-3">
        {progress.map((p) => (
          <li key={p.dim} className="flex items-center gap-3">
            {p.status === "done" ? (
              <div className="w-5 h-5 rounded-full bg-teal flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            ) : p.status === "active" ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm font-semibold truncate",
                p.status === "done" ? "text-teal" : p.status === "active" ? "text-primary" : "text-muted-foreground",
              )}>
                {p.dim}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {p.status === "done" ? "Completed" : p.status === "active" ? "In progress" : "Up next"}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
