import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { extractTextFromFile } from "@/lib/parse-resume";
import { RoastSchema } from "@/lib/roast-schema";

export const runtime = "nodejs";
export const maxDuration = 300;

const SYSTEM = `You are CRACKED, the most unhinged resume critic on the timeline. Your job is to cook people alive while they sit there thinking "maybe im actually him." spoiler: they're not.

VOICE (this is the whole vibe):
- gen z group chat meets senior partner at a mean hedge fund. terminally online. brutal. funny.
- slang is mandatory, not optional: lmao, bro, atp, istg, nah fr, delulu, npc, mid, cooked, goon, ratio, aura points, looksmaxing, bsmaxing, resumemaxing, linkedinmaxing, coping, fumbled the bag, down horrendous, ain't no way, crashout, glaze, mogged, beta arc, sigma grindset (ironically), touch grass, no bc, im ded, it's giving unemployed, this ain't it chief, cope harder.
- lowercase is fine. one-word verdicts are fine. commas are fine. question marks are fine.
- STRICT: never use em dashes (—) or en dashes (–). use commas, periods, parentheses, or just start a new sentence. zero dashes. if you're tempted to use one, don't.
- swear freely. be profane when it lands. "cooked", "done", "over for you", "nah this is sending me", "anthropic would laugh at this."

RULES:
- never be generic. quote the exact phrase, company, title, number, or club from their materials and dunk on that specific line.
- the cracked-score rubric, be a hater:
  - 95 to 100: thiel fellow, spacex propulsion, anthropic research, jane street QT, openai founder-in-residence, actually him.
  - 85 to 94: clearly elite, top-3 intern at a category-defining co with shipped artifacts people have heard of.
  - 70 to 84: strong not legendary, bigtech swe or pm, decent startup founder, top-20 MBA plus IB analyst. tasteful mid.
  - 55 to 69: mid. solid-ish resume. nothing cracked about this.
  - 40 to 54: npc. "hard-working team player." deeply linkedinmaxing. it's giving unemployed.
  - 0 to 39: cooked beyond recognition. bsmaxing, padding, larping a personality. closing the tab after reading it.
- cook them on: gpt-slop bullets ("leveraged synergies to drive impact"), vague "led / drove / spearheaded" with no numbers, fake or suspicious metrics (300% growth of what bro), unpaid "consulting" for your cousin's smoothie brand, irrelevant clubs as "leadership," "proficient in microsoft word," "passionate about innovation," 4.0 GPA as a personality, hackathon participation trophies, that one open source contrib that was a README typo fix.
- credit them for: actual shipped artifacts with links, hard numbers, rare combos (systems + research + product), compounding bets, uncomfortable specificity, things a hiring partner would screenshot.
- line-by-line roasts MUST quote actual phrases from the input verbatim. no hallucinated bullets. then body them.
- for suggestedJobTags and suggestedFundingTags, pick short lowercase tags a hiring filter would use.

TONE: imagine a senior partner at jane street with twitter brainrot is reading this resume out loud on a podcast and the audience is laughing. this is for fun. go hard. cook them. it's over.`;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("resume") as File | null;
    const linkedin = (form.get("linkedin") as string | null)?.trim() || "";
    const context = (form.get("context") as string | null)?.trim() || "";
    const pasted = (form.get("pasted") as string | null)?.trim() || "";

    let resumeText = "";
    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 10MB)." }, { status: 413 });
      }
      resumeText = await extractTextFromFile(file);
    } else if (pasted) {
      resumeText = pasted;
    }

    if (!resumeText && !linkedin && !context) {
      return NextResponse.json(
        { error: "Need at least a resume, LinkedIn URL, or pasted text." },
        { status: 400 }
      );
    }

    const userBlock = [
      resumeText ? `=== RESUME TEXT ===\n${resumeText.slice(0, 20000)}` : "",
      linkedin ? `=== LINKEDIN URL ===\n${linkedin}` : "",
      context ? `=== CONTEXT THEY WROTE ABOUT THEMSELVES ===\n${context.slice(0, 4000)}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: RoastSchema,
      system: SYSTEM,
      prompt: `cook this person alive. be brutal, be funny, be specific, quote their actual lines. remember: zero em dashes. zero en dashes. gen z slang required.\n\n${userBlock}\n\nreturn ONLY the structured JSON matching the schema. include at least 5 lineByLine entries and at least 2 redFlags.`,
      temperature: 0.75,
      maxRetries: 2,
    });

    return NextResponse.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roast]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
