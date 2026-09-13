"use client";

import type { DecisionLogEntry } from "@scout/schemas";
import { ToolBadge } from "@/components/ui/Badge";

const INTEGRATIONS = [
  { key: "graph", label: "The Graph", events: ["graph.discovery", "graph.complete", "graph.query"] },
  { key: "openseo", label: "OpenSEO", events: ["openseo.complete"] },
  { key: "privy", label: "Privy", events: ["payment.required", "payment.pending", "payment.settled"] },
  { key: "ens", label: "ENSv2", events: ["ens.updated", "ens.failed"] },
];

export function JudgeView({ logs }: { logs: DecisionLogEntry[] }) {
  const eventTypes = new Set(logs.map((l) => l.eventType).filter(Boolean));

  return (
    <div className="border-brutal border-signal p-6 space-y-4 bg-paper-muted">
      <p className="font-display text-xs uppercase tracking-widest text-signal">Judge View</p>
      <h2 className="font-display text-lg uppercase">Live Research</h2>
      <div className="space-y-2">
        {INTEGRATIONS.map(({ key, events }) => {
          const live = events.some((e) => eventTypes.has(e as DecisionLogEntry["eventType"]));
          return (
            <div key={key} className="flex items-center justify-between gap-2">
              <ToolBadge tool={key} />
              <span className="font-mono text-xs">{live ? "✓ Live" : "— pending"}</span>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-ink/70 border-t border-ink/20 pt-4">
        Graph scores live markets. Privy pays extra evidence from the org wallet. ENS records the result.
      </p>
    </div>
  );
}
