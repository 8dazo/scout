import type { ResearchSession } from "@scout/schemas";
import { Card } from "@/components/ui/Card";
import { ToolBadge } from "@/components/ui/Badge";

function payloadString(payload: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = payload?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function payloadNumber(payload: Record<string, unknown> | undefined, key: string): number | undefined {
  const value = payload?.[key];
  return typeof value === "number" ? value : undefined;
}

function short(value: string) {
  return value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-6)}` : value;
}

export function EnsProof({ session }: { session: ResearchSession }) {
  const updated = session.decisionLog.find((entry) => entry.eventType === "ens.updated");
  const failed = session.decisionLog.find((entry) => entry.eventType === "ens.failed");
  const budgetLog = session.decisionLog.find((entry) => payloadNumber(entry.payload, "ensBudgetCap") != null);

  const ensName =
    session.agent.ensName ??
    payloadString(updated?.payload, "ensName") ??
    payloadString(budgetLog?.payload, "ensName");
  const status = payloadString(updated?.payload, "status");
  const txHash = payloadString(updated?.payload, "txHash");
  const budgetCap = payloadNumber(budgetLog?.payload, "ensBudgetCap");

  if (!ensName && !failed) return null;

  if (failed && !ensName) {
    return (
      <Card>
        <div className="flex items-center gap-2">
          <ToolBadge tool="ens" />
          <p className="font-display text-xs uppercase tracking-widest text-ink/60">ENSv2</p>
        </div>
        <p className="mt-3 font-mono text-sm">ENS unconfigured</p>
        <p className="mt-2 font-mono text-[11px] text-ink/60">{failed.message}</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2">
        <ToolBadge tool="ens" />
        <p className="font-display text-xs uppercase tracking-widest text-ink/60">ENSv2 identity</p>
      </div>
      <p className="font-mono text-xl mt-3">{ensName}</p>
      <dl className="mt-4 grid gap-3 text-xs font-mono sm:grid-cols-2">
        {status && (
          <div>
            <dt className="uppercase text-ink/50">research.status</dt>
            <dd className="mt-1">{status}</dd>
          </div>
        )}
        {budgetCap != null && (
          <div>
            <dt className="uppercase text-ink/50">research.budget</dt>
            <dd className="mt-1">${budgetCap.toFixed(2)} USDC</dd>
          </div>
        )}
      </dl>
      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block font-mono text-xs text-signal underline break-all"
        >
          View status write {short(txHash)} ↗
        </a>
      )}
    </Card>
  );
}
