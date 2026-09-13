"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SLIDES } from "./slides";

const LAST = SLIDES.length - 1;

export function PitchDeck() {
  const [index, setIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);

  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(LAST, next)));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        go(0);
      } else if (event.key === "End") {
        event.preventDefault();
        go(LAST);
      } else if (event.key === "n" || event.key === "N") {
        event.preventDefault();
        setNotesOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const slide = SLIDES[index];
  const isTitle = slide.id === "title";

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <header className="border-b-[3px] border-ink px-4 md:px-8 py-3 flex items-center justify-between gap-4 shrink-0">
        <Link
          href="/"
          className="font-display font-black text-2xl tracking-widest uppercase shrink-0 hover:text-signal transition-colors"
        >
          Scout
        </Link>
        <p className="font-mono text-xs text-ink/60 tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </p>
        <Link
          href="/"
          className="font-display text-xs uppercase tracking-widest hover:text-signal transition-colors"
        >
          Research
        </Link>
      </header>

      <main className="flex-1 flex flex-col overflow-auto">
        <div className="flex-1 max-w-scout w-full mx-auto px-4 md:px-8 py-8 md:py-12">
          <p className="font-display text-xs uppercase tracking-widest text-signal mb-4">
            {slide.kicker}
          </p>
          <h1
            className={`text-display ${
              isTitle ? "text-5xl md:text-7xl lg:text-8xl" : "text-3xl md:text-5xl"
            }`}
          >
            {slide.title}
          </h1>
          {slide.lead ? (
            <p className={`mt-4 max-w-3xl leading-relaxed ${isTitle ? "text-lg md:text-xl text-ink/80" : "text-base md:text-lg text-ink/80"}`}>
              {slide.lead}
            </p>
          ) : null}

          {slide.items && slide.items.length > 0 ? (
            <ul className={`mt-8 space-y-3 ${slide.items.some((item) => item.label) ? "" : "max-w-3xl"}`}>
              {slide.items.map((item) => {
                const body = item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-signal underline underline-offset-2 hover:text-ink"
                  >
                    {item.text}
                  </a>
                ) : (
                  item.text
                );

                if (item.label) {
                  return (
                    <li
                      key={`${item.label}-${item.text}`}
                      className="border-brutal bg-paper px-4 py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6"
                    >
                      <span className="font-display text-sm uppercase tracking-wide shrink-0 sm:w-48">
                        {item.label}
                      </span>
                      <span className="font-mono text-[13px] text-ink/80 leading-snug">{body}</span>
                    </li>
                  );
                }

                return (
                  <li key={item.text} className="flex gap-3 text-base md:text-lg leading-relaxed">
                    <span className="text-signal font-display mt-0.5" aria-hidden>
                      —
                    </span>
                    <span>{body}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {slide.quote ? (
            <blockquote className="mt-8 max-w-3xl border-brutal bg-paper-muted px-5 py-4 font-mono text-sm md:text-base leading-relaxed">
              {slide.quote}
            </blockquote>
          ) : null}

          {slide.closing ? (
            <p className="mt-8 max-w-3xl font-display text-xl md:text-2xl uppercase tracking-wide">
              {slide.closing}
            </p>
          ) : null}

          {slide.links && slide.links.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {slide.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border-brutal px-4 py-2 font-display text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {notesOpen ? (
          <aside className="border-t-2 border-ink bg-paper-muted px-4 md:px-8 py-4 shrink-0">
            <div className="max-w-scout mx-auto">
              <p className="font-display text-xs uppercase tracking-widest text-ink/50 mb-2">
                Speaker notes
              </p>
              <p className="font-mono text-[13px] leading-relaxed text-ink/80">{slide.notes}</p>
            </div>
          </aside>
        ) : null}
      </main>

      <footer className="border-t-[3px] border-ink px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <Button
          type="button"
          variant="secondary"
          className="px-4 py-2 text-xs"
          onClick={() => go(index - 1)}
          disabled={index === 0}
        >
          Prev
        </Button>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={notesOpen ? "primary" : "ghost"}
            className="px-4 py-2 text-xs"
            onClick={() => setNotesOpen((open) => !open)}
            aria-pressed={notesOpen}
          >
            Notes
          </Button>
          <p className="hidden sm:block font-mono text-[11px] text-ink/50">
            Arrows · Home/End · N notes
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          className="px-4 py-2 text-xs"
          onClick={() => go(index + 1)}
          disabled={index === LAST}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
