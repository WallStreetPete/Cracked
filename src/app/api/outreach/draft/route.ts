import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 120;

const EmailSchema = z.object({
  subject: z.string().min(3).max(120),
  body: z.string().min(120),
});

const SYSTEM = `You write cold outreach emails that actually get responses. Rules:
- SHORT (90–160 words max).
- Specific: reference one unusually concrete thing about the recipient (project, paper, tweet, shipped feature) if provided.
- Plain, confident, non-groveling. No "I hope this email finds you well." No "just reaching out."
- Lead with a reason they should care. End with a tiny ask (15-min call, or reply with a thought).
- Never fake specificity. If no concrete anchor is provided, use the company/role.
- Subject line: 3–8 words, clever, lowercase preferred, no emoji.
- Sign with [Your Name] placeholder.`;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    contactName?: string;
    contactRole?: string;
    contactContext?: string;
    companyName?: string;
    jobTitle?: string;
    jobUrl?: string;
    senderProfile?: string;
    senderAsks?: string;
    feedback?: string;
    previousDraft?: { subject?: string; body?: string };
  };

  const iterationBlock = body.previousDraft?.body
    ? `\n=== PREVIOUS DRAFT ===\nSubject: ${body.previousDraft.subject ?? ""}\n\n${body.previousDraft.body}\n`
    : "";
  const feedbackBlock = body.feedback ? `\n=== USER FEEDBACK ON PREVIOUS DRAFT ===\n${body.feedback}\n` : "";

  const prompt = `Recipient: ${body.contactName ?? "Hiring team"}${body.contactRole ? ` (${body.contactRole})` : ""} at ${body.companyName ?? ""}.
Recipient context: ${body.contactContext ?? "(none)"}
Role of interest: ${body.jobTitle ?? "(any relevant role)"}. URL: ${body.jobUrl ?? "(n/a)"}
About the sender: ${body.senderProfile ?? "(none)"}
Specific ask: ${body.senderAsks ?? "15-min intro call"}${iterationBlock}${feedbackBlock}

Write the email now. If a previous draft is provided, rewrite it applying the user's feedback; otherwise write from scratch. Do NOT just tweak — make real edits when feedback is given.`;

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: EmailSchema,
      system: SYSTEM,
      prompt,
      temperature: 0.7,
      maxRetries: 1,
    });
    return NextResponse.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
