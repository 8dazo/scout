import type { Candidate, DimensionScore } from "@scout/schemas";
import { toScore } from "../util.js";
import { DIMENSION_WEIGHTS } from "./onchain.js";

export function scoreEvidenceConfidence(
  candidate: Candidate,
  sourceCount: number,
  hasPaidAnalysis: boolean,
  evidenceIds: string[],
): DimensionScore {
  const onchainObserved = candidate.onchainMetrics
    ? Object.values(candidate.onchainMetrics).filter((value) => typeof value === "number").length
    : 0;
  const seoObserved = candidate.seoMetrics
    ? Object.values(candidate.seoMetrics).filter((value) => typeof value === "number").length
    : 0;
  const onchainCoverage = Math.min(1, onchainObserved / 11);
  const seoCoverage = Math.min(1, seoObserved / 6);
  let score = 20 + onchainCoverage * 45 + seoCoverage * 25;
  if (hasPaidAnalysis) {
    score += (candidate.deepAnalysis?.confidenceBoost ?? 0.1) * 100;
  }
  const onchain = candidate.onchainMetrics;
  if (
    typeof onchain?.txChangePct === "number" &&
    typeof onchain.activeAddressesChangePct === "number" &&
    onchain.txChangePct > 30 &&
    onchain.activeAddressesChangePct < 5
  ) {
    score -= 15;
  }
  return {
    key: "evidenceConfidence",
    weight: DIMENSION_WEIGHTS.evidenceConfidence,
    score: toScore(score),
    rationale: `${onchainObserved}/11 on-chain and ${seoObserved}/6 SEO fields observed across ${sourceCount} recorded sources${hasPaidAnalysis ? ", paid diagnostics included" : ""}`,
    evidenceIds,
  };
}

export function computeMomentum(
  metrics: Candidate["onchainMetrics"],
): "heating" | "stable" | "cooling" {
  const observed = [
    metrics?.tvlChangePct,
    metrics?.volumeChangePct,
    metrics?.activeAddressesChangePct,
  ].filter((value): value is number => typeof value === "number");
  const current = observed.length
    ? observed.reduce((sum, value) => sum + value, 0) / observed.length
    : 0;
  const prior = metrics?.priorPeriodGrowthPct ?? current;
  if (current > prior + 5) return "heating";
  if (current < prior - 5) return "cooling";
  return "stable";
}

export function computeRiskScore(candidate: Candidate): number {
  let risk = 30;
  const deep = candidate.deepAnalysis;
  if (deep?.riskFactors?.length) risk += deep.riskFactors.length * 8;
  if (deep?.whaleActivity && deep.whaleActivity > 40) risk += 15;
  if (deep?.retention && deep.retention < 20) risk += 20;
  const onchain = candidate.onchainMetrics;
  if (
    typeof onchain?.txChangePct === "number" &&
    typeof onchain.activeAddressesChangePct === "number" &&
    onchain.txChangePct > 30 &&
    onchain.activeAddressesChangePct < 5
  ) {
    risk += 25;
  }
  return toScore(risk);
}

export function computeFlags(candidate: Candidate): string[] {
  const flags: string[] = [];
  const onchain = candidate.onchainMetrics;
  const seo = candidate.seoMetrics;
  if (onchain && seo) {
    const adoption = [onchain.tvlChangePct, onchain.activeAddressesChangePct]
      .filter((value): value is number => typeof value === "number");
    const onchainAvg = adoption.length
      ? adoption.reduce((sum, value) => sum + value, 0) / adoption.length
      : 0;
    if (onchainAvg > 20 && (seo.searchDemandChangePct ?? 0) < 10) {
      flags.push("onchain_web_divergence");
    }
    if (
      typeof onchain.txChangePct === "number" &&
      typeof onchain.activeAddressesChangePct === "number" &&
      onchain.txChangePct > 30 &&
      onchain.activeAddressesChangePct < 5
    ) {
      flags.push("sybil_suspect");
    }
    if ((onchain.tvlChangePct ?? 0) > 30 && (deepRetention(candidate) < 20)) {
      flags.push("whale_driven");
    }
    if (onchainAvg > 25 && (seo.organicVisibility ?? 100) < 30) {
      flags.push("under_marketed_gem");
    }
  }
  return flags;
}

function deepRetention(candidate: Candidate): number {
  return candidate.deepAnalysis?.retention ?? 50;
}
