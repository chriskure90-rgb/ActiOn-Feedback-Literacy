import { useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  ChevronDown,
  Info,
  Mail,
  Rocket,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LOGO_URL = "/logo.png";

/* ── Content ─────────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting Started",
    iconBg: "bg-accent-soft",
    iconColor: "text-accent",
    items: [
      {
        q: "How do I begin the learning modules?",
        a: "Start with Module 1 and complete each activity in order. Additional modules will become available as you progress.",
      },
      {
        q: "Do I need my assignment and instructor feedback?",
        a: "Yes. Module 3 uses your own assignment and instructor feedback to help you create a personalised improvement plan.",
      },
      {
        q: "Why can't I access the next module?",
        a: "Modules are unlocked after you complete all required activities in the previous module.",
      },
    ],
  },
  {
    id: "activities",
    icon: BookOpen,
    title: "Learning Activities",
    iconBg: "bg-primary-soft",
    iconColor: "text-primary",
    items: [
      {
        q: "What if I don't understand a question?",
        a: "Read the instructions carefully and answer based on your own understanding. There are no perfect answers — the goal is reflection and improvement.",
      },
      {
        q: "What should I write in the reflection activities?",
        a: "Focus on explaining your thinking, interpreting your instructor's feedback, and identifying specific actions you can take to improve your future work.",
      },
    ],
  },
  {
    id: "technical",
    icon: Settings,
    title: "Technical Support",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    items: [
      {
        q: "The page isn't loading correctly.",
        a: "Refresh your browser and ensure you have a stable internet connection.",
      },
      {
        q: "The AI response isn't appearing.",
        a: "Wait a few moments and try again. If the problem continues, refresh the page.",
      },
      {
        q: "Which browsers are supported?",
        a: "We recommend using the latest version of Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.",
      },
    ],
  },
  {
    id: "about",
    icon: Info,
    title: "About Feedback Literacy",
    iconBg: "bg-teal-soft",
    iconColor: "text-teal",
    items: [
      {
        q: "What is feedback literacy?",
        a: "Feedback literacy is the ability to understand, interpret, and use feedback to improve future work.",
      },
      {
        q: "Why do I need to reflect on feedback instead of just reading it?",
        a: "Simply reading feedback does not always lead to improvement. Reflection helps you understand the feedback and turn it into meaningful action.",
      },
      {
        q: "Is there a correct answer?",
        a: "No. These activities are designed to support your learning and encourage thoughtful reflection rather than identify one correct response.",
      },
    ],
  },
] as const;

const INSTRUCTOR_HELP = [
  "Questions about course activities",
  "Clarification of instructor feedback",
  "Technical issues that cannot be resolved through the Help Center",
  "Assignment-related questions",
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function Help() {
  const [open, setOpen] = useState<string | null>("getting-started");

  function toggle(id: string) {
    setOpen((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header — matches ModuleLayout style */}
      <header className="sticky top-0 z-40 border-b border-primary/30 bg-primary shadow-[0_2px_8px_0_rgb(22_58_95/0.35)]">
        <div className="mx-auto max-w-[900px] lg:max-w-[1100px] 2xl:max-w-[1280px] px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={LOGO_URL} alt="ActiOn logo" className="w-8 h-8 rounded-lg object-contain" />
            <div className="leading-none">
              <span className="text-sm font-bold text-white tracking-tight">ActiOn</span>
              <span className="hidden sm:block text-[11px] text-white/65 font-normal mt-0.5">
                Feedback to Action
              </span>
            </div>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            ← Back to course
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[760px] px-5 py-10 md:py-14">

        {/* Page heading */}
        <div className="mb-12">
          <p className="text-[11px] font-bold uppercase tracking-widest text-teal mb-3">Support</p>
          <h1 className="text-4xl md:text-[60px] font-extrabold text-primary tracking-tight leading-[1.1] mb-5">
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground leading-[1.75]">
            Find answers to common questions about the course, learning activities, and technical issues.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">

          {/* Q&A sections */}
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = open === section.id;
            return (
              <div
                key={section.id}
                className="rounded-xl border border-border bg-white shadow-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-primary-soft/40 transition-colors"
                >
                  <div className={cn(
                    "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                    section.iconBg, section.iconColor,
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="flex-1 font-bold text-primary text-lg">
                    {section.title}
                  </span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )} />
                </button>

                {isOpen && (
                  <div className="border-t border-border divide-y divide-border/60 px-6">
                    {section.items.map((item) => (
                      <div key={item.q} className="py-5">
                        <p className="font-semibold text-primary text-lg mb-2">{item.q}</p>
                        <p className="text-lg text-muted-foreground leading-[1.75]">{item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Contact Your Instructor */}
          <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
            <button
              type="button"
              onClick={() => toggle("contact")}
              aria-expanded={open === "contact"}
              className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-primary-soft/40 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <span className="flex-1 font-bold text-primary text-lg">
                Contact Your Instructor
              </span>
              <ChevronDown className={cn(
                "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
                open === "contact" && "rotate-180",
              )} />
            </button>

            {open === "contact" && (
              <div className="border-t border-border px-6 py-7 space-y-7">

                {/* Intro */}
                <div>
                  <p className="font-bold text-primary text-xl mb-2">Need additional help?</p>
                  <p className="text-lg text-muted-foreground leading-[1.75]">
                    If your question is not answered in the Help Center, please contact your course instructor.
                  </p>
                </div>

                {/* What the instructor can help with */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    Your instructor can help with
                  </p>
                  <ul className="space-y-2.5">
                    {INSTRUCTOR_HELP.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-lg text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact info cards */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-primary-soft px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      Instructor Email
                    </p>
                    <p className="text-base font-medium text-primary">
                      instructor@university.edu
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-primary-soft px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      Office Hours
                    </p>
                    <p className="text-base font-medium text-primary">
                      By appointment
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-primary-soft px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      Course Website
                    </p>
                    <p className="text-base font-medium text-primary">
                      See your LMS
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        <footer className="mt-16 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          ActiOn · Feedback to Action · Adaptive Learning Prototype
        </footer>
      </main>
    </div>
  );
}
