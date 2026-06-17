import { useState } from "react";
import { ChevronDown, Heart, Play, Rocket, Scale, ThumbsUp } from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";

const DIMENSIONS = [
  {
    icon: Heart,
    title: "Managing Affect",
    reference: "Carless & Boud (2018)",
    tagline: "How you respond emotionally to feedback affects how you use it.",
    why: "Students often experience frustration, disappointment, or defensiveness when receiving feedback. Carless and Boud argue that students must manage these emotions before they can effectively engage with feedback and use it for improvement.",
    howTo: [
      "Recognise your emotional reaction.",
      "Avoid focusing only on the grade.",
      "Stay open to learning from the feedback.",
    ],
    successLooks: [
      "You can identify how you feel.",
      "You remain willing to engage with the feedback.",
    ],
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentBorder: "border-l-rose-400",
    bulletColor: "text-rose-400",
    successColor: "text-rose-400",
    paper: {
      citation: "Carless, D., & Boud, D. (2018). The development of student feedback literacy: enabling uptake of feedback. Assessment & Evaluation in Higher Education, 43(8), 1315–1325.",
      excerpt: "Affect refers to feelings, emotions and attitudes. Students often exhibit defensive responses to feedback, particularly when comments are critical or grades are low. Under these circumstances, feedback often provokes negative affective reactions and threats to identity, so how students manage their emotional equilibrium impacts on their engagement with critical commentary. Critical feedback can have positive or negative impacts depending on a range of factors, including student self-efficacy, motivation and ability to handle emotions constructively.",
    },
  },
  {
    icon: ThumbsUp,
    title: "Appreciating Feedback",
    reference: "Winstone & Boud (2021)",
    tagline: "Understanding what your teacher is trying to communicate.",
    why: "Winstone and Boud argue that students should be active recipients of feedback rather than passive receivers. Feedback becomes useful only when students understand what the teacher is trying to communicate and what needs to be improved.",
    howTo: [
      "Explain the feedback in your own words.",
      "Identify what your teacher wants you to improve.",
      "Understand the gap between your current work and the expected standard.",
    ],
    successLooks: [
      "You can explain the feedback without copying it.",
      "You understand why the feedback was given.",
    ],
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-l-amber-400",
    bulletColor: "text-amber-400",
    successColor: "text-amber-400",
    paper: {
      citation: "Winstone, N. E., & Boud, D. (2021). The need to disentangle assessment and feedback in higher education. Studies in Higher Education. https://doi.org/10.1080/03075079.2020.1779687",
      excerpt: "Feedback is defined as 'processes where the learner makes sense of performance-relevant information to promote their learning'. In this sense, feedback is not about grade justification but forward-looking information that helps students further develop their work. Moving beyond current impasses requires a reframing of feedback away from a process driven by teachers, towards a learning-focused process where students are active players who work with and apply information from others to future learning tasks.",
    },
  },
  {
    icon: Scale,
    title: "Making Judgements",
    reference: "Panadero & Broadbent (2018)",
    tagline: "Deciding which feedback will have the greatest impact.",
    why: "Panadero and Broadbent argue that effective learners use evaluative judgement to determine what quality work looks like and what improvements should be prioritised. Students must decide which feedback will have the greatest impact on their learning.",
    howTo: [
      "Review all feedback points.",
      "Decide which one is most important.",
      "Explain why it should be prioritised.",
    ],
    successLooks: [
      "You can identify a priority feedback point.",
      "You can explain why it is the most important area for improvement.",
    ],
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentBorder: "border-l-sky-400",
    bulletColor: "text-sky-400",
    successColor: "text-sky-400",
    paper: {
      citation: "Panadero, E., & Broadbent, J. (2018). Developing evaluative judgement: A self-regulated learning perspective. In D. Boud, R. Ajjawi, P. Dawson, & J. Tai (Eds.), Developing Evaluative Judgement: Assessment for Knowing and Producing Quality Work. Routledge.",
      excerpt: "Evaluative judgement is the ability to assess a piece of work (one's own or that of others) while attending to the context, quality, standards and criteria built upon previous experience. To make an accurate and appropriate judgement the student needs to: (1) consider the context in which the performance is to be evaluated; (2) have an understanding of what a quality performance looks like; (3) consider the different standards and (4) assessment criteria.",
    },
  },
  {
    icon: Rocket,
    title: "Taking Action",
    reference: "Zimmerman (2002)",
    tagline: "Turning feedback into a concrete improvement plan.",
    why: "Zimmerman argues that successful self-regulated learners set goals, create strategies, and monitor their progress. Feedback only leads to improvement when students turn it into concrete action.",
    howTo: [
      "Set a clear improvement goal.",
      "Decide how you will achieve it.",
      "Plan how you will monitor your progress.",
    ],
    successLooks: [
      "You have a specific goal.",
      "You have a strategy.",
      "You know how you will check your progress.",
    ],
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    accentBorder: "border-l-teal",
    bulletColor: "text-teal",
    successColor: "text-teal",
    paper: {
      citation: "Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. Theory Into Practice, 41(2), 64–70.",
      excerpt: "Self-regulation is not a mental ability or an academic performance skill; rather it is the self-directive process by which learners transform their mental abilities into academic skills. Self-regulation refers to self-generated thoughts, feelings, and behaviors that are oriented to attaining goals. These learners are proactive in their efforts to learn because they are aware of their strengths and limitations and because they are guided by personally set goals and task-related strategies.",
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

      {/* ── Video Section ──────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-1">
          Instructional Video: What is Feedback Literacy?
        </h2>
        <p className="text-base text-muted-foreground mb-5 max-w-2xl leading-relaxed">
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
          <h2 className="text-2xl font-bold text-primary mb-1">
            How can you develop feedback literacy?
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
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
                    <p className="font-bold text-primary text-base">{dim.title}</p>
                    <p className="text-base text-muted-foreground mt-0.5 leading-snug line-clamp-1">
                      {dim.tagline}
                    </p>
                  </div>
                  <ChevronDown
                    className={`shrink-0 w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 border-t border-border space-y-5">
                    {/* Reference */}
                    <div className="mt-4">
                      <span className="inline-block text-sm font-bold uppercase tracking-widest bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                        {dim.reference}
                      </span>
                    </div>

                    {/* Why is this important */}
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-teal mb-2">
                        Why is this important?
                      </p>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {dim.why}
                      </p>
                    </div>

                    {/* What should you do */}
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-teal mb-2.5">
                        What should you do?
                      </p>
                      <ul className="space-y-2">
                        {dim.howTo.map((step) => (
                          <li key={step} className="flex items-start gap-2.5 text-base text-foreground">
                            <span className={`mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-current ${dim.bulletColor}`} />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Success looks like */}
                    <div className="rounded-lg bg-muted/50 border border-border px-4 py-3.5">
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                        Success looks like:
                      </p>
                      <ul className="space-y-1.5">
                        {dim.successLooks.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-base text-foreground">
                            <span className={`mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-current ${dim.successColor}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Research paper */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenPaperIndex(openPaperIndex === i ? null : i)}
                        className="flex items-center gap-1.5 text-base font-semibold text-teal hover:text-primary transition-colors"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openPaperIndex === i ? "rotate-180" : ""}`} />
                        {openPaperIndex === i ? "Hide research" : "Read the research"}
                      </button>

                      {openPaperIndex === i && (
                        <div className="mt-3 rounded-lg border border-border bg-primary-soft px-4 py-4 space-y-3">
                          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Source</p>
                          <p className="text-base text-muted-foreground leading-relaxed italic">{dim.paper.citation}</p>
                          <p className="text-sm font-bold uppercase tracking-widest text-teal">Key excerpt</p>
                          <p className="text-base text-foreground leading-relaxed">"{dim.paper.excerpt}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-base text-muted-foreground max-w-2xl leading-relaxed">
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
            <p className="text-sm font-bold uppercase tracking-widest text-teal mb-1.5">
              Module summary
            </p>
            <p className="text-base text-foreground leading-relaxed">
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
