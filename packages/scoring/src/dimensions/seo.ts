import type { DimensionScore, OnchainMetrics, SeoMetrics } from "@scout/schemas";
import { toScore } from "../util.js";
import { DIMENSION_WEIGHTS } from "./onchain.js";

export function scoreSearchDemand(
  metrics: SeoMetrics | undefined,
  evidenceIds: string[],
): DimensionScore {
  if (!metrics || Object.keys(metrics).length === 0) {
    return { key: "searchDemand", weight: DIMENSION_WEIGHTS.searchDemand, score: 0, rationale: "Search and Web2 demand data unavailable", evidenceIds: [] };
  }
  const buzz = metrics.webBuzzScore;
  if (typeof metrics.searchDemandChangePct !== "number" && typeof buzz === "number") {
    return {
      key: "searchDemand",
      weight: DIMENSION_WEIGHTS.searchDemand,
      score: toScore(buzz),
      rationale: `Web2 buzz ${buzz.toFixed(1)}/100 from ${metrics.githubStars ?? 0} GitHub stars across ${metrics.githubRepoCount ?? 0} repositories and ${metrics.hackerNewsMentions ?? 0} Hacker News stories`,
      evidenceIds,
    };
  }
  const demand = metrics.searchDemandChangePct ?? 0;
  const devIntent = metrics.developerIntentScore ?? 0;
  const score = toScore(demand * 0.5 + devIntent * 0.3 + (buzz ?? 0) * 0.2);
  return {
    key: "searchDemand",
    weight: DIMENSION_WEIGHTS.searchDemand,
    score,
    rationale: `Search demand ${demand >= 0 ? "+" : ""}${demand.toFixed(1)}%, developer-intent ${devIntent.toFixed(1)}/100${typeof buzz === "number" ? `, Web2 buzz ${buzz.toFixed(1)}/100` : ""}`,
    evidenceIds,
  };
}

export function scoreCompetitiveGap(
  onchain: OnchainMetrics | undefined,
  seo: SeoMetrics | undefined,
  onchainRankScore: number,
  evidenceIds: string[],
): DimensionScore {
  if (typeof seo?.competitorSerpDominance !== "number") {
    return { key: "competitiveGap", weight: DIMENSION_WEIGHTS.competitiveGap, score: 0, rationale: "Competitive SERP data unavailable", evidenceIds: [] };
  }
  const serpDom = seo.competitorSerpDominance;
  const gap = onchainRankScore - serpDom;
  const score = toScore(50 + gap);
  const onchainUp = (onchain?.tvlChangePct ?? 0) > 20;
  const searchFlat = (seo?.searchDemandChangePct ?? 0) < 15;
  const rationale =
    onchainUp && searchFlat
      ? "Strong on-chain adoption with weak competitor SEO moat"
      : `On-chain rank ${onchainRankScore.toFixed(1)} vs SERP dominance ${serpDom.toFixed(1)}`;
  return {
    key: "competitiveGap",
    weight: DIMENSION_WEIGHTS.competitiveGap,
    score,
    rationale,
    evidenceIds,
  };
}

export function scoreSeoOpportunity(
  metrics: SeoMetrics | undefined,
  onchain: OnchainMetrics | undefined,
  evidenceIds: string[],
): DimensionScore {
  if (typeof metrics?.organicVisibility !== "number" || typeof metrics.contentGapScore !== "number") {
    return { key: "seoOpportunity", weight: DIMENSION_WEIGHTS.seoOpportunity, score: 0, rationale: "SEO opportunity data unavailable", evidenceIds: [] };
  }
  const visibility = metrics.organicVisibility;
  const gap = metrics.contentGapScore;
  const onchainHot = (onchain?.tvlChangePct ?? 0) > 15;
  const score = toScore((100 - visibility) * 0.4 + gap * 0.4 + (onchainHot ? 20 : 0));
  return {
    key: "seoOpportunity",
    weight: DIMENSION_WEIGHTS.seoOpportunity,
    score,
    rationale: `Organic visibility ${visibility.toFixed(1)}/100, content gap ${gap.toFixed(1)}/100`,
    evidenceIds,
  };
}

export function buildGapSignal(
  onchain: OnchainMetrics | undefined,
  seo: SeoMetrics | undefined,
): string | undefined {
  if (typeof seo?.searchDemandChangePct !== "number") return undefined;
  const observed = [
    onchain?.tvlChangePct,
    onchain?.volumeChangePct,
    onchain?.activeAddressesChangePct,
  ].filter((value): value is number => typeof value === "number");
  if (observed.length === 0) return undefined;
  const onchainAvg = observed.reduce((sum, value) => sum + value, 0) / observed.length;
  const search = seo.searchDemandChangePct;
  const fmt = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
  if (onchainAvg > 20 && search < 15) {
    return `on-chain ${fmt(onchainAvg)} but search ${fmt(search)}`;
  }
  return undefined;
}
