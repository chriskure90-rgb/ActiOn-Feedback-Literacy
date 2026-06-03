import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Compass,
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
    featured: false,
  },
  {
    num: 2,
    icon: ClipboardCheck,
    title: "Assess",
    text: "Take a short self-assessment to find your strengths and gaps.",
    path: "/module/2",
    featured: false,
  },
  {
    num: 3,
    icon: MessageSquareHeart,
    title: "Practice",
    text: "Work with an AI coach on real teacher feedback to build an improvement plan.",
    path: "/module/3",
    featured: true,
  },
  {
    num: 4,
    icon: Compass,
    title: "Transfer",
    text: "Apply what you learned to a future scenario and get personalised advice.",
    path: "/module/4",
    featured: false,
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
              <span className="hidden sm:block text-[10px] text-white/65 mt-0.5">
                Feedback to Action
              </span>
            </div>
          </div>
          <Link
            to="/module/1"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            Start course <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-4xl px-5 py-20 md:py-28 text-center">
        <img
          src={LOGO_URL}
          alt="ActiOn logo"
          className="mx-auto w-20 h-20 mb-7 object-contain drop-shadow"
        />
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal bg-teal-soft px-3 py-1.5 rounded-full mb-7">
          Adaptive learning · AI-supported
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-[1.15]">
          Turn feedback into{" "}
          <span className="text-accent">real action</span>.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          ActiOn is a four-step journey that helps university students read,
          reflect on, and act on the feedback they receive.
        </p>
        <div className="mt-9">
          <Link
            to="/module/1"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3 text-sm font-bold text-white shadow-card-md hover:bg-accent/90 active:scale-[0.98] transition-all"
          >
            Begin Module 1 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Module cards ── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-4 md:grid-cols-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.num}
                to={s.path}
                className={[
                  "group relative rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1",
                  s.featured
                    ? "border-primary/30 bg-primary shadow-card-md"
                    : "border-border bg-white shadow-card hover:shadow-card-md",
                ].join(" ")}
              >
                {s.featured && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-extrabold uppercase tracking-wider bg-accent text-white px-2.5 py-0.5 rounded-full shadow-sm">
                    Core
                  </span>
                )}
                <div className={[
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-4",
                  s.featured ? "bg-white/15 text-white" : "bg-primary-soft text-primary",
                ].join(" ")}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={[
                  "text-[10px] font-bold uppercase tracking-wider mb-1",
                  s.featured ? "text-white/60" : "text-muted-foreground",
                ].join(" ")}>
                  Module {s.num}
                </div>
                <div className={[
                  "font-bold text-base",
                  s.featured ? "text-white" : "text-primary",
                ].join(" ")}>
                  {s.title}
                </div>
                <p className={[
                  "mt-2 text-sm leading-relaxed",
                  s.featured ? "text-white/80" : "text-muted-foreground",
                ].join(" ")}>
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
