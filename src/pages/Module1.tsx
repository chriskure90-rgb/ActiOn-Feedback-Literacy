import { useState } from "react";
import { ChevronDown, Heart, Play, Rocket, Scale, ThumbsUp } from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";

const DIMENSIONS = [
  {
    icon: Heart,
    title: "Managing Affect",
    explanation:
      "Managing affect means recognising emotional reactions to feedback and preventing them from blocking learning.",
    howTo: [
      "Think about how the feedback makes you feel.",
      "Ask yourself: Do I feel frustrated, disappointed, embarrassed, or encouraged?",
      "Identify your emotions before deciding how to respond.",
      "Consider whether your emotional reaction might affect how you interpret the feedback.",
    ],
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentBorder: "border-l-rose-400",
    bulletColor: "text-rose-400",
  },
  {
    icon: ThumbsUp,
    title: "Appreciating Feedback",
    explanation:
      "Appreciating feedback means understanding that feedback is information designed to support learning, not a personal attack.",
    howTo: [
      "Read through the teacher's comments carefully.",
      "Write down what the teacher commented on.",
      "Write down what improvements were suggested.",
      "Focus on understanding the purpose behind the feedback.",
    ],
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-l-amber-400",
    bulletColor: "text-amber-400",
  },
  {
    icon: Scale,
    title: "Making Judgements",
    explanation:
      "Making judgements means deciding which feedback points are most useful, relevant, and important for improvement.",
    howTo: [
      "Review the list of feedback points you identified.",
      "Decide which comments are most important for improving the quality of your assignment.",
      "Prioritise the feedback that will have the greatest impact on your learning and performance.",
      "Choose one or two feedback points to focus on first.",
    ],
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentBorder: "border-l-sky-400",
    bulletColor: "text-sky-400",
  },
  {
    icon: Rocket,
    title: "Taking Action",
    explanation:
      "Taking action means transforming feedback into a specific improvement plan.",
    howTo: [
      "Choose one or two priority improvement areas.",
      "Create a simple action plan with a specific improvement goal.",
      "Include concrete actions to take and a realistic timeline.",
      "Use this plan to guide your next revision or assignment.",
    ],
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    accentBorder: "border-l-teal",
    bulletColor: "text-teal",
  },
];

export default function Module1() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <ModuleLayout current={1}>
      <ModuleHeader
        eyebrow="Module 1 · Learn"
        title="What is feedback literacy?"
        description="Build a shared foundation: what feedback literacy means, why it matters, and the four dimensions you'll develop across this course."
      />

      {/* ── Video Section ──────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-primary mb-1">
          Instructional Video: What is Feedback Literacy?
        </h2>
        <p className="text-sm text-muted-foreground mb-5 max-w-2xl leading-relaxed">
          This short video introduces feedback literacy and explains why it is important for using instructor feedback effectively.
        </p>

        <div className="rounded-xl border border-border bg-white overflow-hidden shadow-card">
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/pwgXzrRnj3c"
              title="Instructional Video: What is Feedback Literacy?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ── Reading Section ────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary mb-1">
            How can you develop feedback literacy?
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            The video introduced the four dimensions of feedback literacy. This reading explains what you can actually do when you receive feedback.
          </p>
        </div>

        <div className="space-y-3">
          {DIMENSIONS.map((dim, i) => {
            const Icon = dim.icon;
            const isOpen = openIndex === i;
            return (
              <div
                key={dim.title}
                className={`rounded-xl border border-border border-l-4 ${dim.accentBorder} bg-white overflow-hidden transition-shadow ${isOpen ? "shadow-card-md" : "shadow-card"}`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-primary-soft/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className={`shrink-0 w-9 h-9 rounded-lg ${dim.iconBg} ${dim.iconColor} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary text-sm">{dim.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-1">
                      {dim.explanation}
                    </p>
                  </div>
                  <ChevronDown
                    className={`shrink-0 w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-4">
                      {dim.explanation}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2.5">
                      What to do
                    </p>
                    <ul className="space-y-2">
                      {dim.howTo.map((step) => (
                        <li key={step} className="flex items-start gap-2.5 text-sm text-foreground">
                          <span className={`mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-current ${dim.bulletColor}`} />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          These strategies will prepare you for Module 2, where you will reflect on your own feedback literacy strengths and areas for growth.
        </p>
      </section>

      {/* ── Summary / Bridge to Module 2 ──────────────────────────── */}
      <section className="mb-4">
        <div className="rounded-xl bg-primary-soft border border-primary/10 px-6 py-5 flex gap-4 items-start shadow-card">
          <div className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center mt-0.5">
            <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-1.5">
              Module summary
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              In this module, you learned what feedback literacy is and explored practical strategies for developing each dimension. In the next module, you will assess your current strengths and areas for growth across these four dimensions.
            </p>
          </div>
        </div>
      </section>

      <NavFooter
        prev={{ path: "/", label: "Home" }}
        next={{ path: "/module/2", label: "Continue to Assessment" }}
      />
    </ModuleLayout>
  );
}
