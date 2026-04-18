import "server-only";
import Exa from "exa-js";

let _exa: Exa | null = null;
export function exa(): Exa {
  if (_exa) return _exa;
  const key = process.env.EXA_API_KEY;
  if (!key) throw new Error("EXA_API_KEY missing");
  _exa = new Exa(key);
  return _exa;
}

export type ExaResult = {
  title?: string | null;
  url: string;
  text?: string | null;
  publishedDate?: string | null;
  author?: string | null;
  score?: number | null;
};

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function searchJobs(opts: {
  company: string;
  careersUrl: string;
  roleQueries: string[];
  numResults?: number;
}): Promise<ExaResult[]> {
  const host = hostOf(opts.careersUrl);
  const queries = opts.roleQueries.length ? opts.roleQueries : [""];
  const out: ExaResult[] = [];
  for (const role of queries) {
    const q = `${opts.company} ${role ? role + " " : ""}open role apply job opening`.trim();
    try {
      const res = await exa().searchAndContents(q, {
        numResults: opts.numResults ?? 6,
        type: "auto",
        useAutoprompt: true,
        includeDomains: host ? [host, "jobs.lever.co", "jobs.ashbyhq.com", "boards.greenhouse.io", "apply.workable.com", "careers.google.com", "jobs.smartrecruiters.com"] : undefined,
        text: { maxCharacters: 1200 },
      } as unknown as Parameters<Exa["searchAndContents"]>[1]);
      for (const r of res.results ?? []) {
        out.push({
          title: r.title ?? null,
          url: r.url,
          text: (r as { text?: string }).text ?? null,
          publishedDate: (r as { publishedDate?: string }).publishedDate ?? null,
          author: (r as { author?: string }).author ?? null,
          score: (r as { score?: number }).score ?? null,
        });
      }
    } catch (err) {
      console.error("[exa searchJobs]", err);
    }
  }
  const dedup = new Map<string, ExaResult>();
  for (const r of out) if (!dedup.has(r.url)) dedup.set(r.url, r);
  return Array.from(dedup.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

const PROFILE_PATTERNS = [
  /linkedin\.com\/in\//i,
  /twitter\.com\/[^/]+\/?$/i,
  /x\.com\/[^/]+\/?$/i,
  /github\.com\/[^/]+\/?$/i,
];

function isPersonProfile(url: string): boolean {
  return PROFILE_PATTERNS.some((p) => p.test(url));
}

export async function findContacts(opts: { company: string; role?: string; numResults?: number }): Promise<ExaResult[]> {
  const roleText = opts.role ? `as a ${opts.role}` : "";
  const queries = [
    `A person who works at ${opts.company} ${roleText}. Their LinkedIn profile:`,
    `${opts.company} employee ${opts.role ?? ""} — personal LinkedIn`,
  ];
  const out: ExaResult[] = [];
  for (const q of queries) {
    try {
      const res = await exa().searchAndContents(q, {
        numResults: opts.numResults ?? 10,
        type: "neural",
        useAutoprompt: false,
        category: "linkedin profile",
        includeDomains: ["linkedin.com"],
        text: { maxCharacters: 800 },
      } as unknown as Parameters<Exa["searchAndContents"]>[1]);
      for (const r of res.results ?? []) {
        if (!isPersonProfile(r.url)) continue;
        out.push({
          title: r.title ?? null,
          url: r.url,
          text: (r as { text?: string }).text ?? null,
          publishedDate: (r as { publishedDate?: string }).publishedDate ?? null,
          author: (r as { author?: string }).author ?? null,
          score: (r as { score?: number }).score ?? null,
        });
      }
    } catch (err) {
      console.error("[exa findContacts]", err);
    }
  }
  const dedup = new Map<string, ExaResult>();
  for (const r of out) if (!dedup.has(r.url)) dedup.set(r.url, r);
  return Array.from(dedup.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
