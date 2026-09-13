"use client";

import type { ResearchSession } from "@scout/schemas";

export interface WalletButtonProps {
  session?: ResearchSession | null;
  onOpenTreasury?: () => void;
}

export function WalletButton({ session, onOpenTreasury }: WalletButtonProps) {
  const balance = session?.budget?.remaining ?? 0.5;

  return (
    <button
      type="button"
      onClick={onOpenTreasury}
      className="font-mono text-xs border-brutal px-3 py-1.5 bg-paper hover:bg-paper-muted transition-all flex items-center gap-2 shadow-brutal hover:shadow-brutal-hover"
      title="View Scout Treasury"
    >
      <span className="h-2 w-2 rounded-full bg-success" />
      <span className="font-display uppercase tracking-wider text-[11px]">Treasury</span>
      <span className="text-signal font-bold">${balance.toFixed(2)}</span>
    </button>
  );
}
