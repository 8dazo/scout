"use client";

import type { ResearchSession } from "@scout/schemas";
import { formatUsd } from "@/lib/evidence/format";
import {
  formatDiscoveryHeadline,
  formatGraphStandardLine,
  getDiscoverySummary,
} from "@/lib/discoverySummary";

function shortId(value: string) {
  return value.length > 18 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value;
}

export function CandidateDiscoveryPanel({ session }: { session: ResearchSession | null }) {
  const summary = getDiscoverySummary(session);
  const tokens = session?.candidates ?? [];

  if (!summary || tokens.length === 0) return null;

  const standardLine = formatGraphStandardLine(summary);

  return (
    <div className="border-brutal p-6 space-y-4">
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-ink/60">
          The Graph
        </p>
        <h2 className="font-display text-xl uppercase mt-2">Discovered Lending Assets</h2>
        {standardLine && (
          <p className="mt-2 font-mono text-xs text-signal">{standardLine}</p>
        )}
        <p className="mt-2 text-sm text-ink/60">{formatDiscoveryHeadline(summary)}</p>
        <div className="h-[3px] w-16 bg-ink mt-3" />
      </div>

      {summary.deployments.length > 0 && (
        <div className="space-y-1 font-mono text-[11px]">
          {summary.deployments.map((row) => (
            <div key={`${row.protocol}-${row.queryKind}`} className="flex flex-wrap gap-x-3 gap-y-1 text-ink/70">
              <span className="uppercase">{row.protocol}</span>
              <span className={row.composable ? "text-success" : "text-ink/50"}>
                {row.composable ? "Messari standard" : `native ${row.queryKind}`}
              </span>
              {row.schemaVersion && <span>{row.schemaVersion}</span>}
              {row.subgraphId && (
                <span title={row.subgraphId} className="break-all">{shortId(row.subgraphId)}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {summary.skipped.length > 0 && (
        <p className="font-mono text-[11px] text-ink/50">
          Skipped: {summary.skipped.map((row) => `${row.protocol} (${row.reason})`).join("; ")}
        </p>
      )}

      <div className="space-y-3">
        {tokens.map((entry) => (
          <div
            key={entry.id}
            className="border border-ink/15 px-4 py-3 bg-paper flex flex-col gap-2 md:flex-row md:items-start md:justify-between"
          >
            <div>
              <p className="font-display text-sm uppercase">
                {entry.assetSymbol ?? entry.protocol}
              </p>
              <p className="font-mono text-xs text-ink/50 uppercase mt-0.5">
                {entry.sourceProtocol ?? entry.protocol} · {entry.chain}
                {entry.windowLabel ? ` · ${entry.windowLabel}` : ""}
              </p>
            </div>
            <span className="self-start font-mono text-[10px] uppercase px-2 py-0.5 border border-success/40 text-success bg-success/5">
              {formatUsd(entry.tokenMetrics?.grossFlowUsd ?? entry.tokenMetrics?.tvlUsd ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
