import { Link } from "react-router";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { MODULES } from "../lib/constants";

/* ─── Types ──────────────────────────────────────────────────── */

interface ModuleLayoutProps {
  current: number;
  children: ReactNode;
}
interface ModuleHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}
interface NavFooterProps {
  prev?: { path: string; label: string };
  next?: { path: string; label?: string };
  nextLabel?: string;
}

/* ─── ModuleLayout ───────────────────────────────────────────── */

export function ModuleLayout({ current, children }: ModuleLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgb(22_58_95/0.07)]">
        <div className="mx-auto max-w-6xl px-5 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="ActiOn logo"
                className="w-8 h-8 rounded-lg object-contain"
              />
              <div className="leading-none">
                <span className="text-sm font-bold text-primary tracking-tight">
                  ActiOn
                </span>
                <span className="hidden sm:block text-[10px] text-muted-foreground font-normal mt-0.5">
                  Feedback to Action
                </span>
              </div>
            </Link>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              Module {current} of {MODULES.length}
            </span>
          </div>
          <ProgressBar current={current} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">{children}</main>

      <footer className="border-t border-border mt-16 py-6 text-center text-xs text-muted-foreground">
        ActiOn · Feedback to Action · Adaptive Learning Prototype
      </footer>
    </div>
  );
}

/* ─── Progress bar ───────────────────────────────────────────── */

function ProgressBar({ current }: { current: number }) {
  return (
    <nav aria-label="Course progress" className="flex items-center gap-1 md:gap-2">
      {MODULES.map((m, i) => {
        const done   = m.num < current;
        const active = m.num === current;

        return (
          <div key={m.num} className="flex items-center flex-1 min-w-0">
            <Link
              to={m.path}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all flex-1 min-w-0",
                active ? "bg-primary-soft" : "hover:bg-muted",
              )}
            >
              <div
                className={cn(
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  done   && "bg-teal text-white",
                  active && "bg-primary text-white ring-[3px] ring-primary/20",
                  !done && !active && "bg-muted text-muted-foreground border border-border",
                )}
              >
                {done ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : m.num}
              </div>

              <div className="hidden md:block min-w-0">
                <div className={cn(
                  "text-xs font-semibold truncate leading-tight",
                  active ? "text-primary" : done ? "text-teal" : "text-muted-foreground",
                )}>
                  {m.title}
                </div>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {m.subtitle}
                </div>
              </div>
            </Link>

            {i < MODULES.length - 1 && (
              <div className={cn(
                "h-px w-3 md:w-5 shrink-0 mx-0.5",
                done ? "bg-teal" : "bg-border",
              )} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Module page header ─────────────────────────────────────── */

export function ModuleHeader({ eyebrow, title, description }: ModuleHeaderProps) {
  return (
    <div className="mb-14">
      <p className="text-xs font-bold uppercase tracking-widest text-teal mb-3">
        {eyebrow}
      </p>
      <h1 className="text-4xl md:text-[56px] font-extrabold text-primary tracking-tight leading-[1.1]">
        {title}
      </h1>
      {description && (
        <p className="mt-5 text-xl text-muted-foreground max-w-2xl leading-[1.7]">
          {description}
        </p>
      )}
    </div>
  );
}

/* ─── Bottom nav footer ──────────────────────────────────────── */

export function NavFooter({ prev, next, nextLabel = "Continue" }: NavFooterProps) {
  return (
    <div className="mt-14 flex items-center justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          to={prev.path}
          className="inline-flex items-center gap-1.5 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          ← {prev.label}
        </Link>
      ) : <span />}

      {next && (
        <Link
          to={next.path}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3 text-base font-bold text-white shadow-card hover:bg-accent/90 active:scale-[0.98] transition-all"
        >
          {next.label ?? nextLabel} →
        </Link>
      )}
    </div>
  );
}
