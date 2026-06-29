import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Compass,
  FileText,
  HelpCircle,
  MessageSquareHeart,
} from "lucide-react";

const LOGO_URL = "/logo.png";

const STEPS = [
  {
    num: 1,
    icon: BookOpen,
    title: "Learn",
    text: "Understand what feedback literacy is and the four core dimensions.",
    path: "/module/1",
    core: false,
    topBorder: "border-t-sky-400",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    labelColor: "text-sky-500",
  },
  {
    num: 2,
    icon: ClipboardCheck,
    title: "Assess",
    text: "Take a short self-assessment to find your strengths and gaps.",
    path: "/module/2",
    core: false,
    topBorder: "border-t-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    labelColor: "text-blue-600",
  },
  {
    num: 3,
    icon: MessageSquareHeart,
    title: "Practice",
    text: "Work with an AI coach on real teacher feedback to build an improvement plan.",
    path: "/module/3",
    core: true,
    topBorder: "border-t-primary",
    iconBg: "bg-primary-soft",
    iconColor: "text-primary",
    labelColor: "text-primary",
  },
  {
    num: 4,
    icon: Compass,
    title: "Transfer",
    text: "Apply what you learned to a future scenario and get personalised advice.",
    path: "/module/4",
    core: false,
    topBorder: "border-t-teal",
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    labelColor: "text-teal",
  },
] as const;

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Top nav ── */}
      <header className="border-b border-primary/30 bg-primary shadow-[0_2px_8px_0_rgb(22_58_95/0.35)]">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={LOGO_URL}
              alt="ActiOn logo"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <div className="leading-none">
              <span className="text-sm font-bold text-white tracking-tight">ActiOn</span>
              <span className="hidden sm:block text-[11px] text-white/65 mt-0.5">
                Feedback to Action
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/help"
              title="Help Center"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </Link>
            <Link
              to="/module/1"
              className="inline-flex items-center gap-1.5 text-base font-semibold text-white hover:text-white/80 transition-colors"
            >
              Start course <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-4xl px-5 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
        <img
          src={LOGO_URL}
          alt="ActiOn logo"
          className="mx-auto w-20 h-20 mb-7 object-contain drop-shadow"
        />
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-teal bg-teal-soft px-3 py-1.5 rounded-full mb-7">
          Adaptive learning · AI-supported
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-[1.15]">
          Turn feedback into{" "}
          <span className="text-accent">real action</span>.
        </h1>
        <p className="mt-5 text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          ActiOn helps university students read, reflect on, and act on the
          feedback they receive. Choose your pathway below.
        </p>
      </section>

      {/* ── Pathway cards ── */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Pathway 1 — Learning modules */}
          <div className="relative rounded-xl border border-primary/30 bg-primary shadow-card-md flex flex-col p-7">
            <span className="absolute -top-2.5 right-4 text-[10px] font-extrabold uppercase tracking-wider bg-accent text-white px-2.5 py-0.5 rounded-full shadow-sm">
              Guided
            </span>
            <div className="w-12 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight mb-2">
              Start Learning Module
            </h2>
            <p className="text-base text-white/75 leading-relaxed flex-1 mb-6">
              Learn feedback literacy through guided lessons, scenario-based
              practice, AI-supported action planning, and transfer activities.
            </p>
            <Link
              to="/module/1"
              className="inline-flex items-center gap-2 self-start rounded-lg bg-accent px-6 py-2.5 text-base font-bold text-white shadow-card hover:bg-accent/90 active:scale-[0.98] transition-all"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pathway 2 — Worksheet */}
          <div className="relative rounded-xl border border-border bg-white shadow-card-md flex flex-col p-7">
            <span className="absolute -top-2.5 right-4 text-[10px] font-extrabold uppercase tracking-wider bg-teal text-white px-2.5 py-0.5 rounded-full shadow-sm">
              Tool
            </span>
            <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-primary tracking-tight mb-2">
              Open Feedback Worksheet
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed flex-1 mb-6">
              Use the feedback literacy framework with your own assignment
              feedback to create a concrete improvement plan.
            </p>
            <Link
              to="/worksheet"
              className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-6 py-2.5 text-base font-bold text-white shadow-card hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Open Worksheet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Module steps ── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            What's inside the learning module
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.num}
                to={s.path}
                className={`group relative rounded-xl border-t-4 border border-border bg-white shadow-card hover:shadow-card-md hover:-translate-y-1 transition-all duration-200 p-6 ${s.topBorder}`}
              >
                {s.core && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-extrabold uppercase tracking-wider bg-accent text-white px-2.5 py-0.5 rounded-full shadow-sm">
                    Core
                  </span>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${s.iconBg} ${s.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${s.labelColor}`}>
                  Module {s.num}
                </div>
                <div className="font-bold text-lg text-primary">
                  {s.title}
                </div>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
