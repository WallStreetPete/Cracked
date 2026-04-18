import { NextRequest, NextResponse } from "next/server";
import { COMPANIES, ROLE_PRESETS } from "@/lib/companies";
import { findContacts } from "@/lib/exa";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { slug?: string; role?: string };
  const company = COMPANIES.find((c) => c.slug === body.slug);
  if (!company) return NextResponse.json({ error: "Unknown company" }, { status: 404 });

  const preset = ROLE_PRESETS.find((p) => p.key === body.role);
  const roleHint = preset ? preset.queries[0] : body.role ?? "";

  const results = await findContacts({ company: company.name, role: roleHint, numResults: 10 });
  return NextResponse.json({ company: company.slug, role: body.role ?? null, results });
}
