import { useState } from "react";
import { CheckCircle2, ChevronRight, Heart, Rocket, Scale, ThumbsUp } from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";
import { cn } from "@/lib/utils";

/* ── Data ─────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    dim: "Managing Affect",
    icon: Heart,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentBorder: "border-l-rose-400",
    badgeColor: "bg-rose-50 text-rose-700 border border-rose-200",
    questions: [
      {
        scenario:
          'Your teacher returns your essay with the comment: "Your argument is not developed enough." You feel disappointed and frustrated when you read it.',
        question: "What should you do first?",
        options: [
          "Start revising the essay straight away.",
          "Identify how the feedback makes you feel before deciding how to respond.",
          "Ask your teacher to explain what they meant.",
        ],
        correct: 1,
      },
      {
        scenario:
          "You read your teacher's feedback and feel angry because you worked very hard on the assignment. Your first instinct is to ignore the comments.",
        question: "What is the most helpful next step?",
        options: [
          "Email your teacher to explain the choices you made.",
          "Re-read the feedback immediately and start making changes.",
          "Set the feedback aside, take a breath, and return to it when you feel calmer.",
        ],
        correct: 2,
      },
      {
        scenario:
          'Your teacher writes: "The structure of your assignment needs significant improvement." You begin to think this means you are not a capable student.',
        question: "What is the most useful way to think about this comment?",
        options: [
          "The feedback is about the assignment, not about you as a person.",
          "You should ask another teacher for their opinion.",
          "The teacher is giving you a lower grade because of this issue.",
        ],
        correct: 0,
      },
    ],
  },
  {
    dim: "Appreciating Feedback",
    icon: ThumbsUp,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-l-amber-400",
    badgeColor: "bg-amber-50 text-amber-700 border border-amber-200",
    questions: [
      {
        scenario:
          "Your teacher writes several comments on your assignment, pointing out areas where your arguments could be stronger.",
        question: "Why is the teacher most likely providing this feedback?",
        options: [
          "To show that you made many mistakes.",
          "To explain why your grade is lower than expected.",
          "To help you understand what to improve so you can produce better work.",
        ],
        correct: 2,
      },
      {
        scenario:
          'You receive feedback saying: "Your introduction does not clearly state your main argument." You are unsure how to respond.',
        question: "What should you do with this comment?",
        options: [
          "Focus only on the sections your teacher praised.",
          "Write down the comment and think about what change it suggests for your introduction.",
          "Wait until the next assignment before thinking about it.",
        ],
        correct: 1,
      },
      {
        scenario:
          'Your teacher comments: "Good effort, but your analysis could go deeper." You are unsure whether this is positive or negative feedback.',
        question: "What is the best way to interpret this comment?",
        options: [
          "The teacher is pointing out a specific area where you can improve your performance.",
          "The teacher is not satisfied with your work.",
          "The comment is too vague to be useful.",
        ],
        correct: 0,
      },
    ],
  },
  {
    dim: "Making Judgements",
    icon: Scale,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentBorder: "border-l-sky-400",
    badgeColor: "bg-sky-50 text-sky-700 border border-sky-200",
    questions: [
      {
        scenario:
          "Your teacher provides five separate comments on your assignment. You have limited time to address all of them before your next submission.",
        question: "What should you do first?",
        options: [
          "Try to address all five comments equally.",
          "Choose the comments that are easiest to fix.",
          "Review each comment and decide which ones will most improve the quality of your work.",
        ],
        correct: 2,
      },
      {
        scenario:
          'Your teacher writes: "Your conclusion does not connect back to your main argument." You are not sure whether this is a major or minor issue.',
        question: "What is the best way to decide how important this comment is?",
        options: [
          "Compare the comment with the assignment criteria to see how much it affects your grade.",
          "Ask a classmate whether they think it matters.",
          "Assume it is minor because the teacher only mentioned it once.",
        ],
        correct: 0,
      },
      {
        scenario:
          "You have received feedback on three areas: referencing style, argument clarity, and paragraph structure. You can only focus on one before your next assignment.",
        question: "Which feedback point should you prioritise?",
        options: [
          "Referencing style, because it is the easiest to fix.",
          "The feedback point that will have the greatest impact on the overall quality of your argument.",
          "The area where you have received feedback before, even if it is a minor issue.",
        ],
        correct: 1,
      },
    ],
  },
  {
    dim: "Taking Action",
    icon: Rocket,
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    accentBorder: "border-l-teal",
    badgeColor: "bg-teal-soft text-teal border border-teal/20",
    questions: [
      {
        scenario:
          'Your teacher writes: "Your analysis needs more depth." You want to improve this in your next assignment.',
        question: "What is the most effective next step?",
        options: [
          "Try to write more detailed analysis in your next submission.",
          'Write a specific goal, such as "I will include two pieces of evidence to support each argument."',
          "Wait until you receive the marked assignment to understand what depth means.",
        ],
        correct: 1,
      },
      {
        scenario:
          "After reviewing your feedback, you identify two areas to improve: use of evidence and sentence structure.",
        question: "What should you do next?",
        options: [
          "Create a simple plan that lists specific actions you will take for each improvement area.",
          "Make a note to improve these areas and start when you feel ready.",
          "Focus on the area you find most interesting to work on.",
        ],
        correct: 0,
      },
      {
        scenario:
          "You have received feedback and identified two improvements to make. Your next assignment is due in three weeks.",
        question: "What is the best approach?",
        options: [
          "Begin making improvements the day before the assignment is due.",
          "Wait until you receive the final mark before deciding whether to act.",
          "Set aside time in your schedule this week to start working on the improvements.",
        ],
        correct: 2,
      },
    ],
  },
] as const;

const OPTION_LABELS = ["A", "B", "C"] as const;
const TOTAL_QUESTIONS = SECTIONS.length * 3;

/* ── Types ─────────────────────────────────────────────────────────── */

type Answers = Record<string, number>;

function key(sIdx: number, qIdx: number) {
  return `${sIdx}-${qIdx}`;
}

/* ── Main component ─────────────────────────────────────────────────── */

export default function Module2() {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;

  function select(sIdx: number, qIdx: number, optIdx: number) {
    setAnswers((prev) => ({ ...prev, [key(sIdx, qIdx)]: optIdx }));
  }

  /* Per-dimension scores */
  const scores = SECTIONS.map((section, sIdx) =>
    section.questions.reduce((acc, q, qIdx) => {
      return acc + (answers[key(sIdx, qIdx)] === q.correct ? 1 : 0);
    }, 0)
  );

  return (
    <ModuleLayout current={2}>
      <ModuleHeader
        eyebrow="Module 2 · Assess"
        title="Where are you right now?"
        description="Read each scenario and select the response that best matches what you would do. There are 12 questions across four dimensions."
      />

      {!submitted ? (
        <>
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${(answered / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {answered} of {TOTAL_QUESTIONS} answered
            </span>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {SECTIONS.map((section, sIdx) => {
              const Icon = section.icon;
              const sectionAnswered = section.questions.filter(
                (_, qIdx) => answers[key(sIdx, qIdx)] !== undefined
              ).length;

              return (
                <div key={section.dim}>
                  {/* Section header */}
                  <div className={`flex items-center gap-3 mb-4 pb-3 border-b border-border`}>
                    <div className={`w-8 h-8 rounded-lg ${section.iconBg} ${section.iconColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-primary text-base leading-tight">{section.dim}</h2>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0",
                      sectionAnswered === 3
                        ? "bg-teal text-white"
                        : "bg-muted text-muted-foreground",
                    )}>
                      {sectionAnswered} / 3
                    </span>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {section.questions.map((q, qIdx) => {
                      const selected = answers[key(sIdx, qIdx)];
                      const isAnswered = selected !== undefined;

                      return (
                        <div
                          key={qIdx}
                          className={cn(
                            "rounded-xl border border-l-4 bg-white shadow-card transition-all",
                            section.accentBorder,
                            isAnswered ? "border-border/80" : "border-border",
                          )}
                        >
                          {/* Question header */}
                          <div className="px-5 pt-5 pb-3">
                            <div className="flex items-center gap-2 mb-2.5">
                              <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                isAnswered ? "bg-teal text-white" : "bg-primary-soft text-primary",
                              )}>
                                {isAnswered ? "✓" : qIdx + 1}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Scenario {qIdx + 1}
                              </span>
                            </div>

                            {/* Scenario box */}
                            <div className="rounded-lg bg-muted/60 border border-border px-4 py-3 mb-3">
                              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Scenario</p>
                              <p className="text-sm text-foreground leading-relaxed">{q.scenario}</p>
                            </div>

                            <p className="font-semibold text-primary text-sm leading-snug">{q.question}</p>
                          </div>

                          {/* Options */}
                          <div className="px-5 pb-5 space-y-2">
                            {q.options.map((opt, optIdx) => (
                              <label
                                key={optIdx}
                                className={cn(
                                  "flex items-start gap-3 rounded-lg border p-3.5 cursor-pointer transition-all",
                                  selected === optIdx
                                    ? "border-primary bg-primary-soft"
                                    : "border-border hover:border-primary/30 hover:bg-muted/40",
                                )}
                              >
                                {/* Custom radio */}
                                <div className={cn(
                                  "mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                  selected === optIdx ? "border-primary bg-primary" : "border-border bg-white",
                                )}>
                                  {selected === optIdx && (
                                    <span className="w-2 h-2 rounded-full bg-white block" />
                                  )}
                                </div>
                                <input
                                  type="radio"
                                  name={key(sIdx, qIdx)}
                                  className="sr-only"
                                  checked={selected === optIdx}
                                  onChange={() => select(sIdx, qIdx, optIdx)}
                                />
                                <div className="flex items-start gap-2 min-w-0">
                                  <span className={cn(
                                    "shrink-0 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center mt-0.5",
                                    selected === optIdx
                                      ? "bg-primary text-white"
                                      : "bg-muted text-muted-foreground",
                                  )}>
                                    {OPTION_LABELS[optIdx]}
                                  </span>
                                  <span className="text-sm text-foreground leading-relaxed">{opt}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit row */}
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {answered < TOTAL_QUESTIONS
                ? `${TOTAL_QUESTIONS - answered} question${TOTAL_QUESTIONS - answered !== 1 ? "s" : ""} remaining`
                : "All questions answered — ready to submit!"}
            </p>
            <button
              onClick={() => setSubmitted(true)}
              disabled={answered < TOTAL_QUESTIONS}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-card hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              Submit assessment <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <ResultsDashboard scores={scores} />
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

/* ── Results dashboard ──────────────────────────────────────────────── */

function ResultsDashboard({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const minScore = Math.min(...scores);
  const growthIdx = scores.indexOf(minScore);
  const growthDim = SECTIONS[growthIdx].dim;

  return (
    <div className="space-y-6">
      {/* Completion banner */}
      <div className="rounded-xl border border-teal/30 bg-teal-soft px-6 py-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-primary text-base">Assessment complete</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            You scored <span className="font-semibold text-primary">{total} out of {TOTAL_QUESTIONS}</span>. Your results are shown below.
            Module 3 will give you the opportunity to apply these strategies with the help of an AI coach.
          </p>
        </div>
      </div>

      {/* Dimension scores */}
      <div>
        <h3 className="text-sm font-bold text-primary mb-3">Your dimension scores</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const score = scores[i];
            const isGrowth = i === growthIdx;
            return (
              <div
                key={section.dim}
                className={cn(
                  "rounded-xl border bg-white p-5 shadow-card",
                  isGrowth ? "border-accent/40 ring-1 ring-accent/20" : "border-border",
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${section.iconBg} ${section.iconColor} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary text-sm leading-tight">{section.dim}</p>
                  </div>
                  <span className={cn(
                    "text-sm font-bold shrink-0",
                    score === 3 ? "text-teal" : score === 2 ? "text-primary" : "text-accent",
                  )}>
                    {score} / 3
                  </span>
                </div>

                {/* Score bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      score === 3 ? "bg-teal" : score === 2 ? "bg-primary" : "bg-accent",
                    )}
                    style={{ width: `${(score / 3) * 100}%` }}
                  />
                </div>

                {isGrowth && (
                  <p className="mt-2.5 text-[10px] font-bold uppercase tracking-widest text-accent">
                    Growth focus
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Growth focus callout */}
      <div className="rounded-xl bg-accent-soft border border-accent/20 px-6 py-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1.5">
          Your growth focus
        </p>
        <p className="font-bold text-primary text-base mb-1">
          Your Growth Focus is {growthDim}.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This dimension may require additional attention as you move into Module 3.
        </p>
      </div>
    </div>
  );
}
