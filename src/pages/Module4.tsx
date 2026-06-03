import { useState } from "react";
import { Compass, Lightbulb, Quote, Trophy } from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";
import { cn } from "@/lib/utils";
import type { Dimension } from "@/lib/constants";

const SCORES: { dim: Dimension; score: number }[] = [
  { dim: "Managing Affect",       score: 82 },
  { dim: "Appreciating Feedback", score: 88 },
  { dim: "Making Judgments",      score: 74 },
  { dim: "Taking Action",         score: 79 },
];

export default function Module4() {
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const overall = Math.round(
    SCORES.reduce((acc, s) => acc + s.score, 0) / SCORES.length,
  );

  return (
    <ModuleLayout current={4}>
      <ModuleHeader
        eyebrow="Module 4 · Transfer"
        title="A challenge from your future self"
        description="Apply your feedback literacy to a new scenario. There's no single right answer — show how you would respond."
      />

      {/* Scenario card */}
      <div className="rounded-xl bg-primary p-7 mb-5 shadow-card-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4">
            <Compass className="w-3.5 h-3.5" />
            Future scenario
          </div>
          <Quote className="w-7 h-7 text-accent/60 mb-3" aria-hidden />
          <p className="text-base md:text-lg leading-relaxed text-white">
            You've just submitted your capstone thesis. Your supervisor writes:{" "}
            <em className="text-white/85 not-italic border-l-2 border-accent/60 pl-3 block mt-3">
              "This is ambitious work, but the methodology section is underdeveloped and you
              don't engage with counter-evidence. I'm not yet convinced of the conclusion.
              Let's meet next week."
            </em>
          </p>
          <p className="mt-5 text-sm text-white/70 font-medium">
            How would you respond — emotionally, intellectually, and in action — before that meeting?
          </p>
        </div>
      </div>

      {/* Response area */}
      <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden mb-4">
        <div className="px-5 pt-4 pb-2 border-b border-border/60">
          <label htmlFor="scenario-response" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Your response
          </label>
        </div>
        <textarea
          id="scenario-response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your response here. Consider all four dimensions you've learned about — how you'll manage your initial reaction, what you can learn from this feedback, how you'll judge the gap, and what concrete steps you'll take…"
          className="w-full min-h-[200px] px-5 py-4 text-sm leading-relaxed focus:outline-none resize-none text-foreground placeholder:text-muted-foreground/60 bg-transparent"
          aria-label="Your scenario response"
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          {response.trim().length < 20
            ? "Take a moment to reflect on all four dimensions."
            : `${response.trim().split(/\s+/).length} words — looking good.`}
        </p>
        <button
          onClick={() => setSubmitted(true)}
          disabled={response.trim().length < 20}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-card hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
        >
          Submit response →
        </button>
      </div>

      {submitted && <ResultsPanel overall={overall} scores={SCORES} />}

      <NavFooter
        prev={{ path: "/module/3", label: "Back to Practice" }}
        next={{ path: "/", label: "Finish course" }}
      />
    </ModuleLayout>
  );
}

/* ─── Results panel ──────────────────────────────────────────── */

function ResultsPanel({ overall, scores }: { overall: number; scores: typeof SCORES }) {
  return (
    <div className="mt-10 space-y-5">
      <div className="rounded-xl border border-border bg-white shadow-card-md overflow-hidden">
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5">Course complete</p>
            <h2 className="text-lg font-bold text-white">Overall feedback literacy</h2>
          </div>
          <div className="text-right">
            <div className="text-5xl font-extrabold text-white leading-none">{overall}</div>
            <div className="text-xs text-white/60 mt-1">out of 100</div>
          </div>
        </div>
        <div className="p-5 grid gap-3 md:grid-cols-2">
          {scores.map((s) => (
            <ScoreBar key={s.dim} dim={s.dim} score={s.score} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-teal/25 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-soft flex items-center justify-center">
              <Trophy className="w-4 h-4 text-teal" />
            </div>
            <span className="font-bold text-primary text-sm">Strengths</span>
          </div>
          <ul className="space-y-2.5">
            {[
              "You named your emotional reaction before responding intellectually.",
              "You treated the supervisor's critique as a resource, not an attack.",
              "You proposed concrete revision steps with a clear timeline.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-accent/20 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-accent" />
            </div>
            <span className="font-bold text-primary text-sm">Future advice</span>
          </div>
          <ul className="space-y-2.5">
            {[
              "Continue using the rubric to self-judge before submission.",
              "When unsure, ask the supervisor a clarifying question instead of guessing.",
              "Keep a feedback journal to track recurring patterns across courses.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── Score bar ──────────────────────────────────────────────── */

function ScoreBar({ dim, score }: { dim: Dimension; score: number }) {
  const { bar, bg } =
    score >= 80
      ? { bar: "bg-teal",    bg: "bg-teal-soft" }
      : score >= 70
        ? { bar: "bg-primary", bg: "bg-primary-soft" }
        : { bar: "bg-accent",  bg: "bg-accent-soft" };

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-primary">{dim}</span>
        <span className={cn("text-sm font-extrabold", score >= 80 ? "text-teal" : score >= 70 ? "text-primary" : "text-accent")}>
          {score}
        </span>
      </div>
      <div className={cn("h-2 rounded-full overflow-hidden", bg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-700", bar)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
