import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle2, ChevronRight, Heart, Rocket, Scale, ThumbsUp, XCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { ModuleLayout, ModuleHeader } from "@/components/ModuleLayout";
import { cn } from "@/lib/utils";
import { DEMO_MODULE2_ANSWERS } from "@/lib/demoData";

/* ── Data ─────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    dim: "Managing Affect",
    icon: Heart,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentBorder: "border-l-rose-400",
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
        feedbackCorrect:
          "Correct. Recognising how feedback makes you feel is the first step in managing affect — it helps you stay in control before deciding how to respond.",
        feedbackIncorrect:
          "Not quite. When emotions are high, identifying your feelings first helps prevent them from blocking your ability to engage with the feedback constructively.",
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
        feedbackCorrect:
          "Correct. Giving yourself time to calm down before revisiting feedback is a key strategy for managing affect and approaching it productively.",
        feedbackIncorrect:
          "Not quite. Acting on strong emotions can lead to defensive responses. Pausing first allows you to engage with the feedback more effectively.",
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
        feedbackCorrect:
          "Correct. Feedback targets your work, not your identity. Separating the two helps you focus on what can actually be improved.",
        feedbackIncorrect:
          "Not quite. It can be easy to feel personally criticised, but feedback is about the assignment. Focusing on the work rather than your self-worth supports productive learning.",
      },
    ],
  },
  {
    dim: "Appreciating Feedback",
    icon: ThumbsUp,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-l-amber-400",
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
        feedbackCorrect:
          "Correct. Teachers provide feedback to support your learning and help you improve, not to criticise you personally.",
        feedbackIncorrect:
          "Not quite. The purpose of feedback is to guide improvement. Understanding this intention helps you engage with comments as learning opportunities.",
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
        feedbackCorrect:
          "Correct. Writing down and thinking through a comment helps you understand what it means and what specific change it is suggesting.",
        feedbackIncorrect:
          "Not quite. Engaging with all comments, including critical ones, helps you use feedback as a learning resource rather than something to avoid.",
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
        feedbackCorrect:
          "Correct. This comment identifies a specific area for improvement, which is valuable information for developing stronger analytical skills.",
        feedbackIncorrect:
          "Not quite. Feedback that points to an area for growth is a useful resource. Recognising improvement opportunities helps you appreciate what feedback is designed to do.",
      },
    ],
  },
  {
    dim: "Making Judgements",
    icon: Scale,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentBorder: "border-l-sky-400",
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
        feedbackCorrect:
          "Correct. Evaluating which feedback will have the most impact helps you make the best use of your limited time and effort.",
        feedbackIncorrect:
          "Not quite. When time is limited, judging which feedback points will most improve your work is more effective than spreading effort equally or choosing what is easiest.",
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
        feedbackCorrect:
          "Correct. Comparing feedback against the marking criteria helps you assess how significant the comment is and how much attention it deserves.",
        feedbackIncorrect:
          "Not quite. The marking criteria provide an objective measure of importance. Comparing a comment against the criteria helps you make an informed judgement about how to prioritise it.",
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
        feedbackCorrect:
          "Correct. Prioritising feedback with the greatest impact ensures your effort leads to meaningful improvement in your overall performance.",
        feedbackIncorrect:
          "Not quite. Ease or familiarity are not the best basis for prioritising feedback. Focus on the comment that will most improve the quality of your argument.",
      },
    ],
  },
  {
    dim: "Taking Action",
    icon: Rocket,
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    accentBorder: "border-l-teal",
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
        feedbackCorrect:
          "Correct. Specific goals are more actionable than general intentions — a clear target helps you know exactly what to aim for in your revision.",
        feedbackIncorrect:
          "Not quite. Vague intentions are harder to act on. Writing a specific goal gives you a concrete target and makes it easier to track your progress.",
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
        feedbackCorrect:
          "Correct. A written action plan with specific steps for each area makes it more likely you will follow through on the improvements.",
        feedbackIncorrect:
          "Not quite. Vague plans are easy to forget. A specific action plan with clear steps for each improvement area helps you take meaningful action.",
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
        feedbackCorrect:
          "Correct. Starting early gives you enough time to make thoughtful improvements rather than rushing at the last minute.",
        feedbackIncorrect:
          "Not quite. Delaying action makes it harder to improve effectively. Setting aside time early in the week helps you apply feedback before the deadline.",
      },
    ],
  },
] as const;

function classifyScore(score: number): "strength" | "developing" | "growth" {
  if (score === 3) return "strength";
  if (score === 2) return "developing";
  return "growth";
}

const DIM_CONTENT = {
  "Managing Affect": {
    description:
      "Managing Affect is about recognising your emotional reaction to feedback and staying open to learning from it.",
    bullets: [
      "Notice their emotions",
      "Avoid reacting defensively",
      "Stay focused on improvement",
    ],
    question: "What are you expected to do in Managing Affect?",
    example:
      "I need to recognise my emotional reaction to feedback and stay open to using it for improvement.",
  },
  "Appreciating Feedback": {
    description:
      "Appreciating Feedback is about understanding your teacher's intention and identifying the gap between your current work and expected performance.",
    bullets: [
      "Interpret feedback in their own words",
      "Understand why they received the feedback",
      "Identify what needs improvement",
    ],
    question: "What are you expected to do in Appreciating Feedback?",
    example:
      "I need to understand what my teacher wants me to improve and identify the gap between my current work and the expected standard.",
  },
  "Making Judgements": {
    description:
      "Making Judgements is about deciding which feedback is most important to act on first.",
    bullets: [
      "Prioritise feedback points",
      "Explain why they are important",
      "Focus on improvements with the greatest impact",
    ],
    question: "What are you expected to do in Making Judgements?",
    example:
      "I need to decide which feedback point is most important and explain why it should be prioritised.",
  },
  "Taking Action": {
    description:
      "Taking Action is about turning feedback into a concrete improvement plan.",
    bullets: [
      "Set a clear goal",
      "Identify a strategy",
      "Monitor their progress",
    ],
    question: "What are you expected to do in Taking Action?",
    example:
      "I need to create a goal, describe how I will achieve it, and explain how I will monitor my progress.",
  },
} as const;

const OPTION_LABELS = ["A", "B", "C"] as const;
const TOTAL_QUESTIONS = SECTIONS.length * 3;

/* ── Types ─────────────────────────────────────────────────────────── */

type Answers = Record<string, number>;

function key(sIdx: number, qIdx: number) {
  return `${sIdx}-${qIdx}`;
}

/* ── Main component ─────────────────────────────────────────────────── */

export default function Module2() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [selfExplanations, setSelfExplanations] = useState<Record<string, string>>({});

  const answered = Object.keys(answers).length;

  const scores = SECTIONS.map((section, sIdx) =>
    section.questions.reduce((acc, q, qIdx) => {
      return acc + (answers[key(sIdx, qIdx)] === q.correct ? 1 : 0);
    }, 0)
  );

  const growthAreas = SECTIONS
    .map((s, i) => ({ dim: s.dim, score: scores[i] ?? 0 }))
    .filter(({ score }) => score < 2)
    .map(({ dim }) => dim);

  function handleSubmit() {
    setSubmitted(true);
  }

  async function handleContinue() {
    setSaveStatus("saving");
    const { error } = await supabase.from("Module_2").insert({
      participant_id: "DEMO001",
      managing_affect_score: scores[0],
      appreciating_feedback_score: scores[1],
      making_judgements_score: scores[2],
      taking_action_score: scores[3],
      growth_focus: growthAreas.join(", ") || "none",
      responses: answers,
      self_explanations: selfExplanations,
    });
    if (error) {
      setSaveStatus("error");
    } else {
      void navigate("/module/3");
    }
  }

  function select(sIdx: number, qIdx: number, optIdx: number) {
    const k = key(sIdx, qIdx);
    setAnswers((prev) => (k in prev ? prev : { ...prev, [k]: optIdx }));
  }

  return (
    <ModuleLayout current={2}>
      <ModuleHeader
        eyebrow="Module 2 · Assess"
        title="Where are you right now?"
        description="Read each scenario and select the response that best matches what you would do. You will receive immediate feedback after each answer."
      />

      {/* Demo bar */}
      <div className="flex items-center gap-3 rounded-lg border border-accent/25 bg-accent-soft px-4 py-2.5 mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent shrink-0">
          Presentation
        </span>
        <span className="text-xs text-muted-foreground flex-1 min-w-0 hidden sm:block">
          Load sample answers to demonstrate scoring and the growth focus result.
        </span>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={() => { setAnswers(DEMO_MODULE2_ANSWERS); setSubmitted(false); }}
            className="text-xs font-bold text-accent border border-accent/30 bg-white rounded-md px-3 py-1.5 hover:bg-accent/5 active:scale-95 transition-all shadow-sm"
          >
            Load Demo Data
          </button>
          <button
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1"
          >
            Clear
          </button>
        </div>
      </div>

      {!submitted ? (
        <>
          {/* Sticky progress bar */}
          <div className="sticky top-[108px] z-30 -mx-5 px-5 py-3 bg-background/95 backdrop-blur-sm border-b border-border mb-8">
            <div className="flex items-center gap-3">
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
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                    <div className={`w-8 h-8 rounded-lg ${section.iconBg} ${section.iconColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="flex-1 font-bold text-primary text-base leading-tight min-w-0">
                      {section.dim}
                    </h2>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0",
                      sectionAnswered === 3 ? "bg-teal text-white" : "bg-muted text-muted-foreground",
                    )}>
                      {sectionAnswered} / 3
                    </span>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {section.questions.map((q, qIdx) => {
                      const selected = answers[key(sIdx, qIdx)];
                      const isAnswered = selected !== undefined;
                      const isCorrect = isAnswered && selected === q.correct;

                      return (
                        <div
                          key={qIdx}
                          className={cn(
                            "rounded-xl border border-l-4 bg-white shadow-card transition-all",
                            section.accentBorder,
                            isAnswered
                              ? isCorrect
                                ? "border-teal/40"
                                : "border-border/80"
                              : "border-border",
                          )}
                        >
                          {/* Question header */}
                          <div className="px-5 pt-5 pb-3">
                            <div className="flex items-center gap-2 mb-2.5">
                              <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                !isAnswered && "bg-primary-soft text-primary",
                                isAnswered && isCorrect && "bg-teal text-white",
                                isAnswered && !isCorrect && "bg-destructive text-white",
                              )}>
                                {isAnswered ? (isCorrect ? "✓" : "✗") : qIdx + 1}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Scenario {qIdx + 1}
                              </span>
                            </div>

                            {/* Scenario box */}
                            <div className="rounded-lg bg-muted/60 border border-border px-4 py-3 mb-3">
                              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                                Scenario
                              </p>
                              <p className="text-sm text-foreground leading-relaxed">{q.scenario}</p>
                            </div>

                            <p className="font-semibold text-primary text-sm leading-snug">{q.question}</p>
                          </div>

                          {/* Options */}
                          <div className={cn("px-5 space-y-2", !isAnswered && "pb-5")}>
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selected === optIdx;
                              const isCorrectOpt = optIdx === q.correct;

                              /* Styling after locking */
                              let optClass = "border-border hover:border-primary/30 hover:bg-muted/40 cursor-pointer";
                              let radioClass = "border-border bg-white";
                              let labelClass = "bg-muted text-muted-foreground";

                              if (isAnswered) {
                                if (isSelected && isCorrect) {
                                  // Selected and correct → teal
                                  optClass = "border-teal bg-teal-soft cursor-default";
                                  radioClass = "border-teal bg-teal";
                                  labelClass = "bg-teal text-white";
                                } else if (isSelected && !isCorrect) {
                                  // Selected but wrong → orange/red
                                  optClass = "border-destructive/50 bg-destructive/5 cursor-default";
                                  radioClass = "border-destructive bg-destructive";
                                  labelClass = "bg-destructive text-white";
                                } else if (!isSelected && isCorrectOpt) {
                                  // Not selected but is the correct answer → teal outline
                                  optClass = "border-teal/50 bg-teal-soft/50 cursor-default";
                                  radioClass = "border-teal bg-white";
                                  labelClass = "bg-teal/15 text-teal";
                                } else {
                                  // Other, unselected, wrong option → dimmed
                                  optClass = "border-border/40 bg-muted/20 opacity-50 cursor-default";
                                  radioClass = "border-border/40 bg-white";
                                  labelClass = "bg-muted/50 text-muted-foreground";
                                }
                              } else {
                                // Not yet answered — normal interactive state
                                if (isSelected) {
                                  optClass = "border-primary bg-primary-soft cursor-pointer";
                                  radioClass = "border-primary bg-primary";
                                  labelClass = "bg-primary text-white";
                                }
                              }

                              return (
                                <label
                                  key={optIdx}
                                  className={cn(
                                    "flex items-start gap-3 rounded-lg border p-3.5 transition-all select-none",
                                    optClass,
                                  )}
                                >
                                  {/* Custom radio */}
                                  <div className={cn(
                                    "mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    radioClass,
                                  )}>
                                    {(isSelected || (isAnswered && isCorrectOpt)) && (
                                      <span className={cn(
                                        "w-2 h-2 rounded-full block",
                                        isAnswered && isCorrectOpt && !isSelected ? "bg-teal" : "bg-white",
                                      )} />
                                    )}
                                  </div>
                                  <input
                                    type="radio"
                                    name={key(sIdx, qIdx)}
                                    className="sr-only"
                                    checked={isSelected}
                                    disabled={isAnswered}
                                    onChange={() => select(sIdx, qIdx, optIdx)}
                                  />
                                  <div className="flex items-start gap-2 min-w-0">
                                    <span className={cn(
                                      "shrink-0 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center mt-0.5 transition-all",
                                      labelClass,
                                    )}>
                                      {OPTION_LABELS[optIdx]}
                                    </span>
                                    <span className={cn(
                                      "text-sm leading-relaxed",
                                      isAnswered && !isSelected && !isCorrectOpt
                                        ? "text-muted-foreground"
                                        : "text-foreground",
                                    )}>
                                      {opt}
                                    </span>
                                    {isAnswered && isCorrectOpt && !isSelected && (
                                      <span className="ml-1 shrink-0 text-[10px] font-bold text-teal uppercase tracking-wide mt-1">
                                        correct answer
                                      </span>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                          </div>

                          {/* Inline feedback banner */}
                          {isAnswered && (
                            <div className={cn(
                              "mx-5 mb-5 mt-3 rounded-lg px-4 py-3 flex items-start gap-3",
                              isCorrect
                                ? "bg-teal-soft border border-teal/25"
                                : "bg-accent-soft border border-accent/25",
                            )}>
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              )}
                              <p className="text-sm leading-relaxed text-foreground">
                                {isCorrect ? q.feedbackCorrect : q.feedbackIncorrect}
                              </p>
                            </div>
                          )}
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
              onClick={() => void handleSubmit()}
              disabled={answered < TOTAL_QUESTIONS}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-card hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              Submit assessment
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <>
          <ResultsDashboard scores={scores} saveStatus={saveStatus} />

          {/* Self-explanation for Growth Areas */}
          {growthAreas.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 pb-1">
                <h3 className="text-sm font-bold text-primary">Before you practise</h3>
                <span className="text-xs text-muted-foreground">
                  {growthAreas.length === 1 ? "1 Growth Area" : `${growthAreas.length} Growth Areas`} to reflect on
                </span>
              </div>
              {growthAreas.map((dim) => {
                const content = DIM_CONTENT[dim as keyof typeof DIM_CONTENT];
                if (!content) return null;
                return (
                  <div key={dim} className="rounded-xl border border-accent/25 bg-white p-6 shadow-card">
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                        Growth Area
                      </span>
                      <span className="font-bold text-primary text-sm">{dim}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      What this means
                    </p>
                    <p className="text-sm text-foreground leading-relaxed mb-3">
                      {content.description}
                    </p>
                    <p className="text-xs font-semibold text-primary mb-2">Effective learners:</p>
                    <ul className="space-y-1.5 mb-5">
                      {content.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <p className="font-semibold text-primary text-sm mb-2">{content.question}</p>
                    <textarea
                      value={selfExplanations[dim] ?? ""}
                      onChange={(e) =>
                        setSelfExplanations((prev) => ({ ...prev, [dim]: e.target.value }))
                      }
                      rows={3}
                      placeholder="Type your explanation here…"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-y text-foreground placeholder:text-muted-foreground transition mb-4"
                    />
                    <div className="rounded-lg bg-muted/50 border border-border px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                        Example answer
                      </p>
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        {content.example}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Link
              to="/module/1"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Learn
            </Link>
            <div className="flex items-center gap-3">
              {saveStatus === "error" && (
                <>
                  <span className="text-xs text-muted-foreground">Could not save.</span>
                  <Link
                    to="/module/3"
                    className="inline-flex items-center gap-2 rounded-lg border border-accent/40 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/5 transition-all"
                  >
                    Continue anyway →
                  </Link>
                </>
              )}
              {saveStatus !== "error" && (
                <button
                  onClick={() => void handleContinue()}
                  disabled={saveStatus === "saving"}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-card hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  {saveStatus === "saving" ? "Saving…" : "Continue to Practice"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </ModuleLayout>
  );
}

/* ── Results dashboard ──────────────────────────────────────────────── */

function ResultsDashboard({ scores, saveStatus }: { scores: number[]; saveStatus: "idle" | "saving" | "saved" | "error" }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const classifications = scores.map(classifyScore);
  const growthDims = SECTIONS
    .filter((_, i) => classifications[i] === "growth")
    .map((s) => s.dim);

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
          {saveStatus === "saved" && (
            <p className="text-xs font-semibold text-teal mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Assessment saved.
            </p>
          )}
          {saveStatus === "error" && (
            <p className="text-xs text-muted-foreground mt-2">
              Could not save to database — your results are still shown below.
            </p>
          )}
        </div>
      </div>

      {/* Dimension scores */}
      <div>
        <h3 className="text-sm font-bold text-primary mb-3">Your dimension scores</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const score = scores[i] ?? 0;
            const classification = classifications[i] ?? "growth";
            return (
              <div
                key={section.dim}
                className={cn(
                  "rounded-xl border bg-white p-5 shadow-card",
                  classification === "strength" && "border-teal/40 ring-1 ring-teal/20",
                  classification === "developing" && "border-primary/30",
                  classification === "growth" && "border-accent/40 ring-1 ring-accent/20",
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${section.iconBg} ${section.iconColor} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="flex-1 font-semibold text-primary text-sm leading-tight min-w-0">
                    {section.dim}
                  </p>
                  <span className={cn(
                    "text-sm font-bold shrink-0",
                    score === 3 ? "text-teal" : score === 2 ? "text-primary" : "text-accent",
                  )}>
                    {score} / 3
                  </span>
                </div>

                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      score === 3 ? "bg-teal" : score === 2 ? "bg-primary" : "bg-accent",
                    )}
                    style={{ width: `${(score / 3) * 100}%` }}
                  />
                </div>

                <p className={cn(
                  "mt-2.5 text-[10px] font-bold uppercase tracking-widest",
                  classification === "strength" && "text-teal",
                  classification === "developing" && "text-primary",
                  classification === "growth" && "text-accent",
                )}>
                  {classification === "strength" && "Strength"}
                  {classification === "developing" && "Developing"}
                  {classification === "growth" && "Growth Area"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Growth areas / strength callout */}
      {growthDims.length > 0 ? (
        <div className="rounded-xl bg-accent-soft border border-accent/20 px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1.5">
            {growthDims.length === 1 ? "Your Growth Area" : "Your Growth Areas"}
          </p>
          <p className="font-bold text-primary text-base mb-1">
            {growthDims.join(" · ")}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {growthDims.length === 1 ? "This dimension" : "These dimensions"} may require additional attention as you move into Module 3.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-teal-soft border border-teal/20 px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-1.5">
            Excellent performance
          </p>
          <p className="font-bold text-primary text-base mb-1">
            You are strong across all dimensions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Module 3 will give you the opportunity to apply these strategies with real instructor feedback.
          </p>
        </div>
      )}
    </div>
  );
}
