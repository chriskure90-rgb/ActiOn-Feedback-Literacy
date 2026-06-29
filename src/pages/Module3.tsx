import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Circle,
  FileText,
  Send,
  Sparkles,
  User,
  Wand2,
} from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";
import { cn } from "../lib/utils";
import { DIMENSIONS } from "../lib/constants";
import type { Dimension } from "../lib/constants";
import { getCoachReply } from "../lib/coachApi";
import type { SetupData } from "../lib/coachApi";
import { DEMO_MODULE3_SETUP } from "../lib/demoData";

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

/* ─── Constants ──────────────────────────────────────────────── */

// Maps the [STAGE_COMPLETE:xxx] tags in AI replies to Dimension values
const STAGE_TAG_MAP: Record<string, Dimension> = {
  managing_affect:       "Managing Affect",
  appreciating_feedback: "Appreciating Feedback",
  making_judgements:     "Making Judgments",
  taking_action:         "Taking Action",
};

// Static opening message — avoids an API round-trip for the greeting
const OPENING_MESSAGE =
  "Hi! I'm your AI Feedback Coach. I'm here to help you turn your instructor's " +
  "feedback into a concrete improvement plan.\n\n" +
  "Let's start with the first stage — Managing Affect.\n\n" +
  "How did you feel when you first received this feedback?";

/* ─── Helpers ────────────────────────────────────────────────── */

function makeInitialProgress(): ProgressItem[] {
  return DIMENSIONS.map((dim, i) => ({
    dim,
    status: (i === 0 ? "active" : "todo") as ProgressStatus,
  }));
}

function parseStageTag(text: string): string | null {
  return text.match(/\[STAGE_COMPLETE:(\w+)\]/)?.[1] ?? null;
}

function stripStageTag(text: string): string {
  return text.replace(/\n?\[STAGE_COMPLETE:\w+\]\s*$/, "").trim();
}

function advanceProgress(
  progress: ProgressItem[],
  completedDim: Dimension,
): ProgressItem[] {
  const idx = progress.findIndex((p) => p.dim === completedDim);
  return progress.map((p, i) => {
    if (i === idx)     return { ...p, status: "done"   as ProgressStatus };
    if (i === idx + 1) return { ...p, status: "active" as ProgressStatus };
    return p;
  });
}

/* ─── Module 3 ───────────────────────────────────────────────── */

export default function Module3() {
  const [step, setStep] = useState<1 | 2>(1);
  const [setup, setSetup] = useState<SetupData>({ title: "", instructions: "", feedback: "" });
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressItem[]>(makeInitialProgress());
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  const currentStage = progress.find((p) => p.status === "active")?.dim ?? null;
  const allComplete  = progress.every((p) => p.status === "done");
  const hasApiKey    = !!(import.meta.env.VITE_MISTRAL_API_KEY as string | undefined);

  function handleLoadDemo() {
    setSetup(DEMO_MODULE3_SETUP);
  }

  function handleStart() {
    if (!setup.feedback.trim()) return;
    // Always reset coaching state so every session begins at Managing Affect
    setProgress(makeInitialProgress());
    setChat([{ role: "ai", text: OPENING_MESSAGE }]);
    setMessage("");
    setStep(2);
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
      const rawReply = await getCoachReply(nextChat, setup);
      const tag = parseStageTag(rawReply);
      const cleanReply = tag ? stripStageTag(rawReply) : rawReply;

      setChat((prev) => [...prev, { role: "ai", text: cleanReply }]);

      if (tag) {
        const completedDim = STAGE_TAG_MAP[tag];
        if (completedDim) {
          setProgress((prev) => advanceProgress(prev, completedDim));
        }
      }
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [message, chat, isLoading, setup]);

  /* ── Step 1 — Setup ─────────────────────────────────────────── */

  if (step === 1) {
    return (
      <ModuleLayout current={3}>
        <div className="max-w-4xl mx-auto">
          <ModuleHeader
            eyebrow="Module 3 · Practice · Step 1 of 2"
            title="Set up your coaching session"
            description="Enter your assignment title and paste your instructor's feedback. The AI coach will guide you through each dimension of feedback literacy."
          />
          <SetupScreen
            setup={setup}
            onSetupChange={setSetup}
            onLoadDemo={handleLoadDemo}
            onStart={handleStart}
          />
          <NavFooter prev={{ path: "/module/2", label: "Back to Assess" }} />
        </div>
      </ModuleLayout>
    );
  }

  /* ── Step 2 — Coach ─────────────────────────────────────────── */

  return (
    <ModuleLayout current={3}>
      <div className="max-w-4xl mx-auto">
        <ModuleHeader
          eyebrow="Module 3 · Practice · Step 2 of 2"
          title="Build your improvement plan with an AI coach"
          description="The coach will guide you through each dimension of feedback literacy. Respond thoughtfully to each question."
        />

        <div className="grid gap-5 lg:grid-cols-12">
          {/* ── Left sidebar ── */}
          <div className="lg:col-span-4 space-y-4">
            <AssignmentCard setup={setup} />
            <ProgressTracker progress={progress} />
          </div>

          {/* ── Main chat panel ── */}
          <div className="lg:col-span-8">
            <div
              className="rounded-xl border-2 border-primary bg-white overflow-hidden shadow-card-lg flex flex-col"
              style={{ minHeight: 540 }}
            >
              {/* Chat header */}
              <div className="bg-primary px-5 py-3.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-white leading-tight">
                      AI Feedback Coach
                    </div>
                    <div className="text-xs text-white/65 mt-0.5">
                      {allComplete
                        ? "All stages complete"
                        : currentStage
                          ? `Currently: ${currentStage}`
                          : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <span className="text-xs text-white/70 animate-pulse font-medium">
                      Thinking…
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                      {hasApiKey ? "Live" : "Demo mode"}
                    </span>
                  )}
                </div>
              </div>

              {/* Dimension progress strip */}
              <div className="bg-primary-soft border-b border-border px-5 py-2 flex items-center gap-3">
                {progress.map((p) => (
                  <div key={p.dim} className="flex items-center gap-1.5">
                    {p.status === "done" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0" />
                    ) : p.status === "active" ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-border shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-semibold hidden sm:block",
                        p.status === "done"
                          ? "text-teal"
                          : p.status === "active"
                            ? "text-primary"
                            : "text-muted-foreground/60",
                      )}
                    >
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
                    className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition placeholder:text-muted-foreground"
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
                <p className="text-[11px] text-muted-foreground mt-1.5 ml-0.5">
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
      </div>
    </ModuleLayout>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

interface SetupScreenProps {
  setup: SetupData;
  onSetupChange: (s: SetupData) => void;
  onLoadDemo: () => void;
  onStart: () => void;
}

function SetupScreen({ setup, onSetupChange, onLoadDemo, onStart }: SetupScreenProps) {
  const canStart = setup.feedback.trim().length > 0;

  return (
    <div className="max-w-2xl space-y-5">
      {/* Assignment title */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-card">
        <label
          htmlFor="setup-title"
          className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2"
        >
          Assignment Title
        </label>
        <input
          id="setup-title"
          type="text"
          value={setup.title}
          onChange={(e) => onSetupChange({ ...setup, title: e.target.value })}
          placeholder="e.g. Essay: Climate Policy in the EU"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition placeholder:text-muted-foreground"
        />
      </div>

      {/* Task description (optional) */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-card">
        <label
          htmlFor="setup-instructions"
          className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2"
        >
          Task Description{" "}
          <span className="normal-case font-normal tracking-normal">(optional)</span>
        </label>
        <textarea
          id="setup-instructions"
          value={setup.instructions}
          onChange={(e) => onSetupChange({ ...setup, instructions: e.target.value })}
          rows={3}
          placeholder="Briefly describe what the assignment asked you to do…"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition placeholder:text-muted-foreground"
        />
      </div>

      {/* Instructor feedback — required */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-card">
        <label
          htmlFor="setup-feedback"
          className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2"
        >
          Instructor&apos;s Feedback{" "}
          <span className="text-accent font-bold">*</span>
        </label>
        <textarea
          id="setup-feedback"
          value={setup.feedback}
          onChange={(e) => onSetupChange({ ...setup, feedback: e.target.value })}
          rows={6}
          placeholder="Paste your instructor's written feedback here…"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition placeholder:text-muted-foreground"
        />
        {!canStart && (
          <p className="text-[13px] text-muted-foreground mt-2">
            Instructor feedback is required to start the coaching session.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={onLoadDemo}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-base font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition shadow-card"
        >
          <Wand2 className="w-4 h-4" />
          Load demo data
        </button>
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-base font-bold text-white shadow-card hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
        >
          Start Coaching Session →
        </button>
      </div>
    </div>
  );
}

function AssignmentCard({ setup }: { setup: SetupData }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
        <FileText className="w-3.5 h-3.5" /> Assignment
      </div>
      {setup.title ? (
        <h3 className="font-bold text-primary text-base mb-3 leading-snug">{setup.title}</h3>
      ) : (
        <h3 className="font-bold text-muted-foreground text-base mb-3 italic">Untitled assignment</h3>
      )}
      {setup.feedback && (
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-4">
          {setup.feedback}
        </p>
      )}
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAi = message.role === "ai";
  return (
    <div className={cn("flex gap-2.5 items-end", !isAi && "flex-row-reverse")}>
      <div
        className={cn(
          "w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-card",
          isAi ? "bg-primary text-white" : "bg-muted text-muted-foreground",
        )}
      >
        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-base leading-relaxed whitespace-pre-line",
          isAi
            ? "bg-white border border-border text-foreground rounded-bl-sm shadow-card"
            : "bg-primary text-white rounded-br-sm shadow-card",
        )}
      >
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
      <h3 className="font-bold text-primary text-base mb-0.5">Literacy dimensions</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Progress through the coaching session
      </p>
      <ul className="space-y-3">
        {progress.map((p) => (
          <li key={p.dim} className="flex items-center gap-3">
            {p.status === "done" ? (
              <div className="w-5 h-5 rounded-full bg-teal flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            ) : p.status === "active" ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  "text-base font-semibold truncate",
                  p.status === "done"
                    ? "text-teal"
                    : p.status === "active"
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              >
                {p.dim}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {p.status === "done"
                  ? "Completed"
                  : p.status === "active"
                    ? "In progress"
                    : "Up next"}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
