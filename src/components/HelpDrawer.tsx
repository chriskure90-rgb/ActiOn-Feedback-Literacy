import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  ChevronDown,
  HelpCircle,
  Info,
  Mail,
  Rocket,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

/* ── Component ───────────────────────────────────────────────────────────── */

export function HelpDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>("getting-started");
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Focus close button when drawer opens */
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function toggle(id: string) {
    setActiveSection((prev) => (prev === id ? null : id));
  }

  return (
    <>
      {/* ── Floating trigger button ──────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Help Center"
          aria-haspopup="dialog"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_4px_16px_0_rgb(22_58_95/0.35)] hover:bg-primary/90 active:scale-[0.97] transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          Help
        </button>
      )}

      {/* ── Backdrop ────────────────────────────────────────────── */}
      <div
        role="presentation"
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* ── Drawer ──────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Help Center"
        className={cn(
          "fixed top-0 right-0 z-[60] h-full w-full sm:w-[440px] bg-white shadow-2xl flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-5 border-b border-primary/30 bg-primary">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/55 mb-0.5">
                Support
              </p>
              <h2 className="text-lg font-extrabold text-white">Help Center</h2>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={() => setIsOpen(false)}
            aria-label="Close Help Center"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2">

          {/* Q&A accordion sections */}
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <div
                key={section.id}
                className="rounded-xl border border-border overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={isActive}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left bg-white hover:bg-primary-soft/40 transition-colors"
                >
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                    section.iconBg, section.iconColor,
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 font-bold text-primary text-sm">
                    {section.title}
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                    isActive && "rotate-180",
                  )} />
                </button>

                {isActive && (
                  <div className="border-t border-border divide-y divide-border/60 px-4 bg-white">
                    {section.items.map((item) => (
                      <div key={item.q} className="py-4">
                        <p className="font-semibold text-primary text-sm mb-1.5">{item.q}</p>
                        <p className="text-sm text-muted-foreground leading-[1.7]">{item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Contact Your Instructor */}
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => toggle("contact")}
              aria-expanded={activeSection === "contact"}
              className="w-full flex items-center gap-3 px-4 py-4 text-left bg-white hover:bg-primary-soft/40 transition-colors"
            >
              <div className="shrink-0 w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <span className="flex-1 font-bold text-primary text-sm">
                Contact Your Instructor
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                activeSection === "contact" && "rotate-180",
              )} />
            </button>

            {activeSection === "contact" && (
              <div className="border-t border-border px-4 py-5 space-y-5 bg-white">
                <div>
                  <p className="font-bold text-primary text-sm mb-1.5">Need additional help?</p>
                  <p className="text-sm text-muted-foreground leading-[1.7]">
                    If your question is not answered in the Help Center, please contact your course instructor.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Your instructor can help with
                  </p>
                  <ul className="space-y-2">
                    {INSTRUCTOR_HELP.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-[5px] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="rounded-lg border border-border bg-primary-soft px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Instructor Email
                    </p>
                    <p className="text-sm font-medium text-primary">instructor@university.edu</p>
                  </div>
                  <div className="rounded-lg border border-border bg-primary-soft px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Office Hours
                    </p>
                    <p className="text-sm font-medium text-primary">By appointment</p>
                  </div>
                  <div className="rounded-lg border border-border bg-primary-soft px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Course Website
                    </p>
                    <p className="text-sm font-medium text-primary">See your LMS</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Drawer footer */}
        <div className="shrink-0 px-4 py-3 border-t border-border text-center text-xs text-muted-foreground">
          ActiOn · Feedback to Action · Adaptive Learning Prototype
        </div>
      </div>
    </>
  );
}
