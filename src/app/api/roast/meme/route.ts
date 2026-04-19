import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  verdict?: string;
  oneLinerMeme?: string;
  crackedScore?: number;
  category?: string;
  redFlags?: string[];
  topLine?: string;
};

const MEME_TEMPLATES = [
  "drake-meme",
  "distracted-boyfriend",
  "two-buttons-sweating",
  "gigachad-vs-soyjak",
  "virgin-vs-chad",
  "this-is-fine-dog-in-burning-room",
  "expanding-brain-four-panel",
  "npc-wojak-grey-face",
  "crying-cat-over-laptop",
  "stonks-guy-meme",
  "wojak-doomer-glasses",
  "trad-climber-sweating-meme",
];

function clean(s: string | undefined, max = 80) {
  if (!s) return "";
  return s.replace(/—/g, ",").replace(/–/g, ",").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.Gemini_AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });

    const body = (await req.json()) as Body;
    const verdict = clean(body.verdict, 180);
    const oneLiner = clean(body.oneLinerMeme, 120);
    const score = body.crackedScore ?? 50;
    const category = (body.category ?? "professional").replace(/_/g, " ");
    const flags = (body.redFlags ?? []).map((f) => clean(f, 140)).filter(Boolean).slice(0, 3);
    const topLine = clean(body.topLine, 120);
    const template = MEME_TEMPLATES[Math.floor(Math.random() * MEME_TEMPLATES.length)];

    const flagsBlock = flags.length ? `\nSPECIFIC ROAST DETAILS TO REFERENCE:\n- ${flags.join("\n- ")}` : "";
    const topBlock = topLine ? `\nACTUAL LINE FROM THEIR RESUME: "${topLine}"` : "";

    const prompt = `You are generating a VIRAL, DEVASTATINGLY FUNNY, shareable roast meme image in classic Internet meme format. Think "peak of r/ProgrammerHumor crossed with Twitter FinBro mockery crossed with a SNL cold open." Audience: chronically online gen-z and millennials in tech, finance, and startups.

MEME TEMPLATE TO USE: "${template}". Interpret this template faithfully, execute the standard layout and visual gag, but adapt the captions to THIS person's specific roast.

THEIR PROFILE:
- Cracked score: ${score}/100
- Category: ${category}
- Verdict: ${verdict}
- One-liner roast: "${oneLiner}"${topBlock}${flagsBlock}

VISUAL REQUIREMENTS:
- Square 1:1 composition, 1024x1024 feel.
- Bold white Impact-style meme caption text with thick black outline. Text MUST be legible and spelled exactly.
- Cartoon or digital-illustration style. Exaggerated, ridiculous facial expressions. Overacted body language. Think Bob's Burgers meets Cyanide and Happiness meets Wojak.
- One clear visual punchline, one clear caption punchline. The two together should make a chronically-online person actually laugh out loud.
- Reference real tech/finance/startup iconography when it fits: monitors showing Slack, Bloomberg terminals, github profiles with 0 contributions, a Jira board, a "Stanford" sweatshirt, an empty Calendly, a rocket labeled with a company name, a nametag with a bank logo, an open LinkedIn tab with 'Open to Work', a ChatGPT window mid-prompt.
- NO em dashes. NO en dashes. NO smart quotes. No misspelled words. No gibberish text.

TONE: savage, specific, satirical, shareable. The meme should feel like something an actual human made to personally attack this person in a group chat, not like a generic AI stock meme. Lean into the absurd. Be mean but witty. If there's a gpt-slop phrase in their resume, put it on the image verbatim. If they picked a mid job over a cracked one, make the visual contrast painful.

Do not include any watermark, logo, or signature. Output the finished meme image only.`;

    const ai = new GoogleGenAI({ apiKey });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    const parts = res.candidates?.[0]?.content?.parts ?? [];
    for (const p of parts) {
      if (p.inlineData?.data) {
        const buf = Buffer.from(p.inlineData.data, "base64");
        return new NextResponse(new Uint8Array(buf), {
          headers: {
            "content-type": p.inlineData.mimeType || "image/png",
            "cache-control": "no-store",
          },
        });
      }
    }
    return NextResponse.json({ error: "No image returned by Gemini" }, { status: 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roast/meme]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
