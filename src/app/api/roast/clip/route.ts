import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  verdict?: string;
  oneLinerMeme?: string;
  category?: string;
  crackedScore?: number;
  scenePrompt?: string;
};

export async function POST(req: NextRequest) {
  try {
    const key = process.env.Fal_API_KEY || process.env.FAL_KEY;
    if (!key) return NextResponse.json({ error: "Missing FAL API key" }, { status: 500 });
    fal.config({ credentials: key });

    const body = (await req.json()) as Body;
    const oneLiner = body.oneLinerMeme ?? body.verdict ?? "cooked beyond recognition";
    const category = body.category ?? "professional";
    const score = body.crackedScore ?? 50;

    const scene =
      body.scenePrompt ??
      `A brutal satirical roast clip about a ${category.replace(/_/g, " ")} with a cracked score of ${score} out of 100. Bold cartoon animation, exaggerated facial expressions, dynamic camera. The subject is visibly cooked, mogged, caught mid-cringe. Flashing subtitle caption: "${oneLiner.slice(0, 100)}". Tech-bro / finance-bro satirical energy. Vibrant saturated colors. 5 second loop, no em dashes, no text errors.`;

    const result = await fal.subscribe("fal-ai/ltx-video", {
      input: { prompt: scene },
      logs: false,
    });

    const data = result.data as { video?: { url?: string } };
    const url = data?.video?.url;
    if (!url) return NextResponse.json({ error: "No video URL returned" }, { status: 502 });
    return NextResponse.json({ videoUrl: url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roast/clip]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
