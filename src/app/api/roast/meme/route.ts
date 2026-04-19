import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  verdict?: string;
  oneLinerMeme?: string;
  crackedScore?: number;
  category?: string;
  topText?: string;
  bottomText?: string;
};

function normalize(s: string, max = 60) {
  return s.replace(/—/g, ",").replace(/–/g, ",").slice(0, max).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.Gemini_AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });

    const body = (await req.json()) as Body;
    const oneLiner = (body.oneLinerMeme ?? body.verdict ?? "COOKED").trim();
    const top = normalize(body.topText ?? `CRACKED SCORE: ${body.crackedScore ?? "?"}/100`, 60);
    const bottom = normalize(body.bottomText ?? oneLiner, 90);

    const prompt = `Create a viral roast meme image, square 1:1, classic meme format with bold white Impact-style caption text with black outline at the TOP and BOTTOM of the image. No em dashes, no en dashes.
TOP TEXT (render exactly): "${top}"
BOTTOM TEXT (render exactly): "${bottom}"
Style: satirical cartoon, exaggerated facial expression, tech/finance/startup cultural references, visually readable at thumbnail size. The character should look visibly cooked, mogged, or caught in a moment of cringe. Bright saturated colors. Keep text legible and spelled exactly as given. Make it genuinely funny, not mean-spirited in a cruel way, roast-battle energy. Category hint: ${body.category ?? "professional"}.`;

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
    return NextResponse.json({ error: "No image returned" }, { status: 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roast/meme]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
