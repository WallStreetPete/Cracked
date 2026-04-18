import "server-only";

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const mod = await import("pdf-parse");
    const pdf = (mod as { default?: (b: Buffer) => Promise<{ text: string }> }).default ?? (mod as unknown as (b: Buffer) => Promise<{ text: string }>);
    const out = await pdf(buf);
    return cleanup(out.text);
  }

  if (
    name.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const out = await mammoth.extractRawText({ buffer: buf });
    return cleanup(out.value);
  }

  if (name.endsWith(".txt") || file.type === "text/plain") {
    return cleanup(buf.toString("utf8"));
  }

  return cleanup(buf.toString("utf8"));
}

function cleanup(s: string): string {
  return s
    .replace(/\r/g, "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
