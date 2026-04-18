import PptxGenJS from "pptxgenjs";
import type { PitchDeck, PitchSlide } from "./pitch-deck-schema";

const COLORS = {
  bg: "14141A",
  panel: "1F1F27",
  text: "FAFAFA",
  muted: "B8B8C2",
  accent: "FF3D00",
  border: "35353E",
};

const FONT_HEAD = "Helvetica Neue";
const FONT_BODY = "Helvetica";

export async function renderPitchDeck(deck: PitchDeck): Promise<Buffer> {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.title = `${deck.personName} — ${deck.roleTitle} @ ${deck.companyName}`;
  pres.author = deck.personName;
  pres.company = "cracked";

  for (const slide of deck.slides) {
    if (slide.kind === "title") renderTitleSlide(pres, deck, slide);
    else if (slide.kind === "closing") renderClosingSlide(pres, deck, slide);
    else renderContentSlide(pres, deck, slide);
  }

  const buf = (await pres.write({ outputType: "nodebuffer" })) as unknown as Buffer;
  return buf;
}

function renderTitleSlide(pres: PptxGenJS, deck: PitchDeck, slide: PitchSlide) {
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };

  s.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.22,
    h: 7.5,
    fill: { color: COLORS.accent },
    line: { type: "none" },
  });

  s.addText("CRACKED PITCH", {
    x: 0.7,
    y: 0.6,
    w: 9,
    h: 0.35,
    fontFace: FONT_BODY,
    fontSize: 11,
    color: COLORS.accent,
    bold: true,
    charSpacing: 8,
  });

  s.addText(slide.heading || `Why ${deck.personName} is your ${deck.roleTitle}`, {
    x: 0.7,
    y: 1.8,
    w: 11,
    h: 2.4,
    fontFace: FONT_HEAD,
    fontSize: 54,
    color: COLORS.text,
    bold: true,
    valign: "top",
  });

  s.addText(slide.subheading || `${deck.personName} · for ${deck.companyName}`, {
    x: 0.7,
    y: 4.5,
    w: 11,
    h: 0.6,
    fontFace: FONT_BODY,
    fontSize: 20,
    color: COLORS.muted,
  });

  s.addText(deck.personTagline, {
    x: 0.7,
    y: 5.2,
    w: 11,
    h: 0.5,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: COLORS.accent,
    italic: true,
  });

  s.addText(`${deck.companyName.toUpperCase()}  ·  ${deck.roleTitle.toUpperCase()}`, {
    x: 0.7,
    y: 6.9,
    w: 11,
    h: 0.3,
    fontFace: FONT_BODY,
    fontSize: 10,
    color: COLORS.muted,
    charSpacing: 6,
  });
}

function renderContentSlide(pres: PptxGenJS, deck: PitchDeck, slide: PitchSlide) {
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };

  s.addShape(pres.ShapeType.rect, {
    x: 0.6,
    y: 0.6,
    w: 0.08,
    h: 0.4,
    fill: { color: COLORS.accent },
    line: { type: "none" },
  });

  s.addText(labelForKind(slide.kind), {
    x: 0.85,
    y: 0.6,
    w: 8,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 10,
    color: COLORS.accent,
    bold: true,
    charSpacing: 6,
  });

  s.addText(slide.heading, {
    x: 0.6,
    y: 1.15,
    w: 11.8,
    h: 1.1,
    fontFace: FONT_HEAD,
    fontSize: 34,
    color: COLORS.text,
    bold: true,
  });

  if (slide.subheading) {
    s.addText(slide.subheading, {
      x: 0.6,
      y: 2.25,
      w: 11.8,
      h: 0.8,
      fontFace: FONT_BODY,
      fontSize: 16,
      color: COLORS.muted,
    });
  }

  const bulletsTop = slide.subheading ? 3.1 : 2.45;
  const hasAccent = !!slide.accentNote;
  const bulletsWidth = hasAccent ? 8.4 : 11.8;

  if (slide.bullets && slide.bullets.length > 0) {
    const lines = slide.bullets.map((b) => ({ text: b, options: { bullet: { code: "25CF" } } }));
    s.addText(lines, {
      x: 0.7,
      y: bulletsTop,
      w: bulletsWidth,
      h: 7.5 - bulletsTop - 0.4,
      fontFace: FONT_BODY,
      fontSize: 16,
      color: COLORS.text,
      paraSpaceAfter: 10,
      valign: "top",
    });
  }

  if (hasAccent) {
    const cardX = 9.3;
    const cardY = bulletsTop;
    const cardW = 3.4;
    const cardH = 3.2;
    s.addShape(pres.ShapeType.roundRect, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: COLORS.panel },
      line: { color: COLORS.accent, width: 1 },
      rectRadius: 0.12,
    });
    s.addText("HIGHLIGHT", {
      x: cardX + 0.2,
      y: cardY + 0.2,
      w: cardW - 0.4,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: COLORS.accent,
      bold: true,
      charSpacing: 5,
    });
    s.addText(slide.accentNote!, {
      x: cardX + 0.2,
      y: cardY + 0.55,
      w: cardW - 0.4,
      h: cardH - 0.7,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: COLORS.text,
      valign: "top",
    });
  }

  s.addText(`${deck.personName}  ·  ${deck.companyName}  ·  ${deck.roleTitle}`, {
    x: 0.6,
    y: 7.1,
    w: 11.8,
    h: 0.3,
    fontFace: FONT_BODY,
    fontSize: 9,
    color: COLORS.muted,
    charSpacing: 4,
  });
}

function renderClosingSlide(pres: PptxGenJS, deck: PitchDeck, slide: PitchSlide) {
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };

  s.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.22,
    fill: { color: COLORS.accent },
    line: { type: "none" },
  });

  s.addText(slide.heading || "Let's build this.", {
    x: 0.7,
    y: 2.4,
    w: 12,
    h: 1.4,
    fontFace: FONT_HEAD,
    fontSize: 46,
    color: COLORS.text,
    bold: true,
  });

  if (slide.subheading) {
    s.addText(slide.subheading, {
      x: 0.7,
      y: 3.9,
      w: 12,
      h: 0.8,
      fontFace: FONT_BODY,
      fontSize: 18,
      color: COLORS.muted,
    });
  }

  if (slide.bullets && slide.bullets.length > 0) {
    const lines = slide.bullets.map((b) => ({ text: b, options: {} }));
    s.addText(lines, {
      x: 0.7,
      y: 5.0,
      w: 12,
      h: 1.6,
      fontFace: FONT_BODY,
      fontSize: 16,
      color: COLORS.accent,
      paraSpaceAfter: 6,
    });
  }

  s.addText(`${deck.personName}  ·  Pitch for ${deck.companyName}`, {
    x: 0.7,
    y: 7.1,
    w: 12,
    h: 0.3,
    fontFace: FONT_BODY,
    fontSize: 10,
    color: COLORS.muted,
    charSpacing: 5,
  });
}

function labelForKind(kind: PitchSlide["kind"]): string {
  switch (kind) {
    case "title":
      return "01 · TITLE";
    case "hook":
      return "HOOK";
    case "why_fit":
      return "WHY I'M THE FIT";
    case "experience":
      return "RELEVANT EXPERIENCE";
    case "projects":
      return "SELECTED PROJECTS";
    case "skills":
      return "WHAT I BRING";
    case "plan":
      return "FIRST 90 DAYS";
    case "closing":
      return "CLOSE";
  }
}
