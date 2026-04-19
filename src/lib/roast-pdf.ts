import PDFDocument from "pdfkit";
import type { RoastResult } from "./roast-schema";

const ACCENT = "#FF3D00";
const FG = "#14141A";
const MUTED = "#555560";
const SUCCESS = "#1B9E4B";
const DANGER = "#D7263D";
const WARN = "#E7A33A";

function ratingColor(rating: number) {
  if (rating >= 7) return SUCCESS;
  if (rating >= 4) return WARN;
  return DANGER;
}

export async function renderRoastPdf(result: RoastResult, memePng?: Buffer): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 56, bottom: 56, left: 56, right: 56 },
      info: { Title: "Cracked Roast Report", Author: "getcracked.wtf" },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const PAGE_W = doc.page.width - 112;

    // header
    doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(28).text("CRACKED.", { continued: true });
    doc.fillColor(FG).text(" roast report");
    doc.moveDown(0.2);
    doc.font("Helvetica").fontSize(9).fillColor(MUTED).text("generated at getcracked.wtf");
    doc.moveDown(1);

    // score block
    doc.save();
    doc.roundedRect(doc.x, doc.y, PAGE_W, 90, 10).fillAndStroke("#F6F6F8", "#E2E2E8");
    doc.restore();
    const scoreTop = doc.y + 14;
    doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(56).text(String(result.crackedScore), doc.x + 20, scoreTop, { continued: true });
    doc.fillColor(MUTED).font("Helvetica").fontSize(12).text("  / 100", { baseline: "top" });
    doc.fillColor(FG).font("Helvetica-Bold").fontSize(13).text(result.verdict, doc.x + 160, scoreTop + 4, { width: PAGE_W - 180 });
    doc.fillColor(MUTED).font("Helvetica-Oblique").fontSize(10).text(`"${result.oneLinerMeme}"`, { width: PAGE_W - 180 });
    doc.fillColor(MUTED).font("Helvetica").fontSize(9).text(
      `category: ${result.category.replace(/_/g, " ")}  ·  confidence ${Math.round(result.categoryConfidence * 100)}%`,
      { width: PAGE_W - 180 }
    );
    doc.y = scoreTop + 96;
    doc.x = 56;
    doc.moveDown(0.5);

    // score breakdown
    sectionHeader(doc, "score breakdown");
    const breakdown = Object.entries(result.scoreBreakdown);
    const colW = PAGE_W / breakdown.length;
    const bdTop = doc.y;
    breakdown.forEach(([k, v], i) => {
      const x = 56 + colW * i;
      doc.fillColor(FG).font("Helvetica-Bold").fontSize(18).text(String(v), x, bdTop, { width: colW, align: "center" });
      doc.fillColor(MUTED).font("Helvetica").fontSize(8).text(
        k.replace(/([A-Z])/g, " $1").trim().toLowerCase(),
        x,
        bdTop + 24,
        { width: colW, align: "center" }
      );
    });
    doc.y = bdTop + 44;
    doc.x = 56;

    // strengths + red flags (two cols)
    const twoColTop = doc.y;
    const colWidth = (PAGE_W - 16) / 2;
    sectionHeader(doc, "what's actually cracked", SUCCESS);
    const sTop = doc.y;
    result.strengths.forEach((s) => bulletLine(doc, "▲", SUCCESS, s, colWidth));
    const sEnd = doc.y;

    doc.x = 56 + colWidth + 16;
    doc.y = twoColTop;
    sectionHeader(doc, "red flags", DANGER);
    result.redFlags.forEach((s) => bulletLine(doc, "▼", DANGER, s, colWidth));
    const rEnd = doc.y;

    doc.x = 56;
    doc.y = Math.max(sEnd, rEnd) + 8;

    // line by line
    if (result.lineByLine.length) {
      ensureRoom(doc, 80);
      sectionHeader(doc, "line-by-line demolition");
      result.lineByLine.forEach((l) => {
        ensureRoom(doc, 60);
        const y0 = doc.y;
        doc.save();
        doc.roundedRect(56, y0, PAGE_W, 4, 2).fill(ratingColor(l.rating));
        doc.restore();
        doc.y = y0 + 10;
        doc.fillColor(MUTED).font("Helvetica-Oblique").fontSize(9).text(`"${l.quote}"`, 56, doc.y, { width: PAGE_W - 48 });
        doc.fillColor(ratingColor(l.rating)).font("Helvetica-Bold").fontSize(9).text(`${l.rating}/10`, 56 + PAGE_W - 40, y0 + 10, { width: 40, align: "right" });
        doc.fillColor(FG).font("Helvetica").fontSize(10).text(l.roast, 56, doc.y + 2, { width: PAGE_W });
        if (l.fix) {
          doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(8).text("fix → ", { continued: true });
          doc.fillColor(MUTED).font("Helvetica").fontSize(8).text(l.fix, { width: PAGE_W });
        }
        doc.moveDown(0.6);
      });
    }

    // level up plan
    if (result.levelUpPlan.length) {
      ensureRoom(doc, 60);
      sectionHeader(doc, "30 / 60 / 90 level-up");
      result.levelUpPlan.forEach((p, i) => {
        ensureRoom(doc, 28);
        doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(10).text(String(i + 1).padStart(2, "0") + "  ", { continued: true });
        doc.fillColor(FG).font("Helvetica").fontSize(10).text(p, { width: PAGE_W });
        doc.moveDown(0.3);
      });
    }

    // comparables
    ensureRoom(doc, 100);
    const compTop = doc.y;
    sectionHeader(doc, "above you", ACCENT);
    result.comparables.aboveYou.forEach((s) => bulletLine(doc, "◆", ACCENT, s, colWidth));
    const aEnd = doc.y;
    doc.x = 56 + colWidth + 16;
    doc.y = compTop;
    sectionHeader(doc, "below you", MUTED);
    result.comparables.belowYou.forEach((s) => bulletLine(doc, "◇", MUTED, s, colWidth));
    const bEnd = doc.y;
    doc.x = 56;
    doc.y = Math.max(aEnd, bEnd) + 8;

    // meme on last page
    if (memePng && memePng.length > 0) {
      doc.addPage();
      doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(18).text("the receipt.");
      doc.moveDown(0.5);
      const size = Math.min(PAGE_W, 420);
      const x = 56 + (PAGE_W - size) / 2;
      try {
        doc.image(memePng, x, doc.y, { width: size, height: size });
        doc.y += size + 12;
      } catch {
        doc.fillColor(MUTED).font("Helvetica").fontSize(9).text("(meme image failed to embed)");
      }
    }

    // footer
    ensureRoom(doc, 40);
    doc.moveDown(1);
    doc.strokeColor("#E2E2E8").lineWidth(1).moveTo(56, doc.y).lineTo(56 + PAGE_W, doc.y).stroke();
    doc.moveDown(0.4);
    doc.fillColor(MUTED).font("Helvetica").fontSize(8).text(
      "roasted by getcracked.wtf  ·  claude opus 4.7  ·  share this at your own risk",
      { align: "center" }
    );

    doc.end();
  });
}

function sectionHeader(doc: PDFKit.PDFDocument, label: string, color = ACCENT) {
  doc.moveDown(0.4);
  doc.fillColor(color).font("Helvetica-Bold").fontSize(10).text(label.toUpperCase(), { characterSpacing: 1.4 });
  doc.moveDown(0.25);
}

function bulletLine(doc: PDFKit.PDFDocument, bullet: string, color: string, text: string, width: number) {
  const startX = doc.x;
  const startY = doc.y;
  doc.fillColor(color).font("Helvetica-Bold").fontSize(10).text(bullet + " ", startX, startY, { continued: true, width });
  doc.fillColor(FG).font("Helvetica").fontSize(10).text(text, { width });
  doc.x = startX;
}

function ensureRoom(doc: PDFKit.PDFDocument, needed: number) {
  const bottom = doc.page.height - 72;
  if (doc.y + needed > bottom) doc.addPage();
}
