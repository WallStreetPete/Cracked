import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { to, subject, body, from } = (await req.json().catch(() => ({}))) as {
    to?: string;
    subject?: string;
    body?: string;
    from?: string;
  };
  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Missing to/subject/body" }, { status: 400 });
  }
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return NextResponse.json(
      {
        error:
          "GMAIL_USER and GMAIL_APP_PASSWORD not configured. Add an app password from Google > Security > 2-step verification > App passwords, then set in .env.",
      },
      { status: 501 }
    );
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    const info = await transporter.sendMail({
      from: from ?? user,
      to,
      subject,
      text: body,
    });
    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
