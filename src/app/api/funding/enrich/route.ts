import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { FUNDING } from "@/lib/funding";
import { firecrawlScrape } from "@/lib/firecrawl";

export const runtime = "nodejs";
export const maxDuration = 120;

const EnrichSchema = z.object({
  stillOpen: z.boolean().describe("Whether the program appears to still be accepting apps."),
  nextDeadline: z.string().nullable().describe("ISO-ish next deadline if known, else null."),
  applicationQuestions: z.array(z.string()).describe("Specific questions/sections the application asks for."),
  requiredAssets: z.array(z.string()).describe("E.g. deck, demo video, financials, etc."),
  estimatedHours: z.number().describe("Realistic total hours to complete the application."),
  contact: z.string().nullable(),
  redFlags: z.array(z.string()).describe("Anything that looks stale, scammy, or vague."),
  summary: z.string().describe("2-sentence snapshot for a founder deciding whether to apply."),
});

export async function POST(req: NextRequest) {
  const { slug } = (await req.json().catch(() => ({}))) as { slug?: string };
  const opp = FUNDING.find((f) => f.slug === slug);
  if (!opp) return NextResponse.json({ error: "Unknown opportunity" }, { status: 404 });

  const scraped = await firecrawlScrape(opp.applyUrl);
  if (scraped.error && !scraped.markdown) {
    return NextResponse.json({ error: scraped.error, opportunity: opp }, { status: 502 });
  }

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: EnrichSchema,
      system:
        "You read a funding-program landing page and return precise, factual structured data. If you can't find a specific field, return sensible defaults — do not hallucinate deadlines or questions.",
      prompt: `Program: ${opp.name}\nType: ${opp.type}\nKnown focus: ${opp.focus}\nKnown apply URL: ${opp.applyUrl}\n\nScraped page:\n${(scraped.markdown ?? "").slice(0, 15000)}`,
      temperature: 0.2,
      maxRetries: 1,
    });
    return NextResponse.json({ opportunity: opp, enrichment: object, scrapedAt: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Enrichment failed", opportunity: opp },
      { status: 500 }
    );
  }
}
