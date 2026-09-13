"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ResearchSession } from "@scout/schemas";
import type { DecisionLogEntry } from "@scout/schemas";
import { AgentStatus } from "./AgentStatus";

const NAV = [
  { href: "/", label: "Research" },
  { href: "/reports", label: "Reports" },
  { href: "/agent", label: "Agent" },
  { href: "/pitch-deck", label: "Pitch" },
];

export function ScoutHeader({
  session,
  lastLog,
}: {
  session?: ResearchSession | null;
  lastLog?: DecisionLogEntry;
}) {
  const pathname = usePathname();

  return (
    <header className="border-b-[3px] border-ink bg-paper sticky top-0 z-30">
      <div className="max-w-scout mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display font-black text-2xl tracking-widest uppercase shrink-0 hover:text-signal transition-colors"
          >
            Scout
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-display text-xs uppercase tracking-widest hover:text-signal transition-colors ${
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "text-signal font-bold"
                    : "text-ink"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <AgentStatus session={session ?? null} lastLog={lastLog} compact />
          </div>
        </div>
      </div>

      <nav className="md:hidden flex border-t border-ink/20 divide-x divide-ink/20">
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 text-center py-2 font-display text-xs uppercase ${
              pathname === href ? "bg-ink text-paper" : "bg-paper text-ink"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
