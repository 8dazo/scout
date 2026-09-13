"use client";

import { useEffect, useState } from "react";
import { ScoutShell } from "@/components/shell/ScoutShell";
import { PartnerStrip } from "@/components/shell/PartnerStrip";
import { AgentIdentityCard } from "@/components/agent/AgentIdentityCard";
import { PermissionList } from "@/components/agent/PermissionList";
import { EACTestCard } from "@/components/agent/EACTestCard";
import { AgentActivity } from "@/components/agent/AgentActivity";
import { fetchReports, type ResearchListItem } from "@/lib/api";

interface AgentIdentity {
  name?: string;
  ensName?: string;
  status?: string;
  budgetCap?: number | null;
  records?: Record<string, string>;
  permissions?: Record<string, boolean>;
  error?: string;
}

export default function AgentPage() {
  const [reports, setReports] = useState<ResearchListItem[]>([]);
  const [identity, setIdentity] = useState<AgentIdentity | null>(null);

  useEffect(() => {
    fetchReports().then(setReports).catch(() => setReports([]));
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    fetch(`${apiUrl}/agent/identity`)
      .then((r) => r.json())
      .then((data: AgentIdentity) => setIdentity(data))
      .catch(() => setIdentity({ name: "scout", status: "UNCONFIGURED" }));
  }, []);

  return (
    <ScoutShell>
      <div className="max-w-scout mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12">
        <PartnerStrip />
        <AgentIdentityCard
          name={identity?.name ?? "scout"}
          ensName={identity?.ensName}
          budgetCap={identity?.budgetCap}
          status={identity?.status ?? "UNCONFIGURED"}
          mcpEndpoint={identity?.records?.["agent.mcp"]}
        />

        <PermissionList permissions={identity?.permissions} />

        <EACTestCard />

        <AgentActivity reports={reports} />
      </div>
    </ScoutShell>
  );
}
