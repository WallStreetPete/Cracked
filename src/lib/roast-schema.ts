import { z } from "zod";

export const RoastCategory = z.enum([
  "engineer",
  "investment_banker",
  "founder",
  "product_manager",
  "go_to_market",
  "corp_dev",
  "research",
  "design",
  "other",
]);
export type RoastCategory = z.infer<typeof RoastCategory>;

export const RoastSchema = z.object({
  crackedScore: z.number().int().min(0).max(100).describe("Overall cracked score out of 100. Be harsh — 90+ is Thiel Fellow / SpaceX prop eng tier."),
  category: RoastCategory.describe("Best-fit category based on the resume/LinkedIn."),
  categoryConfidence: z.number().min(0).max(1),
  verdict: z.string().describe("One brutal sentence summarizing their cracked-ness. Swear freely. No mercy."),
  oneLinerMeme: z.string().describe("A meme-tier one-liner a friend would quote back to them. Cruel but clever."),
  strengths: z.array(z.string()).min(1).max(5).describe("What's actually good — even a roast admits reality. Short."),
  redFlags: z.array(z.string()).min(2).max(8).describe("Resume red flags. Be specific — name the line, name the company, name the number."),
  lineByLine: z
    .array(
      z.object({
        quote: z.string().describe("Verbatim line or bullet from the resume/LinkedIn."),
        rating: z.number().int().min(0).max(10).describe("0 = cooked, 10 = cracked."),
        roast: z.string().describe("Savage, specific, witty breakdown of this exact line. No generic advice."),
        fix: z.string().optional().describe("One-sentence surgical fix — only if salvageable."),
      })
    )
    .min(5)
    .max(20),
  scoreBreakdown: z.object({
    technicalDepth: z.number().int().min(0).max(100),
    ambition: z.number().int().min(0).max(100),
    executionEvidence: z.number().int().min(0).max(100),
    prestigeSignal: z.number().int().min(0).max(100),
    taste: z.number().int().min(0).max(100),
  }),
  levelUpPlan: z.array(z.string()).min(3).max(6).describe("Specific, non-generic 30/60/90-day moves that would actually raise the score."),
  comparables: z.object({
    aboveYou: z.array(z.string()).describe("3-5 archetypes clearly above this person."),
    belowYou: z.array(z.string()).describe("3-5 archetypes clearly below."),
  }),
  suggestedJobTags: z.array(z.string()).describe("Tags to filter the jobs board (e.g., 'engineer', 'ai-research', 'founder', 'banker', 'pm')."),
  suggestedFundingTags: z.array(z.string()).describe("Tags for the funding board (e.g., 'pre-seed', 'ai', 'solo-founder', 'technical')."),
});

export type RoastResult = z.infer<typeof RoastSchema>;
