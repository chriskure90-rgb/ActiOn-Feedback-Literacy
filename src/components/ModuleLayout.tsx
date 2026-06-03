import { Link } from "react-router";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MODULES } from "@/lib/constants";

const LOGO_URL = "/logo.png";

/* ─── Types ──────────────────────────────────────────────────── */

interface ModuleLayoutProps {
  current: number;
  children: ReactNode;
  fullHeight?: boolean;
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

export function ModuleLayout({ current, children, fullHeight }: ModuleLayoutProps) {
  return (
    /*
     * CSS Grid with grid-rows guarantees <main> always occupies the row
     * strictly below <header>, whatever the header's actual rendered height.
     * This avoids the sticky-inside-overflow-hidden browser bug where the
     * header is removed from flow and overlaps the content area.
     */
    <div className={cn(
      "bg-background",
      fullHeight
        ? "h-screen grid grid-rows-[auto_1fr]"
        : "min-h-screen grid grid-rows-[auto_1fr_auto]",
    )}>
      {/* Navy header — bg-primary (#163A5F) */}
      <header className="sticky top-0 z-40 border-b border-primary/30 bg-primary shadow-[0_2px_8px_0_rgb(22_58_95/0.35)]">
        <div className="mx-auto max-w-6xl px-5 py-3">

          {/* Brand row */}
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={LOGO_URL}
                alt="ActiOn logo"
                className="w-8 h-8 rounded-lg object-contain"
              />
              <div className="leading-none">
                {/* White on navy: 16:1 contrast */}
                <span className="text-sm font-bold text-white tracking-tight">
                  ActiOn
                </span>
                <span className="hidden sm:block text-[10px] text-white/65 font-normal mt-0.5">
                  Feedback to Action
                </span>
              </div>
            </Link>
            {/* Frosted pill on navy */}
            <span className="text-xs font-medium text-white/85 bg-white/15 px-2.5 py-1 rounded-full">
              Module {current} of {MODULES.length}
            </span>
          </div>

          <ProgressBar current={current} />
        </div>
      </header>

      <main className={cn(
        "mx-auto w-full max-w-6xl px-5",
        fullHeight
          ? "min-h-0 overflow-hidden flex flex-col py-4"
          : "py-10 md:py-14",
      )}>
        {children}
      </main>

      {!fullHeight && (
        <footer className="border-t border-border mt-16 py-6 text-center text-xs text-muted-foreground">
          ActiOn · Feedback to Action · Adaptive Learning Prototype
        </footer>
      )}
    </div>
  );
}

/* ─── Progress bar (on navy background) ─────────────────────── */

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
                active ? "bg-white/15" : "hover:bg-white/10",
              )}
            >
              {/* Step bubble */}
              <div
                className={cn(
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  // Active: white bubble, navy number — maximum contrast on navy bg
                  active && "bg-white text-primary ring-[3px] ring-white/30",
                  // Done: teal bubble, white check
                  done   && "bg-teal text-white",
                  // Future: translucent white bubble
                  !done && !active && "bg-white/15 text-white/55 border border-white/25",
                )}
              >
                {done ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : m.num}
              </div>

              {/* Step labels */}
              <div className="hidden md:block min-w-0">
                <div className={cn(
                  "text-xs font-semibold truncate leading-tight",
                  active ? "text-white"    :
                  done   ? "text-teal"     :
                           "text-white/55",
                )}>
                  {m.title}
                </div>
                <div className="text-[10px] text-white/45 truncate mt-0.5">
                  {m.subtitle}
                </div>
              </div>
            </Link>

            {/* Connector line */}
            {i < MODULES.length - 1 && (
              <div className={cn(
                "h-px w-3 md:w-5 shrink-0 mx-0.5",
                done ? "bg-teal" : "bg-white/20",
              )} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Module page header (below the nav, on page bg) ────────── */

export function ModuleHeader({ eyebrow, title, description }: ModuleHeaderProps) {
  return (
    <div className="mb-10">
      <p className="text-[11px] font-bold uppercase tracking-widest text-teal mb-2">
        {eyebrow}
      </p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight leading-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          ← {prev.label}
        </Link>
      ) : <span />}

      {next && (
        <Link
          to={next.path}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-card hover:bg-accent/90 active:scale-[0.98] transition-all"
        >
          {next.label ?? nextLabel} →
        </Link>
      )}
    </div>
  );
}
