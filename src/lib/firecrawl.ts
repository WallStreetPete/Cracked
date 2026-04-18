import "server-only";

export type ScrapeResult = {
  url: string;
  markdown?: string;
  title?: string;
  error?: string;
};

export async function firecrawlScrape(url: string): Promise<ScrapeResult> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return { url, error: "FIRECRAWL_API_KEY missing" };
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });
    if (!res.ok) {
      return { url, error: `firecrawl ${res.status}` };
    }
    const data = (await res.json()) as {
      data?: { markdown?: string; metadata?: { title?: string } };
    };
    return {
      url,
      markdown: data.data?.markdown?.slice(0, 20000),
      title: data.data?.metadata?.title,
    };
  } catch (err) {
    return { url, error: err instanceof Error ? err.message : "firecrawl error" };
  }
}
