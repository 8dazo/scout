import type { SeoMetrics } from "@scout/schemas";

interface GithubRepository {
  full_name?: string;
  stargazers_count?: number;
  html_url?: string;
  updated_at?: string;
}

interface HackerNewsHit {
  title?: string;
  url?: string | null;
  created_at?: string;
  points?: number;
}

export interface WebBuzzEvidence {
  query: string;
  fetchedAt: string;
  github?: {
    totalCount: number;
    repositories: GithubRepository[];
  };
  hackerNews?: {
    totalCount: number;
    stories: HackerNewsHit[];
  };
  errors?: string[];
}

function bounded(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
}

/**
 * Public Web2 attention evidence. It is intentionally separate from keyword
 * demand: stars and stories are observed counts, while webBuzzScore is a
 * documented, bounded transform of those counts for ranking only.
 */
export async function fetchWebBuzz(protocol: string): Promise<{ metrics: SeoMetrics; evidence: WebBuzzEvidence } | undefined> {
  const query = protocol.replace(/\b(v\d+)\b/gi, "").trim() || protocol;
  const encoded = encodeURIComponent(query);
  const errors: string[] = [];
  const fetchedAt = new Date().toISOString();

  const [githubResult, hackerNewsResult] = await Promise.allSettled([
    fetch(`https://api.github.com/search/repositories?q=${encoded}+in%3Aname%2Cdescription&sort=stars&order=desc&per_page=5`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "Scout-ETHGlobal" },
    }),
    fetch(`https://hn.algolia.com/api/v1/search?query=${encoded}&tags=story&hitsPerPage=10`),
  ]);

  const evidence: WebBuzzEvidence = { query, fetchedAt };
  let githubStars = 0;
  let githubRepoCount = 0;
  let hackerNewsMentions = 0;

  if (githubResult.status === "fulfilled" && githubResult.value.ok) {
    const payload = await githubResult.value.json() as { total_count?: number; items?: GithubRepository[] };
    const repositories = (payload.items ?? []).map((repo) => ({
      full_name: repo.full_name,
      stargazers_count: repo.stargazers_count,
      html_url: repo.html_url,
      updated_at: repo.updated_at,
    }));
    githubRepoCount = repositories.length;
    githubStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
    evidence.github = { totalCount: payload.total_count ?? githubRepoCount, repositories };
  } else {
    errors.push("GitHub repository search unavailable");
  }

  if (hackerNewsResult.status === "fulfilled" && hackerNewsResult.value.ok) {
    const payload = await hackerNewsResult.value.json() as { nbHits?: number; hits?: HackerNewsHit[] };
    const stories = (payload.hits ?? []).map((hit) => ({
      title: hit.title,
      url: hit.url,
      created_at: hit.created_at,
      points: hit.points,
    }));
    hackerNewsMentions = payload.nbHits ?? stories.length;
    evidence.hackerNews = { totalCount: hackerNewsMentions, stories };
  } else {
    errors.push("Hacker News search unavailable");
  }

  if (!evidence.github && !evidence.hackerNews) return undefined;
  if (errors.length) evidence.errors = errors;

  const webBuzzScore = bounded(
    Math.log10(githubStars + 1) * 18 +
      Math.min(20, githubRepoCount * 2) +
      Math.min(30, Math.log2(hackerNewsMentions + 1) * 7),
  );

  return {
    metrics: { webBuzzScore, githubStars, githubRepoCount, hackerNewsMentions },
    evidence,
  };
}
