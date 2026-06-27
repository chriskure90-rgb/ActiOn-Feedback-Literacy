import { useEffect } from "react";

interface WelcomeModalProps {
  onDismiss: () => void;
}

const PROGRAM_MODULES = [
  {
    num: 1,
    label: "Module 1 – Learn",
    description:
      "Learn the four dimensions of Feedback Literacy and build a foundation for using feedback effectively.",
  },
  {
    num: 2,
    label: "Module 2 – Assess",
    description:
      "Assess your current Feedback Literacy skills and identify your strengths and areas for growth.",
  },
  {
    num: 3,
    label: "Module 3 – Practice",
    description:
      "Practice applying feedback to one of your own assignments with the support of an AI coach and create a personalised revision plan.",
  },
  {
    num: 4,
    label: "Module 4 – Transfer",
    description:
      "Transfer what you have learned to future assignments through a new feedback scenario.",
  },
];

export function WelcomeModal({ onDismiss }: WelcomeModalProps) {
  // Prevent background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-foreground/55 backdrop-blur-sm"
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-card-lg overflow-hidden flex flex-col max-h-[90vh]">

        {/* Navy header bar */}
        <div className="bg-primary px-6 py-5 shrink-0 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="ActiOn logo"
            className="w-9 h-9 rounded-xl object-contain shrink-0"
          />
          <div className="leading-none">
            <h2
              id="welcome-modal-title"
              className="text-lg font-extrabold text-white tracking-tight"
            >
              Welcome to ActiOn
            </h2>
            <p className="text-xs text-white/60 mt-1">Feedback to Action</p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6">

          {/* Intro paragraphs */}
          <div className="space-y-3">
            <p className="text-lg text-foreground leading-relaxed">
              Welcome to <strong>ActiOn</strong> (Feedback to Action).
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In this learning experience, you will develop the skills to understand instructor
              feedback and turn it into meaningful improvements for future assignments.
            </p>
          </div>

          {/* Module list */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-teal mb-4">
              During this program, you will:
            </p>
            <ul className="space-y-4">
              {PROGRAM_MODULES.map((m) => (
                <li key={m.num} className="flex gap-3 items-start">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {m.num}
                  </div>
                  <div>
                    <p className="text-base font-bold text-primary leading-tight">
                      {m.label}
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed mt-1">
                      {m.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Ready prompt */}
          <p className="text-lg font-semibold text-foreground">
            Ready to begin?
          </p>
        </div>

        {/* Footer with actions */}
        <div className="border-t border-border px-6 py-4 shrink-0 flex items-center justify-between gap-4 flex-wrap bg-white">
          <button
            type="button"
            onClick={onDismiss}
            className="text-base text-muted-foreground hover:text-primary transition-colors"
          >
            Don&apos;t show again this session
          </button>
          <button
            type="button"
            onClick={onDismiss}
            autoFocus
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-base font-bold text-white shadow-card hover:bg-accent/90 active:scale-[0.98] transition-all"
          >
            Start Learning →
          </button>
        </div>
      </div>
    </div>
  );
}
