import { useState } from "react";
import { ChevronDown, Heart, Play, Rocket, Scale, ThumbsUp } from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";

const DIMENSIONS = [
  {
    icon: Heart,
    title: "Managing Affect",
    reference: "Carless & Boud (2018)",
    tagline: "Recognising your emotional response so you can use feedback productively.",
    why: "Students often react emotionally to feedback before they can learn from it. Carless and Boud found that managing this response is the first step toward engaging productively. Your reaction is normal — the goal is to not let it stop you from engaging.",
    steps: [
      "Notice how you feel when you read the feedback.",
      "Set the grade aside and focus on the written comments.",
      "Identify one area the feedback is asking you to improve.",
    ],
    successLooks: [
      "You can name your emotional reaction to the feedback.",
      "You remain open to engaging with the feedback.",
    ],
    prepareQuestions: [
      "How did I feel when I first received this feedback?",
      "Can I look at the comments without focusing on the grade?",
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
    why: "Feedback only works when you understand what it means and why it was given. Winstone and Boud argue that students who can interpret instructor intentions are far more likely to improve. Simply reading the feedback is not enough — you need to make sense of it.",
    steps: [
      "Read the feedback carefully.",
      "Explain it in your own words.",
      "Identify the gap between your work and the expected standard.",
    ],
    successLooks: [
      "You can explain the feedback without copying it.",
      "You understand why the feedback was given.",
    ],
    prepareQuestions: [
      "Can I explain the feedback in my own words?",
      "Do I understand why my instructor gave this feedback?",
    ],
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-l-amber-400",
    paper: {
      citation: "Winstone, N. E., & Boud, D. (2021). The need to disentangle assessment and feedback in higher education. Studies in Higher Education. https://doi.org/10.1080/03075079.2020.1779687",
      excerpt: "Feedback is defined as 'processes where the learner makes sense of performance-relevant information to promote their learning'. In this sense, feedback is not about grade justification but forward-looking information that helps students further develop their work. Moving beyond current impasses requires a reframing of feedback towards a learning-focused process where students are active players who work with and apply information from others to future learning tasks.",
    },
  },
  {
    icon: Scale,
    title: "Making Judgements",
    reference: "Panadero & Broadbent (2018)",
    tagline: "Deciding which feedback will have the greatest impact on your improvement.",
    why: "Not all feedback is equally important. Panadero and Broadbent argue that effective learners use evaluative judgement to decide which feedback to prioritise. Choosing the right feedback point — and being able to explain why — is a skill you can develop.",
    steps: [
      "Review all of the feedback you received.",
      "Choose the single most important point to act on.",
      "Explain why it will have the greatest impact.",
    ],
    successLooks: [
      "You can identify your priority feedback point.",
      "You can explain why it is the most important area for improvement.",
    ],
    prepareQuestions: [
      "Which single feedback point will improve my work the most?",
      "Can I explain why I chose this as my priority?",
    ],
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentBorder: "border-l-sky-400",
    paper: {
      citation: "Panadero, E., & Broadbent, J. (2018). Developing evaluative judgement: A self-regulated learning perspective. In D. Boud, R. Ajjawi, P. Dawson, & J. Tai (Eds.), Developing Evaluative Judgement: Assessment for Knowing and Producing Quality Work. Routledge.",
      excerpt: "Evaluative judgement is the ability to assess a piece of work (one's own or that of others) while attending to the context, quality, standards and criteria built upon previous experience. To make an accurate and appropriate judgement the student needs to consider the context, quality, standards, and assessment criteria.",
    },
  },
  {
    icon: Rocket,
    title: "Taking Action",
    reference: "Zimmerman (2002)",
    tagline: "Turning feedback into a concrete plan for improvement.",
    why: "Feedback without action changes nothing. Zimmerman argues that self-regulated learners set goals, create strategies, and monitor their own progress. Turning feedback into a concrete plan is what separates improvement from intention.",
    steps: [
      "Set a specific improvement goal based on the feedback.",
      "Decide on a strategy to achieve it.",
      "Plan how you will check your own progress.",
    ],
    successLooks: [
      "You have a specific improvement goal.",
      "You have a strategy and a way to monitor your progress.",
    ],
    prepareQuestions: [
      "Do I have a clear and specific improvement goal?",
      "Do I know how I will check whether I have improved?",
    ],
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    accentBorder: "border-l-teal",
    paper: {
      citation: "Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. Theory Into Practice, 41(2), 64–70.",
      excerpt: "Self-regulation is not a mental ability or an academic performance skill; rather it is the self-directive process by which learners transform their mental abilities into academic skills. Self-regulation refers to self-generated thoughts, feelings, and behaviors that are oriented to attaining goals. These learners are proactive because they are aware of their strengths and limitations and guided by personally set goals and task-related strategies.",
    },
  },
];

export default function Module1() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openPaperIndex, setOpenPaperIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <ModuleLayout current={1}>
      <ModuleHeader
        eyebrow="Module 1 · Learn"
        title="What is feedback literacy?"
        description="Build a shared foundation: what feedback literacy means, why it matters, and the four dimensions you'll develop across this course."
      />

      {/* ── Video ──────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Instructional Video
        </h2>
        <p className="text-base text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          This short video introduces feedback literacy and explains why it matters for using instructor feedback effectively.
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

      {/* ── Dimension sections ─────────────────────────────────────── */}
      <section className="mb-16">
        <div className="space-y-16">
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
                  className="w-full flex items-center gap-4 pl-5 pr-2 py-3 text-left"
                >
                  <div className={`shrink-0 w-10 h-10 rounded-xl ${dim.iconBg} ${dim.iconColor} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-primary leading-tight">{dim.title}</h3>
                    <p className="text-base text-muted-foreground mt-0.5 leading-snug">{dim.tagline}</p>
                  </div>
                  <ChevronDown className={`shrink-0 w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="pl-5 pr-2 pb-6 space-y-8">

                    {/* Reference chip */}
                    <span className="inline-block text-sm font-medium bg-muted text-muted-foreground px-3 py-1 rounded-full">
                      {dim.reference}
                    </span>

                    {/* Why is this important */}
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-teal mb-3">
                        Why is this important?
                      </p>
                      <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                        {dim.why}
                      </p>
                    </div>

                    {/* What should you do — flow */}
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-teal mb-4">
                        What should you do?
                      </p>
                      <div className="max-w-lg space-y-3">
                        {dim.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-3">
                            <div className={`shrink-0 w-7 h-7 rounded-full ${dim.iconBg} ${dim.iconColor} text-sm font-bold flex items-center justify-center`}>
                              {sIdx + 1}
                            </div>
                            <p className="text-base text-foreground">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Success looks like */}
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-teal mb-3">
                        Success looks like
                      </p>
                      <div className="space-y-2.5 max-w-lg">
                        {dim.successLooks.map((item) => (
                          <p key={item} className="text-base text-foreground">{item}</p>
                        ))}
                      </div>
                    </div>

                    {/* Research paper toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenPaperIndex(isPaperOpen ? null : i)}
                        className="flex items-center gap-1.5 text-base font-semibold text-teal hover:text-primary transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isPaperOpen ? "rotate-180" : ""}`} />
                        {isPaperOpen ? "Hide research" : "Read the research"}
                      </button>

                      {isPaperOpen && (
                        <div className="mt-4 rounded-lg border border-border bg-primary-soft px-5 py-5 space-y-4 max-w-2xl">
                          <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Source</p>
                            <p className="text-base text-muted-foreground leading-relaxed italic">{dim.paper.citation}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-teal mb-1.5">Key excerpt</p>
                            <p className="text-base text-foreground leading-relaxed">"{dim.paper.excerpt}"</p>
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

      {/* ── Module summary ─────────────────────────────────────────── */}
      <section className="mb-4">
        <div className="rounded-xl bg-primary-soft border border-primary/10 px-6 py-5 flex gap-4 items-start shadow-card">
          <div className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center mt-0.5">
            <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-teal mb-1.5">
              Module summary
            </p>
            <p className="text-base text-foreground leading-relaxed">
              You have explored the four dimensions of feedback literacy. In Module 2, you will assess your current strengths and areas for growth across these dimensions. In Module 3, you will work with an AI coach to turn your feedback into a concrete action plan.
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
