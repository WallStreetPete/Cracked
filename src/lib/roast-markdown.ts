import type { RoastResult } from "./roast-schema";

export function roastToMarkdown(result: RoastResult): string {
  const lines: string[] = [];
  const breakdown = result.scoreBreakdown;
  const cat = result.category.replace(/_/g, " ");
  const conf = Math.round(result.categoryConfidence * 100);

  lines.push(`# CRACKED roast report`);
  lines.push("");
  lines.push(`**Score:** ${result.crackedScore} / 100`);
  lines.push(`**Category:** ${cat} (${conf}% confidence)`);
  lines.push("");
  lines.push(`> ${result.verdict}`);
  lines.push("");
  lines.push(`*"${result.oneLinerMeme}"*`);
  lines.push("");
  lines.push("---");
  lines.push("");

  lines.push(`## Score breakdown`);
  lines.push("");
  lines.push(`| Axis | Score |`);
  lines.push(`|------|------:|`);
  lines.push(`| Technical depth | ${breakdown.technicalDepth} |`);
  lines.push(`| Ambition | ${breakdown.ambition} |`);
  lines.push(`| Execution evidence | ${breakdown.executionEvidence} |`);
  lines.push(`| Prestige signal | ${breakdown.prestigeSignal} |`);
  lines.push(`| Taste | ${breakdown.taste} |`);
  lines.push("");

  lines.push(`## What's actually cracked`);
  lines.push("");
  result.strengths.forEach((s) => lines.push(`- ▲ ${s}`));
  lines.push("");

  lines.push(`## Red flags`);
  lines.push("");
  result.redFlags.forEach((s) => lines.push(`- ▼ ${s}`));
  lines.push("");

  lines.push(`## Line-by-line demolition`);
  lines.push("");
  result.lineByLine.forEach((l, i) => {
    lines.push(`### ${i + 1}. ${l.rating}/10`);
    lines.push("");
    lines.push(`> "${l.quote}"`);
    lines.push("");
    lines.push(l.roast);
    if (l.fix) {
      lines.push("");
      lines.push(`**Fix →** ${l.fix}`);
    }
    lines.push("");
  });

  lines.push(`## 30 / 60 / 90 level-up plan`);
  lines.push("");
  result.levelUpPlan.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
  lines.push("");

  lines.push(`## Comparables`);
  lines.push("");
  lines.push(`**Above you**`);
  lines.push("");
  result.comparables.aboveYou.forEach((s) => lines.push(`- ◆ ${s}`));
  lines.push("");
  lines.push(`**Below you**`);
  lines.push("");
  result.comparables.belowYou.forEach((s) => lines.push(`- ◇ ${s}`));
  lines.push("");

  if (result.suggestedJobTags.length) {
    lines.push(`**Suggested job filters:** ${result.suggestedJobTags.join(", ")}`);
    lines.push("");
  }
  if (result.suggestedFundingTags.length) {
    lines.push(`**Suggested funding filters:** ${result.suggestedFundingTags.join(", ")}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(`*Roasted by [getcracked.wtf](https://getcracked.wtf) · Claude Opus 4.7*`);

  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|\s)\*([^*]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let listBuf: string[] = [];
  let listKind: "ul" | "ol" | null = null;
  let paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length) {
      out.push(`<p>${inline(paraBuf.join(" "))}</p>`);
      paraBuf = [];
    }
  };
  const flushList = () => {
    if (listKind && listBuf.length) {
      out.push(`<${listKind}>${listBuf.map((li) => `<li>${inline(li)}</li>`).join("")}</${listKind}>`);
      listBuf = [];
      listKind = null;
    }
  };
  const flushTable = () => {
    if (inTable && tableRows.length >= 2) {
      const [head, , ...body] = tableRows;
      out.push(
        `<table><thead><tr>${head
          .map((c) => `<th>${inline(c.trim())}</th>`)
          .join("")}</tr></thead><tbody>${body
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c.trim())}</td>`).join("")}</tr>`)
          .join("")}</tbody></table>`
      );
    }
    inTable = false;
    tableRows = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\r$/, "");

    if (/^\s*\|.*\|\s*$/.test(line)) {
      flushPara();
      flushList();
      inTable = true;
      const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|");
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.trim() === "") {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara();
      flushList();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara();
      flushList();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      flushPara();
      flushList();
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara();
      flushList();
      out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }
    if (line.trim() === "---") {
      flushPara();
      flushList();
      out.push(`<hr />`);
      continue;
    }
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    if (ol) {
      flushPara();
      if (listKind !== "ol") flushList();
      listKind = "ol";
      listBuf.push(ol[2]);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      if (listKind !== "ul") flushList();
      listKind = "ul";
      listBuf.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }
    paraBuf.push(line.trim());
  }
  flushPara();
  flushList();
  flushTable();
  return out.join("\n");
}

export function buildPrintableHtml(
  md: string,
  opts: { title?: string; memeDataUrl?: string } = {}
): string {
  const body = markdownToHtml(md);
  const title = opts.title ?? "Cracked roast report";
  const meme = opts.memeDataUrl
    ? `<figure class="meme"><img src="${opts.memeDataUrl}" alt="roast meme" /><figcaption>the receipt</figcaption></figure>`
    : "";
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @page { size: Letter; margin: 0.75in; }
  :root { --accent: #FF3D00; --fg: #14141A; --muted: #555560; --success: #1B9E4B; --danger: #D7263D; --rule: #E4E4EA; }
  * { box-sizing: border-box; }
  html, body { background: #fff; color: var(--fg); }
  body { font-family: ui-sans-serif, -apple-system, "Segoe UI", Inter, Helvetica, Arial, sans-serif; font-size: 11.5pt; line-height: 1.55; margin: 0 auto; max-width: 7.5in; padding: 0.6in 0.5in; }
  h1 { font-size: 26pt; margin: 0 0 6pt; color: var(--accent); letter-spacing: -0.02em; }
  h2 { font-size: 14pt; margin: 24pt 0 8pt; padding-top: 10pt; border-top: 1px solid var(--rule); letter-spacing: 0.04em; text-transform: uppercase; color: var(--fg); }
  h3 { font-size: 11pt; margin: 14pt 0 4pt; color: var(--accent); letter-spacing: 0.04em; text-transform: uppercase; }
  p { margin: 0 0 8pt; }
  strong { color: var(--fg); }
  em { color: var(--muted); }
  a { color: var(--accent); text-decoration: none; }
  blockquote { margin: 6pt 0 10pt; padding: 8pt 14pt; border-left: 3px solid var(--accent); background: #FFF5F1; font-style: italic; color: #3a3a45; border-radius: 0 6pt 6pt 0; }
  hr { border: none; border-top: 1px solid var(--rule); margin: 14pt 0; }
  ul, ol { margin: 4pt 0 10pt 18pt; padding: 0; }
  li { margin: 2pt 0; }
  table { border-collapse: collapse; width: 100%; margin: 6pt 0 14pt; font-size: 10.5pt; }
  th, td { border-bottom: 1px solid var(--rule); padding: 6pt 10pt; text-align: left; }
  th { background: #FAFAFC; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; font-size: 9pt; color: var(--muted); }
  td:last-child, th:last-child { text-align: right; font-variant-numeric: tabular-nums; }
  .meme { margin: 20pt auto 0; text-align: center; break-before: page; }
  .meme img { max-width: 5in; border-radius: 10pt; border: 1px solid var(--rule); }
  .meme figcaption { margin-top: 8pt; color: var(--muted); font-size: 9.5pt; letter-spacing: 0.08em; text-transform: uppercase; }
  .print-bar { position: fixed; top: 10px; right: 10px; display: flex; gap: 8px; font-family: inherit; }
  .print-bar button { background: var(--accent); color: #fff; border: 0; border-radius: 8px; padding: 8px 14px; font-weight: 600; cursor: pointer; font-size: 12px; }
  .print-bar .ghost { background: #fff; color: var(--fg); border: 1px solid var(--rule); }
  @media print { .print-bar { display: none !important; } h2 { break-after: avoid; } h3 { break-after: avoid; } blockquote, figure { break-inside: avoid; } }
</style>
</head><body>
<div class="print-bar">
  <button onclick="window.print()">Save as PDF</button>
  <button class="ghost" onclick="window.close()">Close</button>
</div>
${body}
${meme}
<script>window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 400); });</script>
</body></html>`;
}
