import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  FileText,
  Info,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";
import { cn } from "@/lib/utils";
import type { Dimension } from "@/lib/constants";
import { getCoachReply } from "@/lib/coachApi";
import { DEMO_MODULE3_SETUP } from "@/lib/demoData";

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

const INITIAL_PROGRESS: ProgressItem[] = [
  { dim: "Managing Affect",       status: "active" },
  { dim: "Appreciating Feedback", status: "todo"   },
  { dim: "Making Judgments",      status: "todo"   },
  { dim: "Taking Action",         status: "todo"   },
];

// Maps the AI's [STAGE_COMPLETE:key] tags to progress array indices.
const STAGE_COMPLETE_INDEX: Record<string, number> = {
  managing_affect:       0,
  appreciating_feedback: 1,
  making_judgements:     2,
  taking_action:         3,
};

const STAGE_TAG_RE = /\[STAGE_COMPLETE:[a-z_]+\]\s*$/;

// Detect which stage index was completed from an AI response.
// Checks the machine-readable tag first; falls back to natural-language
// patterns. The `.{0,25}` gap handles "Stage N: " that the model inserts
// between "move to" and the stage name (e.g. "move to Stage 3: Making...").
function detectCompletedStage(text: string): number | null {
  const tagMatch = text.match(/\[STAGE_COMPLETE:([a-z_]+)\]/);
  if (tagMatch) return STAGE_COMPLETE_INDEX[tagMatch[1] ?? ""] ?? null;

  const t = text.toLowerCase();
  // Transition TO a stage → the previous stage just completed.
  if (/move to.{0,25}appreciating feedback/i.test(t) || /managing affect.{0,10}complet/i.test(t)) return 0;
  if (/move to.{0,25}making judgements?/i.test(t)    || /appreciating feedback.{0,10}complet/i.test(t)) return 1;
  if (/move to.{0,25}taking action/i.test(t)         || /making judgements?.{0,10}complet/i.test(t)) return 2;
  if (/taking action.{0,10}complet/i.test(t)) return 3;
  return null;
}

export const COACH_SYSTEM_PROMPT = `You are ActiOn, an AI Feedback Literacy Coach.

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
  const [progress, setProgress] = useState<ProgressItem[]>(INITIAL_PROGRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  async function handleContinue() {
    setSaveStatus("saving");
    const { error } = await supabase.from("Module_3").insert({
      participant_id: "DEMO001",
      growth_focus: "Making Judgements",
      feedback_source: "",
      assignment_title: setup.title,
      assignment_instructions: setup.instructions,
      feedback_text: setup.feedback,
      managing_affect_response: "",
      appreciating_feedback_response: "",
      making_judgements_response: "",
      making_judgements_reason: "",
      taking_action_response: "",
      action_plan: "",
      ai_conversation: chat,
    });
    if (error) {
      setSaveStatus("error");
    } else {
      setSaveStatus("saved");
      setTimeout(() => void navigate("/module/4"), 800);
    }
  }

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  function handleBeginCoaching() {
    const greeting: ChatMessage = {
      role: "ai",
      text: `Hi! I can see you're working on "${setup.title}."\n\nLet's begin with Stage 1: Managing Affect.\n\nHow did you feel when you received this feedback?`,
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
      const rawText = await getCoachReply(nextChat, setup);

      // Strip machine-readable tag before displaying; detect stage completion
      // via tag OR natural-language fallback patterns.
      const displayText = rawText.replace(STAGE_TAG_RE, "").trimEnd();
      const completedIdx = detectCompletedStage(rawText);

      setChat((prev) => [...prev, { role: "ai", text: displayText }]);

      if (completedIdx !== null) {
        setProgress((prev) =>
          prev.map((p, i) => {
            if (i === completedIdx)     return { ...p, status: "done"   };
            if (i === completedIdx + 1) return { ...p, status: "active" };
            return p;
          }),
        );
      }
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

  /* ── Step 2: Coaching — full-height viewport layout ───────── */

  return (
    <ModuleLayout current={3} fullHeight>

      {/* Compact page header */}
      <div className="shrink-0 mb-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-teal mb-1">
          Module 3 · Practice · Step 2 of 2
        </p>
        <h1 className="text-xl font-extrabold text-primary tracking-tight leading-tight">
          Build your improvement plan with an AI coach
        </h1>
      </div>

      {/* Grid — 3 / 9 cols ≈ 25% / 75% */}
      <div className="flex-1 min-h-0 grid gap-4 lg:grid-cols-12">

        {/* ── Left context panel — compact, ~25% ── */}
        <div className="lg:col-span-3 min-h-0 overflow-y-auto space-y-2 pr-1">

          {/* Assignment title — minimal card */}
          <div className="rounded-xl border border-border bg-white px-3 py-2.5 shadow-card">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              <FileText className="w-3 h-3 shrink-0" /> Assignment
            </div>
            <p className="font-semibold text-primary text-xs leading-snug">{setup.title}</p>
          </div>

          {/* Teacher feedback — collapsible */}
          <FeedbackAccordion
            feedback={setup.feedback}
            onChange={(v) => setSetup((prev) => ({ ...prev, feedback: v }))}
          />
        </div>

        {/* ── Chat panel — ~75%, fills column height ── */}
        <div className="lg:col-span-9 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 rounded-xl border-2 border-primary bg-white overflow-hidden shadow-card-lg flex flex-col">

            {/* Chat header */}
            <div className="bg-primary px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white leading-tight">AI Feedback Coach</div>
                  <div className="text-[11px] text-white/65 mt-0.5">
                    Currently: {progress.find((p) => p.status === "active")?.dim ?? "Complete"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <span className="text-[11px] text-white/70 animate-pulse font-medium">Thinking…</span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                    {import.meta.env.DEV ? "Demo mode" : "Live"}
                  </span>
                )}
              </div>
            </div>

            {/* Stage progress strip */}
            <div className="bg-primary-soft border-b border-border px-5 py-2 flex items-center gap-4 shrink-0">
              {progress.map((p) => (
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
                    p.status === "done"   ? "text-teal"
                    : p.status === "active" ? "text-primary"
                    : "text-muted-foreground/60",
                  )}>
                    {p.dim.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Messages — the only scrolling region */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4 bg-surface/40">
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
              <p className="text-[10px] text-muted-foreground mt-1 ml-0.5">Shift + Enter for new line</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 mt-3 flex items-center justify-between border-t border-border pt-3">
        <Link
          to="/module/2"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to Assess
        </Link>
        <div className="flex items-center gap-3">
          {saveStatus === "saved" && (
            <span className="text-xs font-semibold text-teal flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Session saved.
            </span>
          )}
          {saveStatus === "error" && (
            <>
              <span className="text-xs text-muted-foreground">Could not save.</span>
              <Link
                to="/module/4"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-bold text-white shadow-card hover:bg-accent/90 active:scale-[0.98] transition-all"
              >
                Continue anyway →
              </Link>
            </>
          )}
          {(saveStatus === "idle" || saveStatus === "saving") && (
            <button
              onClick={() => void handleContinue()}
              disabled={saveStatus === "saving"}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-bold text-white shadow-card hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              {saveStatus === "saving" ? "Saving…" : "Continue to Transfer →"}
            </button>
          )}
        </div>
      </div>

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
    <div className="max-w-2xl space-y-4">

      {/* Demo bar */}
      <div className="flex items-center gap-3 rounded-lg border border-accent/25 bg-accent-soft px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent shrink-0">
          Presentation
        </span>
        <span className="text-xs text-muted-foreground flex-1 min-w-0 hidden sm:block">
          Pre-fill with a sample essay and teacher feedback for demo.
        </span>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={() => onChange(DEMO_MODULE3_SETUP)}
            className="text-xs font-bold text-accent border border-accent/30 bg-white rounded-md px-3 py-1.5 hover:bg-accent/5 active:scale-95 transition-all shadow-sm"
          >
            Load Demo Data
          </button>
          <button
            onClick={() => onChange({ title: "", instructions: "", feedback: "" })}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Info callout */}
      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-primary/80 leading-relaxed">
          Your entries are sent to the AI coach to personalise the session. Nothing is stored beyond the active conversation.
        </p>
      </div>

      {/* Field 1: Assignment Title */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal shrink-0" />
          <label
            htmlFor="assignment-title"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Assignment Title <span className="text-accent normal-case font-semibold tracking-normal">· required</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          The name of the work you received feedback on. The coach will refer to it by name.
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
      <div className="rounded-xl border border-border bg-white p-5 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-teal shrink-0" />
          <label
            htmlFor="assignment-instructions"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Assignment Instructions / Task Description <span className="text-muted-foreground/60 normal-case font-normal tracking-normal text-[10px]">· optional</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste the task brief or marking criteria so the coach understands what the assignment required.
        </p>
        <textarea
          id="assignment-instructions"
          value={setup.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
          rows={4}
          placeholder="Paste the assignment brief, task instructions, or marking criteria here…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-y text-foreground placeholder:text-muted-foreground transition"
        />
      </div>

      {/* Field 3: Teacher Feedback */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-teal shrink-0" />
          <label
            htmlFor="teacher-feedback"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Teacher Feedback <span className="text-accent normal-case font-semibold tracking-normal">· required</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Copy exactly what your teacher wrote — including comments that feel harsh or confusing.
          The coach is designed to help you work through all of it.
        </p>
        <textarea
          id="teacher-feedback"
          value={setup.feedback}
          onChange={(e) => onChange({ feedback: e.target.value })}
          rows={5}
          placeholder="Paste your teacher's written feedback here…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-y text-foreground placeholder:text-muted-foreground transition"
        />
      </div>

      {/* Begin button */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-muted-foreground">
          {!canBegin && "Complete the required fields to continue."}
        </p>
        <button
          onClick={onBegin}
          disabled={!canBegin}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-2.5 text-sm font-bold text-white shadow-card hover:bg-accent/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Begin Coaching →
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function FeedbackAccordion({
  feedback,
  onChange,
}: {
  feedback: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-surface/50 transition-colors text-left"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Bot className="w-3 h-3 shrink-0" /> Teacher's Feedback
        </div>
        <ChevronDown className={cn(
          "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
          open && "rotate-180",
        )} />
      </button>
      {open && (
        <div className="px-3 pb-3">
          <textarea
            id="feedback-input"
            value={feedback}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none text-foreground"
          />
        </div>
      )}
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
        "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
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

