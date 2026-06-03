import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Circle,
  ClipboardList,
  FileText,
  Info,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";
import { cn } from "@/lib/utils";
import type { Dimension } from "@/lib/constants";
import { getMockCoachReply } from "@/lib/mockCoach";

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

interface SetupData {
  title: string;
  instructions: string;
  feedback: string;
}

/* ─── Static data ────────────────────────────────────────────── */

const PROGRESS: ProgressItem[] = [
  { dim: "Managing Affect",       status: "done"   },
  { dim: "Appreciating Feedback", status: "done"   },
  { dim: "Making Judgments",      status: "active" },
  { dim: "Taking Action",         status: "todo"   },
];

export const COACH_SYSTEM_PROMPT = `You are an expert AI feedback literacy coach for university students. Your role is to help students work through teacher feedback using the four feedback literacy dimensions:
1. Managing Affect — help them recognise and regulate emotional reactions
2. Appreciating Feedback — help them see feedback as a resource, not an attack
3. Making Judgments — help them evaluate their own work critically against criteria
4. Taking Action — guide them to form concrete, actionable revision steps

Keep responses concise (2–4 sentences). Ask one focused follow-up question per turn. Be warm, encouraging, and academically rigorous. Never give the student the answer outright — use Socratic questioning to help them discover it themselves.`;

/* ─── Module 3 ───────────────────────────────────────────────── */

export default function Module3() {
  const [step, setStep] = useState<"setup" | "coach">("setup");
  const [setup, setSetup] = useState<SetupData>({
    title: "",
    instructions: "",
    feedback: "",
  });
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  function handleBeginCoaching() {
    const greeting: ChatMessage = {
      role: "ai",
      text: `Hi! I can see you're working on "${setup.title}". I'm here to help you turn your teacher's feedback into a concrete improvement plan. Let's start with how the feedback made you feel when you first read it.`,
    };
    setChat([greeting]);
    setStep("coach");
  }

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
      const aiText = await getMockCoachReply(nextChat, setup.feedback);
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
  }, [message, chat, isLoading, setup.feedback]);

  /* ── Step 1: Setup ─────────────────────────────────────────── */

  if (step === "setup") {
    return (
      <ModuleLayout current={3}>
        <ModuleHeader
          eyebrow="Module 3 · Practice · Step 1 of 2"
          title="Set up your assignment & feedback"
          description="Tell us about your assignment and paste your teacher's feedback. The AI coach uses this to personalise every question to your specific situation."
        />

        <SetupStep
          setup={setup}
          onChange={(patch) => setSetup((prev) => ({ ...prev, ...patch }))}
          onBegin={handleBeginCoaching}
        />

        <NavFooter
          prev={{ path: "/module/2", label: "Back to Assess" }}
        />
      </ModuleLayout>
    );
  }

  /* ── Step 2: Coaching ──────────────────────────────────────── */

  return (
    <ModuleLayout current={3}>
      <ModuleHeader
        eyebrow="Module 3 · Practice · Step 2 of 2"
        title="Build your improvement plan with an AI coach"
        description="The coach guides you through each feedback literacy dimension and helps you draft a concrete next step."
      />

      <div className="grid gap-5 lg:grid-cols-12">
        {/* ── Left sidebar ── */}
        <div className="lg:col-span-4 space-y-4">
          <AssignmentCard title={setup.title} />

          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <label
              htmlFor="feedback-input"
              className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3"
            >
              Teacher's feedback
            </label>
            <textarea
              id="feedback-input"
              value={setup.feedback}
              onChange={(e) => setSetup((prev) => ({ ...prev, feedback: e.target.value }))}
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
                      void send();
                    }
                  }}
                />
                <button
                  onClick={() => void send()}
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

/* ─── SetupStep ──────────────────────────────────────────────── */

interface SetupStepProps {
  setup: SetupData;
  onChange: (patch: Partial<SetupData>) => void;
  onBegin: () => void;
}

function SetupStep({ setup, onChange, onBegin }: SetupStepProps) {
  const canBegin = setup.title.trim().length > 0 && setup.feedback.trim().length > 0;

  return (
    <div className="max-w-2xl space-y-6">

      {/* Info callout */}
      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-primary/80 leading-relaxed">
          Your entries stay on this page only — nothing is sent to a server. This lets the AI coach
          tailor its questions to your real assignment and feedback rather than using a generic example.
        </p>
      </div>

      {/* Field 1: Assignment Title */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal shrink-0" />
          <label
            htmlFor="assignment-title"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Assignment Title <span className="text-accent normal-case font-semibold tracking-normal">· required</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter the name of the piece of work you received feedback on. The coach will refer to it
          by name throughout your session.
        </p>
        <input
          id="assignment-title"
          type="text"
          value={setup.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Essay: Climate Policy in the EU"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition"
        />
      </div>

      {/* Field 2: Assignment Instructions */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-teal shrink-0" />
          <label
            htmlFor="assignment-instructions"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Assignment Instructions / Task Description <span className="text-muted-foreground/60 normal-case font-normal tracking-normal text-[10px]">· optional</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste the original task brief or marking criteria if you have it. This helps the coach
          understand what the assignment was asking for, so it can help you judge your work more precisely.
        </p>
        <textarea
          id="assignment-instructions"
          value={setup.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
          rows={6}
          placeholder="Paste the assignment brief, task instructions, or marking criteria here…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-y text-foreground placeholder:text-muted-foreground transition"
        />
      </div>

      {/* Field 3: Teacher Feedback */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-teal shrink-0" />
          <label
            htmlFor="teacher-feedback"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Teacher Feedback <span className="text-accent normal-case font-semibold tracking-normal">· required</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Copy and paste exactly what your teacher wrote. Include all comments — even ones that feel
          harsh or confusing. The coach is designed to help you work through difficult feedback, not
          just the positive parts.
        </p>
        <textarea
          id="teacher-feedback"
          value={setup.feedback}
          onChange={(e) => onChange({ feedback: e.target.value })}
          rows={8}
          placeholder="Paste your teacher's written feedback here…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-y text-foreground placeholder:text-muted-foreground transition"
        />
      </div>

      {/* Begin button */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {!canBegin && "Complete the required fields to continue."}
        </p>
        <button
          onClick={onBegin}
          disabled={!canBegin}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3 text-sm font-bold text-white shadow-card hover:bg-accent/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Begin Coaching →
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function AssignmentCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
        <FileText className="w-3.5 h-3.5" /> Assignment
      </div>
      <h3 className="font-bold text-primary text-sm mb-1 leading-snug">{title}</h3>
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
