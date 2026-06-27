import { useState } from "react";
import { CheckCircle2, Compass, FileText, Heart, Quote, Rocket, Scale, ThumbsUp } from "lucide-react";
import { DEMO_MODULE4_RESPONSES } from "@/lib/demoData";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

/* ── Plan components ──────────────────────────────────────────────────────── */

const PLAN_COMPONENTS = [
  {
    icon: Heart,
    title: "Managing Affect",
    prompt: "When you receive difficult feedback in the future, how will you manage your emotional reaction?",
    explanation:
      "Managing affect means recognising your emotional reaction to feedback and preventing it from blocking your ability to learn from it.",
    placeholder:
      "e.g. I will pause before reading the feedback, identify how I feel, and give myself time to calm down before deciding how to respond…",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentBorder: "border-l-rose-400",
    summaryAccent: "bg-rose-50 border-rose-200 text-rose-700",
    dot: "bg-rose-400",
  },
  {
    icon: ThumbsUp,
    title: "Appreciating Feedback",
    prompt: "How will you identify what your instructor is trying to help you improve?",
    explanation:
      "Appreciating feedback means understanding that feedback is a resource designed to support your learning, not a personal criticism.",
    placeholder:
      "e.g. I will read each comment carefully and ask myself: what is the instructor trying to help me improve here?…",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-l-amber-400",
    summaryAccent: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
  },
  {
    icon: Scale,
    title: "Making Judgements",
    prompt: "How will you decide which feedback points are most important for your learning or assignment quality?",
    explanation:
      "Making judgements means evaluating which feedback comments will have the greatest impact on the quality of your work.",
    placeholder:
      "e.g. I will compare each comment against the marking criteria and identify the two or three points that matter most…",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentBorder: "border-l-sky-400",
    summaryAccent: "bg-sky-50 border-sky-200 text-sky-700",
    dot: "bg-sky-400",
  },
  {
    icon: Rocket,
    title: "Taking Action",
    prompt: "What specific action will you take, and by when?",
    explanation:
      "Taking action means turning your priority feedback into a concrete, time-bound improvement plan you can act on immediately.",
    placeholder:
      "e.g. I will revise the introduction by Friday, focusing on clarifying the main argument and adding two supporting sources…",
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    accentBorder: "border-l-teal",
    summaryAccent: "bg-teal-soft border-teal/20 text-teal",
    dot: "bg-teal",
  },
] as const;

const MIN_CHARS = 10;

/* ── Module 4 ─────────────────────────────────────────────────────────────── */

export default function Module4() {
  const [responses, setResponses] = useState(["", "", "", ""]);
  const [submitted, setSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const filled = responses.filter((r) => r.trim().length >= MIN_CHARS).length;
  const canSubmit = filled === PLAN_COMPONENTS.length;

  function update(i: number, value: string) {
    setResponses((prev) => prev.map((r, j) => (j === i ? value : r)));
  }

  async function handleGenerate() {
    setSubmitted(true);
    setSaveStatus("saving");
    const { error } = await supabase.from("Module_4").insert({
      participant_id: "DEMO001",
      worksheet_mode: false,
      generated_plan: {
        managing_affect: responses[0]?.trim() ?? "",
        appreciating_feedback: responses[1]?.trim() ?? "",
        making_judgements: responses[2]?.trim() ?? "",
        taking_action: responses[3]?.trim() ?? "",
        generated_summary: "",
      },
    });
    setSaveStatus(error ? "error" : "saved");
  }

  return (
    <ModuleLayout current={4}>
      <ModuleHeader
        eyebrow="Module 4 · Transfer"
        title="My Future Feedback Plan"
        description="Apply everything you have learned by building a personalised plan for how you will use feedback in the future. Complete all four sections, then generate your plan."
      />

      {/* Scenario card */}
      <div className="rounded-xl bg-primary p-7 mb-8 shadow-card-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4">
            <Compass className="w-3.5 h-3.5" />
            Future scenario
          </div>
          <Quote className="w-7 h-7 text-accent/60 mb-3" aria-hidden />
          <p className="text-lg md:text-xl leading-relaxed text-white">
            You've just submitted your capstone thesis. Your supervisor writes:{" "}
            <em className="text-white/85 not-italic border-l-2 border-accent/60 pl-3 block mt-3">
              "This is ambitious work, but the methodology section is underdeveloped and you
              don't engage with counter-evidence. I'm not yet convinced of the conclusion.
              Let's meet next week."
            </em>
          </p>
          <p className="mt-5 text-base text-white/70 font-medium">
            How would you respond — emotionally, intellectually, and in action — before that meeting?
          </p>
        </div>
      </div>

      {/* Demo bar */}
      <div className="flex items-center gap-3 rounded-lg border border-accent/25 bg-accent-soft px-4 py-2.5 mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent shrink-0">
          Presentation
        </span>
        <span className="text-[13px] text-muted-foreground flex-1 min-w-0 hidden sm:block">
          Pre-fill all four plan sections with sample responses for demo.
        </span>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={() => { setResponses([...DEMO_MODULE4_RESPONSES]); setSubmitted(false); }}
            className="text-[13px] font-bold text-accent border border-accent/30 bg-white rounded-md px-3 py-1.5 hover:bg-accent/5 active:scale-95 transition-all shadow-sm"
          >
            Load Demo Data
          </button>
          <button
            onClick={() => { setResponses(["", "", "", ""]); setSubmitted(false); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Progress strip */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-500"
            style={{ width: `${(filled / PLAN_COMPONENTS.length) * 100}%` }}
          />
        </div>
        <span className="text-[13px] font-medium text-muted-foreground whitespace-nowrap">
          {filled} of {PLAN_COMPONENTS.length} completed
        </span>
      </div>

      {/* Plan component cards */}
      <div className="space-y-5 mb-8">
        {PLAN_COMPONENTS.map((component, i) => {
          const Icon = component.icon;
          const value = responses[i] ?? "";
          const isDone = value.trim().length >= MIN_CHARS;

          return (
            <div
              key={component.title}
              className={cn(
                "rounded-xl border border-l-4 bg-white shadow-card transition-shadow",
                component.accentBorder,
                isDone ? "border-border/70 shadow-card-md" : "border-border",
              )}
            >
              {/* Card header */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn(
                    "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                    component.iconBg, component.iconColor,
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-primary text-base leading-tight">
                        {component.title}
                      </h2>
                      {isDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                      {component.explanation}
                    </p>
                  </div>
                </div>

                <label
                  htmlFor={`plan-${i}`}
                  className="block text-base font-semibold text-primary leading-snug"
                >
                  {component.prompt}
                </label>
              </div>

              {/* Textarea */}
              <div className="px-5 pb-5">
                <textarea
                  id={`plan-${i}`}
                  value={value}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder={component.placeholder}
                  rows={4}
                  className={cn(
                    "w-full rounded-lg border bg-background px-3.5 py-3 text-base leading-relaxed",
                    "focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40",
                    "resize-y text-foreground placeholder:text-muted-foreground/60 transition",
                    isDone ? "border-teal/30" : "border-border",
                  )}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {value.trim().length === 0
                    ? "Start typing your response…"
                    : isDone
                      ? `${value.trim().split(/\s+/).length} words`
                      : "Keep going — a little more detail helps."}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generate button */}
      {!submitted && (
        <div className="flex items-center justify-between border-t border-border pt-6 mb-4">
          <p className="text-base text-muted-foreground">
            {canSubmit
              ? "All sections complete — ready to generate your plan."
              : `${PLAN_COMPONENTS.length - filled} section${PLAN_COMPONENTS.length - filled !== 1 ? "s" : ""} remaining.`}
          </p>
          <button
            onClick={() => void handleGenerate()}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-base font-bold text-white shadow-card hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            <FileText className="w-4 h-4" />
            Generate my plan →
          </button>
        </div>
      )}

      {/* Plan summary */}
      {submitted && <PlanSummary responses={responses} saveStatus={saveStatus} />}

      <NavFooter
        prev={{ path: "/module/3", label: "Back to Practice" }}
        next={{ path: "/", label: "Finish course" }}
      />
    </ModuleLayout>
  );
}

/* ── Plan summary ─────────────────────────────────────────────────────────── */

function PlanSummary({ responses, saveStatus }: { responses: string[]; saveStatus: "idle" | "saving" | "saved" | "error" }) {
  return (
    <div className="mt-2 mb-8">
      {/* Banner */}
      <div className="rounded-xl border border-teal/30 bg-teal-soft px-6 py-5 flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-primary text-lg">Plan generated</p>
          <p className="text-base text-muted-foreground mt-0.5 leading-relaxed">
            Your Future Feedback Plan is ready. Save or screenshot this page to keep it for your next assignment.
          </p>
          {saveStatus === "saving" && (
            <p className="text-xs text-muted-foreground mt-1.5">Saving…</p>
          )}
          {saveStatus === "saved" && (
            <p className="text-xs text-teal font-medium mt-1.5">Plan saved.</p>
          )}
          {saveStatus === "error" && (
            <p className="text-xs text-rose-600 mt-1.5">Could not save your plan. Please screenshot or copy your responses.</p>
          )}
        </div>
      </div>

      {/* Plan card */}
      <div className="rounded-xl border border-border bg-white shadow-card-md overflow-hidden">
        {/* Plan header */}
        <div className="bg-primary px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/55 mb-1">
            Feedback Literacy · Module 4
          </p>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            My Future Feedback Plan
          </h2>
        </div>

        {/* Plan body */}
        <div className="divide-y divide-border">
          {PLAN_COMPONENTS.map((component, i) => {
            const Icon = component.icon;
            const text = responses[i]?.trim() ?? "";

            return (
              <div key={component.title} className="px-6 py-5">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className={cn(
                    "shrink-0 w-7 h-7 rounded-md flex items-center justify-center",
                    component.iconBg, component.iconColor,
                  )}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                    component.summaryAccent,
                  )}>
                    {component.title}
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground mb-1.5 leading-snug">
                  {component.prompt}
                </p>
                <p className="text-base text-foreground leading-relaxed">
                  {text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Plan footer */}
        <div className="bg-muted/40 border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            ActiOn · Feedback to Action · Complete this plan after every major piece of feedback you receive.
          </p>
        </div>
      </div>
    </div>
  );
}
