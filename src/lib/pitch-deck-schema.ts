import { z } from "zod";

export const PitchSlideKind = z.enum([
  "title",
  "hook",
  "why_fit",
  "experience",
  "projects",
  "skills",
  "plan",
  "closing",
]);
export type PitchSlideKind = z.infer<typeof PitchSlideKind>;

export const PitchSlide = z.object({
  kind: PitchSlideKind,
  heading: z.string().min(2).max(80).describe("The main headline for the slide. Tight, punchy, specific."),
  subheading: z.string().max(180).optional().describe("A one-line subtitle or dek."),
  bullets: z
    .array(z.string().min(2).max(200))
    .max(6)
    .optional()
    .describe("Up to 6 short bullets. No generic buzzwords. Each bullet should reference a concrete thing from the resume mapped to the job's needs."),
  accentNote: z.string().max(180).optional().describe("Optional highlighted quote/metric/callout."),
});
export type PitchSlide = z.infer<typeof PitchSlide>;

export const PitchDeck = z.object({
  personName: z.string().min(1).max(80),
  personTagline: z.string().max(140).describe("3-8 word tagline that positions the person. e.g., 'ex-SpaceX propulsion eng turned founder'."),
  companyName: z.string().min(1).max(80),
  roleTitle: z.string().min(1).max(120),
  slides: z
    .array(PitchSlide)
    .min(5)
    .max(7)
    .describe("Exactly 5-7 slides. Order: title, hook, why_fit, experience, projects, (skills OR plan), closing."),
});
export type PitchDeck = z.infer<typeof PitchDeck>;
