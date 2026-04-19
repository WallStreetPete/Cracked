import { NextRequest, NextResponse } from "next/server";
import { renderRoastPdf } from "@/lib/roast-pdf";
import type { RoastResult } from "@/lib/roast-schema";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  result: RoastResult;
  memeBase64?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    if (!body?.result) {
      return NextResponse.json({ error: "Missing result" }, { status: 400 });
    }
    let meme: Buffer | undefined;
    if (body.memeBase64) {
      const stripped = body.memeBase64.replace(/^data:image\/\w+;base64,/, "");
      meme = Buffer.from(stripped, "base64");
    }
    const buf = await renderRoastPdf(body.result, meme);
    const filename = `cracked-roast-${body.result.crackedScore}-${Date.now()}.pdf`;
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roast/pdf]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
