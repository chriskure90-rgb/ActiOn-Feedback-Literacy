import { useState } from "react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";
import { cn } from "@/lib/utils";
import type { Dimension } from "@/lib/constants";

const QUESTIONS = [
  {
    q: "When you receive critical feedback, your first reaction is usually to…",
    opts: [
      "Feel defensive and dismiss it",
      "Pause and breathe before reading further",
      "Re-read it carefully and note your emotions",
      "Ask the teacher for clarification right away",
    ],
  },
  {
    q: "Feedback is most useful when…",
    opts: [
      "It only highlights strengths",
      "It tells you exactly what to change",
      "It helps you judge your own work",
      "It comes with a grade",
    ],
  },
  {
    q: "Before submitting an assignment you usually…",
    opts: [
      "Hand it in once it's done",
      "Skim it once",
      "Compare it against the rubric",
      "Ask a peer to review it",
    ],
  },
  {
    q: "After receiving feedback, your typical next step is…",
    opts: [
      "File it away",
      "Plan concrete edits",
      "Discuss it with classmates",
      "Wait for the next assignment",
    ],
  },
] as const;

const RESULTS: { dim: Dimension; level: "Strong" | "Moderate" | "Develop" }[] = [
  { dim: "Managing Affect",       level: "Moderate" },
  { dim: "Appreciating Feedback", level: "Strong"   },
  { dim: "Making Judgments",      level: "Develop"  },
  { dim: "Taking Action",         level: "Moderate" },
];

export default function Module2() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;

  return (
    <ModuleLayout current={2}>
      <ModuleHeader
        eyebrow="Module 2 · Assess"
        title="Where are you right now?"
        description="A short self-assessment to map your current strengths across the four feedback literacy dimensions."
      />

      {!submitted ? (
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {answered} of {QUESTIONS.length} answered
            </span>
          </div>

          {QUESTIONS.map((q, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border bg-white p-6 shadow-card transition-all",
                answers[i] !== undefined ? "border-teal/40" : "border-border",
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  answers[i] !== undefined
                    ? "bg-teal text-white"
                    : "bg-primary-soft text-primary",
                )}>
                  {i + 1}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Question {i + 1} of {QUESTIONS.length}
                </span>
              </div>
              <h3 className="font-semibold text-primary mb-4 leading-snug">{q.q}</h3>
              <div className="space-y-2">
                {q.opts.map((opt, j) => (
                  <label
                    key={j}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer transition-all",
                      answers[i] === j
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:border-primary/30 hover:bg-muted/50",
                    )}
                  >
                    <span className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                      answers[i] === j ? "border-primary bg-primary" : "border-border",
                    )}>
                      {answers[i] === j && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                      )}
                    </span>
                    <input
                      type="radio"
                      name={`q${i}`}
                      className="sr-only"
                      checked={answers[i] === j}
                      onChange={() => setAnswers({ ...answers, [i]: j })}
                    />
                    <span className="text-sm text-foreground">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              {answered < QUESTIONS.length
                ? `${QUESTIONS.length - answered} question${QUESTIONS.length - answered !== 1 ? "s" : ""} remaining`
                : "All questions answered — ready to submit!"}
            </p>
            <button
              onClick={() => setSubmitted(true)}
              disabled={answered < QUESTIONS.length}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-card hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              Submit assessment →
            </button>
          </div>
        </div>
      ) : (
        <ResultsDashboard />
      )}

      {submitted && (
        <NavFooter
          prev={{ path: "/module/1", label: "Back to Learn" }}
          next={{ path: "/module/3", label: "Continue to Practice" }}
        />
      )}
    </ModuleLayout>
  );
}

function ResultsDashboard() {
  return (
    <div>
      <div className="rounded-xl border border-teal/30 bg-teal-soft p-5 mb-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center shrink-0 text-lg font-bold mt-0.5">✓</div>
        <div>
          <h2 className="font-bold text-primary text-base">Assessment complete</h2>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            Here is your feedback literacy profile. Module 3 will personalise the AI coach experience based on these results.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {RESULTS.map((r) => (
          <DimensionCard key={r.dim} dim={r.dim} level={r.level} />
        ))}
      </div>
    </div>
  );
}

const LEVEL_STYLES = {
  Strong:   { badge: "bg-teal text-white",                                   bar: "bg-teal",    track: "bg-teal-soft",    width: "w-full", label: "Strong"   },
  Moderate: { badge: "bg-primary/10 text-primary border border-primary/20",  bar: "bg-primary", track: "bg-primary-soft", width: "w-2/3",  label: "Moderate" },
  Develop:  { badge: "bg-accent-soft text-accent border border-accent/20",   bar: "bg-accent",  track: "bg-accent-soft",  width: "w-1/3",  label: "Develop"  },
} as const;

function DimensionCard({ dim, level }: { dim: Dimension; level: keyof typeof LEVEL_STYLES }) {
  const s = LEVEL_STYLES[level];
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-primary text-sm">{dim}</h3>
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full", s.badge)}>
          {s.label}
        </span>
      </div>
      <div className={cn("h-2 rounded-full overflow-hidden", s.track)}>
        <div className={cn("h-full rounded-full transition-all duration-700", s.bar, s.width)} />
      </div>
    </div>
  );
}
