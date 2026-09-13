"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useScoutAuth } from "@/app/providers";

interface EACTestResult {
  action: "authorized" | "unauthorized";
  success: boolean;
  status: number;
  data: Record<string, unknown>;
  verification?: "blocked_onchain" | "security_failure" | "indeterminate";
  timestamp: string;
}

export function EACTestCard() {
  const [loading, setLoading] = useState<"auth" | "unauth" | null>(null);
  const [result, setResult] = useState<EACTestResult | null>(null);
  const { getAccessToken } = useScoutAuth();

  async function handleTest(action: "authorized" | "unauthorized") {
    setLoading(action === "authorized" ? "auth" : "unauth");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      const accessToken = await getAccessToken();
      const res = await fetch(`${apiUrl}/agent/test-eac`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setResult({
        action,
        success: res.ok,
        status: res.status,
        data,
        verification: data.verification,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setResult({
        action,
        success: false,
        status: 500,
        data: { error: err instanceof Error ? err.message : "Network error" },
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card shadow className="border-brutal space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/20 pb-4">
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-ink/60">
            Live Permission Gate Verification
          </p>
          <h2 className="font-display text-xl uppercase mt-1">ENSv2 Enhanced Access Control (EAC)</h2>
        </div>
        <span className="font-mono text-xs border border-ink/30 px-2 py-0.5 bg-paper-muted">
          Role-Based Gating
        </span>
      </div>

      <p className="text-sm text-ink/80">
        Test Scout&apos;s onchain permission boundaries. In ENSv2, the agent wallet is assigned{" "}
        <code className="bg-paper-muted px-1 py-0.5 border border-ink/20 font-mono text-xs">ROLE_TEXT</code>{" "}
        for research status records, but is explicitly blocked from high-privilege operations like transferring names or modifying resolvers.
      </p>

      <div className="flex flex-wrap gap-4">
        <Button
          variant="secondary"
          loading={loading === "auth"}
          onClick={() => handleTest("authorized")}
        >
          Test Authorized Action (Update Status)
        </Button>
        <Button
          variant="danger"
          loading={loading === "unauth"}
          onClick={() => handleTest("unauthorized")}
        >
          Test Unauthorized Text Record Write
        </Button>
      </div>

      {result && (
        <div className="border-brutal p-4 bg-paper-muted font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-ink/20 pb-2">
            <span className="font-bold uppercase">
              Action: {result.action === "authorized" ? "Update research.status" : "Write research.status without permission"}
            </span>
            <span
              className={`px-2 py-0.5 font-bold uppercase ${
                (result.action === "authorized" && result.success) || result.verification === "blocked_onchain"
                  ? "bg-success text-paper"
                  : "bg-error text-paper"
              }`}
            >
              {result.action === "authorized" && result.success
                ? `HTTP ${result.status} ALLOWED`
                : result.verification === "blocked_onchain"
                  ? "MINED REVERT — BLOCKED"
                  : result.verification === "security_failure"
                    ? "SECURITY FAILURE"
                    : "NOT VERIFIED"}
            </span>
          </div>

          <p className="text-ink/80">
            {result.action === "authorized" && result.success
              ? "Operation succeeded under the delegated text-record role."
              : result.verification === "blocked_onchain"
                ? "The unauthorized transaction was mined and reverted on-chain."
                : result.verification === "security_failure"
                  ? "The unauthorized transaction succeeded. Review resolver permissions immediately."
                  : "No mined receipt was obtained, so the access-control result is not verified."}
          </p>

          <pre className="bg-paper p-3 border border-ink/20 overflow-x-auto text-[11px]">
            {JSON.stringify(result.data, null, 2)}
          </pre>
          <p className="text-ink/40 text-[10px]">Verified at {result.timestamp}</p>
        </div>
      )}
    </Card>
  );
}
