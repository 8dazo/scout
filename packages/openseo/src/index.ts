import type { Candidate, DataProvider, SeoMetrics, Source } from "@scout/schemas";
import {
  buildSeoMetrics,
  neutralSeoMetrics,
  type ResearchKeywordsResult,
  type SerpResultsPayload,
} from "./metrics.js";
import { MCP_URL, OpenSEOMcpClient, OpenSEOMcpError } from "./mcp.js";
import { fetchWebBuzz } from "./webBuzz.js";

function protocolFor(candidate: Candidate): string {
  return candidate.sourceProtocol ?? candidate.protocol.split(" · ").at(-1) ?? candidate.protocol;
}

function queryPlan(protocol: string, assetSymbol?: string) {
  const base = protocol.replace(/\b(v\d+)\b/gi, "").trim() || protocol;
  const seeds = [`${base} lending`, `${base} defi`, ...(assetSymbol ? [`${assetSymbol} ${base}`] : [])];
  const queries = [`${base} lending`, `${base} defi`, ...(assetSymbol ? [`${assetSymbol} ${base}`] : [])];
  return { seeds: [...new Set(seeds)], queries: [...new Set(queries)] };
}

function hasSerpData(serp: SerpResultsPayload): boolean {
  return Boolean(serp.results?.some((result) => result.ok && (result.items?.length ?? 0) > 0));
}

export class OpenSEOProvider implements DataProvider {
  name = "OpenSEO";
  capabilities = ["keyword-research", "serp", "competitor", "ai-visibility", "public-web-buzz"];

  constructor(
    private apiKey?: string,
    private projectId?: string,
  ) {}

  private client(): OpenSEOMcpClient {
    if (!this.apiKey) {
      throw new OpenSEOMcpError(
        "OPENSEO_API_KEY is required. Get one at app.openseo.so → Settings → API keys.",
      );
    }
    return new OpenSEOMcpClient({ apiKey: this.apiKey, projectId: this.projectId });
  }

  async execute(input: unknown): Promise<unknown> {
    const { action, protocol } = input as { action: string; protocol: string };
    if (action === "enrich-candidates") {
      return this.enrichCandidates((input as { candidates: Candidate[] }).candidates);
    }
    return this.researchProtocol(protocol);
  }

  async researchProtocol(protocol: string): Promise<SeoMetrics> {
    const client = this.client();
    const projectId = await client.getProjectId();
    const plan = queryPlan(protocol);

    const research = await client.callTool<ResearchKeywordsResult>("research_keywords", {
      projectId,
      seeds: plan.seeds.map((seed) => ({ seed })),
      resultLimit: 150,
    });
    const serp = await client.callTool<SerpResultsPayload>("get_serp_results", {
      projectId,
      queries: plan.queries.map((keyword) => ({ keyword })),
      depth: 10,
    });
    return buildSeoMetrics(protocol, research, serp);
  }

  async enrichCandidates(candidates: Candidate[]): Promise<{
    candidates: Candidate[];
    sources: Source[];
    sparse: string[];
    unavailable?: boolean;
  }> {
    const sources: Source[] = [];
    const enriched: Candidate[] = [];
    const sparse: string[] = [];
    const client = this.client();
    const buzzByProtocol = new Map<string, Promise<Awaited<ReturnType<typeof fetchWebBuzz>>>>();
    const getBuzz = (protocol: string) => {
      const known = buzzByProtocol.get(protocol);
      if (known) return known;
      const request = fetchWebBuzz(protocol);
      buzzByProtocol.set(protocol, request);
      return request;
    };

    let projectId: string;
    try {
      projectId = await client.getProjectId();
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      for (const c of candidates) {
        const protocol = protocolFor(c);
        const buzz = await getBuzz(protocol).catch(() => undefined);
        sparse.push(c.protocol);
        const sourceId = `openseo-${c.id}`;
        sources.push({
          id: sourceId,
          name: buzz ? "Web2 Buzz" : "OpenSEO",
          type: "web",
          cost: 0,
          data: {
            live: Boolean(buzz),
            sparse: true,
            unavailable: true,
            protocol,
            error: message,
            webBuzz: buzz?.evidence,
            metrics: buzz?.metrics ?? neutralSeoMetrics(),
          },
        });
        enriched.push({ ...c, seoMetrics: buzz?.metrics });
      }
      return { candidates: enriched, sources, sparse, unavailable: !sources.some((source) => (source.data as { live?: boolean } | undefined)?.live) };
    }

    for (const c of candidates) {
      const protocol = protocolFor(c);
      const plan = queryPlan(protocol, c.assetSymbol);
      const sourceId = `openseo-${c.id}`;

      try {
        const [research, serp, buzz] = await Promise.all([
          client.callTool<ResearchKeywordsResult>("research_keywords", {
            projectId,
            seeds: plan.seeds.map((seed) => ({ seed })),
            resultLimit: 150,
          }),
          client.callTool<SerpResultsPayload>("get_serp_results", {
            projectId,
            queries: plan.queries.map((keyword) => ({ keyword })),
            depth: 10,
          }),
          getBuzz(protocol),
        ]);
        const keywordRows = research.results?.flatMap((r) => (r.ok ? r.rows ?? [] : [])) ?? [];
        const hasOpenSeoData = keywordRows.length > 0 || hasSerpData(serp);
        const seo = buildSeoMetrics(protocol, research, serp);
        const metrics = buzz ? { ...seo, ...buzz.metrics } : seo;
        const live = hasOpenSeoData || Boolean(buzz);

        if (!hasOpenSeoData) sparse.push(c.protocol);
        sources.push({
          id: sourceId,
          name: buzz && !hasOpenSeoData ? "Web2 Buzz" : "OpenSEO",
          type: "web",
          cost: 0,
          data: {
            live,
            sparse: !hasOpenSeoData,
            protocol,
            seeds: plan.seeds,
            queries: plan.queries,
            research,
            serp,
            webBuzz: buzz?.evidence,
            metrics,
          },
        });
        enriched.push({ ...c, seoMetrics: Object.keys(metrics).length ? metrics : undefined });
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown error";
        const buzz = await getBuzz(protocol).catch(() => undefined);
        const metrics = buzz?.metrics ?? neutralSeoMetrics();
        sparse.push(c.protocol);
        sources.push({
          id: sourceId,
          name: buzz ? "Web2 Buzz" : "OpenSEO",
          type: "web",
          cost: 0,
          data: {
            live: Boolean(buzz),
            sparse: true,
            protocol,
            seeds: plan.seeds,
            queries: plan.queries,
            error: message,
            webBuzz: buzz?.evidence,
            metrics,
          },
        });
        enriched.push({ ...c, seoMetrics: Object.keys(metrics).length ? metrics : undefined });
      }
    }

    return { candidates: enriched, sources, sparse };
  }
}

export { MCP_URL, OpenSEOMcpError };
export { neutralSeoMetrics } from "./metrics.js";
