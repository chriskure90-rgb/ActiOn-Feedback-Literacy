import { useState } from "react";
import { ChevronDown, Heart, Play, Rocket, Scale, ThumbsUp } from "lucide-react";
import { ModuleLayout, NavFooter } from "@/components/ModuleLayout";
import { WelcomeModal } from "@/components/WelcomeModal";

const DIMENSIONS = [
  {
    icon: Heart,
    title: "Managing Affect",
    reference: "Carless & Boud (2018)",
    tagline: "Recognising your emotional response so you can use feedback productively.",
    why: "Students often react emotionally to feedback before they can learn from it. Recognising those emotions helps you stay engaged and use feedback productively.",
    steps: [
      "Notice how you feel when you read the feedback.",
      "Set the grade aside and focus on the written comments.",
      "Identify one area the feedback is asking you to improve.",
    ],
    successLooks: [
      "You can identify your emotional reaction to the feedback.",
      "You remain open to engaging with the feedback.",
    ],
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentBorder: "border-l-rose-400",
    paper: {
      citation: "Carless, D., & Boud, D. (2018). The development of student feedback literacy: enabling uptake of feedback. Assessment & Evaluation in Higher Education, 43(8), 1315–1325.",
      excerpt: "Affect refers to feelings, emotions and attitudes. Students often exhibit defensive responses to feedback, particularly when comments are critical or grades are low. Under these circumstances, feedback often provokes negative affective reactions and threats to identity, so how students manage their emotional equilibrium impacts on their engagement with critical commentary.",
    },
  },
  {
    icon: ThumbsUp,
    title: "Appreciating Feedback",
    reference: "Winstone & Boud (2021)",
    tagline: "Understanding what your instructor is communicating and why.",
    why: "Feedback only works when you understand what it means and why it was given. Students who can interpret instructor intentions are far more likely to improve their work.",
    steps: [
      "Read the feedback carefully.",
      "Explain it in your own words.",
      "Identify the gap between your work and the expected standard.",
    ],
    successLooks: [
      "You can explain the feedback without copying it.",
      "You understand why the feedback was given.",
    ],
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-l-amber-400",
    paper: {
      citation: "Winstone, N. E., & Boud, D. (2021). The need to disentangle assessment and feedback in higher education. Studies in Higher Education. https://doi.org/10.1080/03075079.2020.1779687",
      excerpt: "Feedback is defined as 'processes where the learner makes sense of performance-relevant information to promote their learning'. In this sense, feedback is not about grade justification but forward-looking information that helps students further develop their work.",
    },
  },
  {
    icon: Scale,
    title: "Making Judgements",
    reference: "Panadero & Broadbent (2018)",
    tagline: "Deciding which feedback will have the greatest impact on your improvement.",
    why: "Not all feedback is equally important. Effective learners use evaluative judgement to decide which feedback will have the greatest impact on their work.",
    steps: [
      "Review all of the feedback you received.",
      "Choose the single most important point to act on.",
      "Explain why it will have the greatest impact.",
    ],
    successLooks: [
      "You can identify your priority feedback point.",
      "You can explain why it is the most important area to improve.",
    ],
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentBorder: "border-l-sky-400",
    paper: {
      citation: "Panadero, E., & Broadbent, J. (2018). Developing evaluative judgement: A self-regulated learning perspective. In D. Boud, R. Ajjawi, P. Dawson, & J. Tai (Eds.), Developing Evaluative Judgement: Assessment for Knowing and Producing Quality Work. Routledge.",
      excerpt: "Evaluative judgement is the ability to assess a piece of work (one's own or that of others) while attending to the context, quality, standards and criteria built upon previous experience.",
    },
  },
  {
    icon: Rocket,
    title: "Taking Action",
    reference: "Zimmerman (2002)",
    tagline: "Turning feedback into a concrete plan for improvement.",
    why: "Feedback without action changes nothing. Self-regulated learners set goals, create strategies, and monitor their own progress toward improvement.",
    steps: [
      "Set a specific improvement goal based on the feedback.",
      "Decide on a strategy to achieve it.",
      "Plan how you will check your own progress.",
    ],
    successLooks: [
      "You have a specific improvement goal.",
      "You have a strategy and a way to monitor your progress.",
    ],
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    accentBorder: "border-l-teal",
    paper: {
      citation: "Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. Theory Into Practice, 41(2), 64–70.",
      excerpt: "Self-regulation is not a mental ability or an academic performance skill; rather it is the self-directive process by which learners transform their mental abilities into academic skills.",
    },
  },
];

const SESSION_KEY = "action-welcome-seen";

export default function Module1() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openPaperIndex, setOpenPaperIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) !== "true";
    } catch {
      return false;
    }
  });

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  function dismissModal() {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // sessionStorage unavailable — silently ignore
    }
    setShowModal(false);
  }

  return (
    <ModuleLayout current={1}>
      {showModal && <WelcomeModal onDismiss={dismissModal} />}
      <div className="max-w-4xl mx-auto">

        {/* ── Compact hero ─────────────────────────────────────── */}
        <div className="mb-4 max-w-[720px]">
          <p className="text-xs font-bold uppercase tracking-widest text-teal mb-2">
            Module 1 · Learn
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight mb-2">
            What is Feedback Literacy?
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Learn how to understand instructor feedback and use it to improve future assignments.
          </p>
        </div>

        {/* ── Video ────────────────────────────────────────────── */}
        <section className="mb-8">
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

        {/* ── Section divider ──────────────────────────────────── */}
        <div className="mb-10">
          <div className="h-px bg-border mb-4" />
          <p className="text-sm text-center text-muted-foreground">
            Continue below to explore the four dimensions of Feedback Literacy.
          </p>
          <p className="text-center text-muted-foreground/40 mt-1.5 text-sm select-none" aria-hidden="true">
            ↓
          </p>
        </div>

        {/* ── Dimension sections ───────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-primary mb-12">
            The four dimensions
          </h2>

          <div className="space-y-12">
            {DIMENSIONS.map((dim, i) => {
              const Icon = dim.icon;
              const isOpen = openIndex === i;
              const isPaperOpen = openPaperIndex === i;
              return (
                <div key={dim.title} className={`border-l-4 ${dim.accentBorder}`}>

                  {/* Toggle header */}
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-5 pl-6 pr-3 py-5 text-left"
                  >
                    <div className={`shrink-0 w-14 h-14 rounded-xl ${dim.iconBg} ${dim.iconColor} flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[30px] font-bold text-primary leading-tight">{dim.title}</h3>
                      <p className="text-xl text-muted-foreground mt-2">{dim.tagline}</p>
                    </div>
                    <ChevronDown className={`shrink-0 w-6 h-6 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="pl-6 pr-3 pt-4 pb-12 space-y-12">

                      {/* Why is this important */}
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-teal mb-4">
                          Why is this important?
                        </p>
                        <p className="text-xl text-muted-foreground leading-[1.7] mb-3">
                          {dim.why}
                        </p>
                        <p className="text-base text-muted-foreground italic">
                          ({dim.reference})
                        </p>
                      </div>

                      {/* What should you do */}
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-teal mb-6">
                          What should you do?
                        </p>
                        <div className="space-y-4">
                          {dim.steps.map((step, sIdx) => (
                            <div key={sIdx}>
                              <div className="flex items-center gap-4">
                                <div className={`shrink-0 w-9 h-9 rounded-full ${dim.iconBg} ${dim.iconColor} text-base font-bold flex items-center justify-center`}>
                                  {sIdx + 1}
                                </div>
                                <p className="text-xl text-foreground">{step}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Success looks like */}
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-teal mb-5">
                          Success looks like
                        </p>
                        <div className="space-y-4">
                          {dim.successLooks.map((item) => (
                            <p key={item} className="text-xl text-foreground">{item}</p>
                          ))}
                        </div>
                      </div>

                      {/* Research paper toggle */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setOpenPaperIndex(isPaperOpen ? null : i)}
                          className="flex items-center gap-2 text-lg font-semibold text-teal hover:text-primary transition-colors"
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isPaperOpen ? "rotate-180" : ""}`} />
                          {isPaperOpen ? "Hide research" : "Read the research"}
                        </button>

                        {isPaperOpen && (
                          <div className="mt-5 rounded-lg border border-border bg-primary-soft px-6 py-6 space-y-5">
                            <div>
                              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Source</p>
                              <p className="text-lg text-muted-foreground leading-[1.7] italic">{dim.paper.citation}</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold uppercase tracking-widest text-teal mb-2">Key excerpt</p>
                              <p className="text-xl text-foreground leading-[1.7]">"{dim.paper.excerpt}"</p>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>

        {/* ── Module summary ───────────────────────────────────── */}
        <section className="mb-4">
          <div className="rounded-xl bg-primary-soft border border-primary/10 px-7 py-6 flex gap-5 items-start shadow-card">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center mt-0.5">
              <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-teal mb-2">
                Module summary
              </p>
              <p className="text-xl text-foreground leading-[1.7]">
                You have explored the four dimensions of feedback literacy. In Module 2, you will assess your current strengths and areas for growth. In Module 3, you will work with an AI coach to turn your feedback into a concrete action plan.
              </p>
            </div>
          </div>
        </section>

        <NavFooter
          prev={{ path: "/", label: "Home" }}
          next={{ path: "/module/2", label: "Continue to Assessment" }}
        />

      </div>
    </ModuleLayout>
  );
}
