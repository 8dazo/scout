import type { DimensionKey, DimensionScore, OnchainMetrics } from "@scout/schemas";
import { toScore } from "../util.js";

export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  onchainGrowth: 0.3,
  userGrowth: 0.2,
  searchDemand: 0.2,
  competitiveGap: 0.15,
  seoOpportunity: 0.1,
  evidenceConfidence: 0.05,
};

export function normalizePctChange(pct: number): number {
  return Math.min(100, Math.max(0, 50 + pct));
}

export function scoreOnchainGrowth(
  metrics: OnchainMetrics | undefined,
  evidenceIds: string[],
): DimensionScore {
  const observed = [metrics?.tvlChangePct, metrics?.volumeChangePct, metrics?.txChangePct]
    .filter((value): value is number => typeof value === "number");
  const score = observed.length
    ? toScore(observed.reduce((sum, value) => sum + normalizePctChange(value), 0) / observed.length)
    : 0;
  const details = [
    ["TVL", metrics?.tvlChangePct],
    ["volume", metrics?.volumeChangePct],
    ["txs", metrics?.txChangePct],
  ].filter((entry): entry is [string, number] => typeof entry[1] === "number");
  return {
    key: "onchainGrowth",
    weight: DIMENSION_WEIGHTS.onchainGrowth,
    score,
    rationale: details.length
      ? details.map(([label, value]) => `${label} ${value >= 0 ? "+" : ""}${value.toFixed(1)}%`).join(", ")
      : "No measured on-chain growth fields available",
    evidenceIds,
  };
}

export function scoreUserGrowth(
  metrics: OnchainMetrics | undefined,
  evidenceIds: string[],
): DimensionScore {
  const observed = [metrics?.activeAddressesChangePct, metrics?.newUsersChangePct]
    .filter((value): value is number => typeof value === "number");
  let score = observed.length
    ? toScore(observed.reduce((sum, value) => sum + normalizePctChange(value), 0) / observed.length)
    : 0;
  const tx = metrics?.txChangePct;
  const active = metrics?.activeAddressesChangePct;
  if (typeof tx === "number" && typeof active === "number" && tx > 30 && active < 5) {
    score = toScore(score - 20);
  }
  return {
    key: "userGrowth",
    weight: DIMENSION_WEIGHTS.userGrowth,
    score,
    rationale: observed.length
      ? `Measured user-growth fields: ${observed.map((value) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`).join(", ")}`
      : "User growth was not measured by this subgraph",
    evidenceIds,
  };
}
