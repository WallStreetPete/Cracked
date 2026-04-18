import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { PitchDeck } from "@/lib/pitch-deck-schema";
import { renderPitchDeck } from "@/lib/pitch-deck-render";

export const runtime = "nodejs";
export const maxDuration = 120;

const SYSTEM = `You are a top-tier career strategist writing a concise, credible pitch deck that positions a candidate for a specific role at a specific company.

Rules:
- 5-7 slides total. Order: title, hook, why_fit, 1-2 experience/projects slides, optionally skills or plan, closing.
- Every concrete claim must be grounded in the candidate's resume, LinkedIn, website, or featured projects. Do NOT fabricate credentials, dates, numbers, or employers.
- Map candidate evidence to the company's actual needs (derived from the job description / company blurb / tags). Name specific tools, systems, shipped outcomes.
- Style: confident, specific, non-groveling. No generic buzzwords ("passionate team player", "detail-oriented", "proven track record"). No "synergy", "leverage", "results-driven".
- Bullets are tight: 8-18 words each. Lead with outcome/metric/shipped thing, then context. Use active verbs.
- Subheadings are a single clear line.
- Use the accentNote field for the strongest data point on that slide (a shipped metric, a named system, a rare combination of skills).
- The title slide heading should be a sharp one-line thesis like "Why <Name> is your <Role>" or a memorable positioning statement.
- The closing slide should include a tiny, specific ask: a 30-min call, a paid trial week, a whiteboard session on a real problem.
- Do NOT use em/en dashes. Hyphens only.
- No emoji. No decorative symbols in text.`;

type ReqBody = {
  personName?: string;
  personTagline?: string;
  resumeText?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  featuredProjects?: string;
  contactEmail?: string;
  extraContext?: string;
  roastSummary?: string;
  company?: {
    name?: string;
    website?: string;
    blurb?: string;
    category?: string;
    tags?: string[];
  };
  role?: {
    title?: string;
    url?: string;
    snippet?: string;
  };
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as ReqBody;

  const companyName = body.company?.name?.trim() || "";
  const roleTitle = body.role?.title?.trim() || body.role?.snippet?.slice(0, 60) || "target role";
  const personName = body.personName?.trim() || "Candidate";

  if (!companyName) {
    return NextResponse.json({ error: "Missing company name." }, { status: 400 });
  }
  if (!body.resumeText && !body.linkedinUrl && !body.roastSummary) {
    return NextResponse.json({ error: "Need at least resume text, LinkedIn URL, or roast summary." }, { status: 400 });
  }

  const prompt = [
    `COMPANY: ${companyName}`,
    body.company?.website ? `Company website: ${body.company.website}` : "",
    body.company?.blurb ? `Company blurb: ${body.company.blurb}` : "",
    body.company?.category ? `Category: ${body.company.category}` : "",
    body.company?.tags?.length ? `Tags: ${body.company.tags.join(", ")}` : "",
    "",
    `ROLE: ${roleTitle}`,
    body.role?.url ? `Role URL: ${body.role.url}` : "",
    body.role?.snippet ? `Role snippet / description excerpt:\n${body.role.snippet}` : "",
    "",
    `CANDIDATE: ${personName}`,
    body.personTagline ? `Self-described tagline: ${body.personTagline}` : "",
    body.contactEmail ? `Contact email: ${body.contactEmail}` : "",
    body.linkedinUrl ? `LinkedIn: ${body.linkedinUrl}` : "",
    body.websiteUrl ? `Personal website: ${body.websiteUrl}` : "",
    "",
    body.resumeText ? `=== RESUME (verbatim) ===\n${body.resumeText.slice(0, 12000)}\n` : "",
    body.featuredProjects ? `=== PROJECTS TO FEATURE ===\n${body.featuredProjects.slice(0, 3000)}\n` : "",
    body.roastSummary ? `=== PRIOR CRACKED ROAST SUMMARY (JSON; use strengths, comparables.aboveYou, suggestedJobTags as signal) ===\n${body.roastSummary.slice(0, 6000)}\n` : "",
    body.extraContext ? `=== EXTRA CONTEXT ===\n${body.extraContext.slice(0, 2000)}\n` : "",
    "",
    `Now write the pitch deck as structured JSON. Use the real candidate data above to ground every slide. Map the candidate's strongest evidence to what this specific company and role need.`,
  ]
    .filter(Boolean)
    .join("\n");

  let deck;
  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: PitchDeck,
      system: SYSTEM,
      prompt,
      temperature: 0.6,
      maxRetries: 1,
    });
    deck = object;
    if (!deck.personName) deck.personName = personName;
    if (!deck.companyName) deck.companyName = companyName;
    if (!deck.roleTitle) deck.roleTitle = roleTitle;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  let pptxBuffer: Buffer;
  try {
    pptxBuffer = await renderPitchDeck(deck);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Render failed";
    return NextResponse.json({ error: `Render failed: ${message}` }, { status: 500 });
  }

  const filename = safeFilename(`${personName}-pitch-${companyName}-${roleTitle}.pptx`);

  return new NextResponse(new Uint8Array(pptxBuffer), {
    status: 200,
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}

function safeFilename(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "pitch.pptx";
}
