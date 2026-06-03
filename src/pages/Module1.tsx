import { BookOpen, Heart, Play, Rocket, Scale, ThumbsUp } from "lucide-react";
import { ModuleLayout, ModuleHeader, NavFooter } from "@/components/ModuleLayout";

const FRAMEWORK = [
  {
    icon: Heart,
    title: "Managing Affect",
    desc: "Recognize and regulate emotional reactions to feedback so they don't block learning.",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accent: "border-l-rose-400",
  },
  {
    icon: ThumbsUp,
    title: "Appreciating Feedback",
    desc: "Value feedback as a resource, understand its purpose and the giver's intent.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accent: "border-l-amber-400",
  },
  {
    icon: Scale,
    title: "Making Judgments",
    desc: "Evaluate the quality of your own work and weigh feedback against criteria.",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accent: "border-l-sky-400",
  },
  {
    icon: Rocket,
    title: "Taking Action",
    desc: "Translate feedback into concrete next steps and revised work.",
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    accent: "border-l-teal",
  },
] as const;

export default function Module1() {
  return (
    <ModuleLayout current={1}>
      <ModuleHeader
        eyebrow="Module 1 · Learn"
        title="What is feedback literacy?"
        description="Build a shared foundation: what feedback literacy means, why it matters, and the four dimensions you'll develop across this course."
      />

      {/* Video + reading */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Video placeholder */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-white overflow-hidden shadow-card">
          <div className="aspect-video bg-gradient-to-br from-primary-soft via-muted to-teal-soft flex items-center justify-center relative">
            <div className="absolute inset-0 bg-primary/5" />
            <button
              className="relative w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-card-lg hover:scale-105 hover:bg-primary/90 transition-all"
              aria-label="Play introduction video"
            >
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            </button>
            <span className="absolute bottom-3 right-3 text-xs bg-white/90 text-primary font-medium px-2.5 py-1 rounded-full shadow-sm">
              6:32
            </span>
          </div>
          <div className="px-5 py-4 border-t border-border">
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-0.5">Lecture</p>
            <p className="font-semibold text-primary text-sm">Introduction to feedback literacy</p>
          </div>
        </div>

        {/* Reading card */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-white p-6 shadow-card flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Required Reading
          </div>
          <h3 className="font-bold text-primary text-base mb-1">Carless &amp; Boud (2018)</h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            The development of student feedback literacy: enabling uptake of feedback.
            A foundational paper introducing the four-dimension framework used in this course.
          </p>
          <div className="space-y-2 my-4" aria-hidden>
            <div className="h-1.5 rounded bg-muted" />
            <div className="h-1.5 rounded bg-muted w-11/12" />
            <div className="h-1.5 rounded bg-muted w-9/12" />
            <div className="h-1.5 rounded bg-muted w-10/12" />
          </div>
          <button className="inline-flex items-center gap-1.5 text-sm font-bold text-teal hover:text-teal/80 transition-colors mt-auto">
            Open reading →
          </button>
        </div>
      </div>

      {/* Four dimensions */}
      <div className="mt-12 mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">The four dimensions</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          Carless &amp; Boud framework
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {FRAMEWORK.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className={`rounded-xl border border-border border-l-4 ${f.accent} bg-white p-6 shadow-card hover:shadow-card-md transition-shadow`}
            >
              <div className={`w-9 h-9 rounded-lg ${f.iconBg} ${f.iconColor} flex items-center justify-center mb-3`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-primary mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <NavFooter
        prev={{ path: "/", label: "Home" }}
        next={{ path: "/module/2", label: "Continue to Assessment" }}
      />
    </ModuleLayout>
  );
}
