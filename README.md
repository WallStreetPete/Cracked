# Cracked

> Are you actually cracked, or just coping?

Cracked is a three-in-one viral web app for ambitious people who want a painfully honest read of where they stand:

1. **Roast** your resume + LinkedIn and get a cracked-score out of 100 with a line-by-line demolition.
2. Discover **Jobs** at 160+ category-defining frontier AI / robotics / space / defense / biotech / fintech / research companies, with live role + contact search and AI-drafted cold outreach.
3. Browse **Funding** from 120+ accelerators, fellowships, residencies, grants, VC studios, and government programs, with live enrichment pulled from each program's site.

Cross-linked: your roast suggests which job and funding tags to filter by, and the outreach modal reuses your roast summary as sender context.

---

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19 + Tailwind v4 (`@theme` tokens, shadcn-style CSS variables)
- **AI**: AI SDK v5 + `@ai-sdk/anthropic`
  - `claude-opus-4-7` for the roast (structured output with a strict Zod schema)
  - `claude-sonnet-4-6` for email drafting and funding enrichment
- **Search**: [Exa](https://exa.ai) for job postings (neural search, domain-filtered) and LinkedIn profile contacts (neural + `linkedin profile` category + strict URL regex)
- **Scraping**: [Firecrawl](https://firecrawl.dev) for pulling live details from funding / accelerator pages
- **Email**: Nodemailer (Gmail SMTP) + `mailto:` fallback; drafts are generated as structured `{ subject, body }`
- **Resume parsing**: `pdf-parse` + `mammoth` (PDF/DOCX/TXT), server-only
- **Auth**: Clerk (Google OAuth) — gates every route except `/` and public webhooks
- **Toasts**: Sonner

---

## Features

### 1. `/roast` — Resume demolition

Upload a PDF/DOCX/TXT resume, or paste text. Optional LinkedIn URL + freeform context. Claude Opus 4.7 returns a structured JSON response conforming to `src/lib/roast-schema.ts`:

- `crackedScore` (0–100) with a rubric that ranges from "cooked beyond recognition" (0–39) to "actually him" (95–100).
- `verdict`, `oneLinerMeme`, `strengths`, `redFlags`.
- `lineByLine`: verbatim quotes from the resume with individual ratings, roast commentary, and concrete fixes.
- `scoreBreakdown`: five weighted axes (signal density, specificity, rare combinations, compounding bets, BS detection).
- `levelUpPlan`, `comparables`, `suggestedJobTags`, `suggestedFundingTags`.

The system prompt is tuned for gen-z brainrot voice (lmao, looksmaxing, bsmaxing, cooked, mid, delulu, cope harder, etc.) with hard rules against em/en dashes and a mandate to quote actual resume lines verbatim before dunking on them.

Suggested tags hyperlink to `/jobs?tags=...` and `/funding?tags=...` so the roast becomes a filter for the other two features.

### 2. `/jobs` — 160+ frontier companies

A grid of compact cards with logos. Each card opens a **right-slide side panel** with:

- Logo, HQ, category, blurb, tags.
- Live roles pulled via Exa's `searchAndContents` — queries include the career-site host plus Lever / Ashby / Greenhouse / Workable / SmartRecruiters / Google Careers boards.
- LinkedIn contacts pulled via Exa (`type: "neural"`, `category: "linkedin profile"`) and filtered client-side to URLs matching `linkedin.com/in/…`, `x.com/<handle>`, etc., so you never get the company LinkedIn page or random orgs.
- Per-role and per-contact **Email** buttons that open the outreach modal (see below).

Role presets let you swap between engineer / PM / research / design / sales / founding-engineer / etc., and that role is threaded into the Exa query.

Data lives in `src/lib/companies.ts` — 164 hand-picked slugs across 22 categories (frontier-ai, robotics, space, defense, biotech, energy, fintech, consumer, gaming, etc.).

### 3. `/funding` — 120+ opportunities (list view)

A dense table view with:

- **Filters**: free-text search, type (accelerator / fellowship / studio / fund-program / grant / residency / competition / government), stage, location (bucketed across messy free-form strings — "SF / Bay Area" matches `SF`, `san francisco`, `berkeley`, `palo alto`, `menlo park`, etc.), min amount (parses `$`, `€`, `£` + K/M units), tag chips.
- **Sorts**: name A–Z, amount (high→low), deadline (rolling → batches → specific → unknown).
- Clicking a row opens a side panel with the program header, requirements, tags, and **Firecrawl-enriched live details** (is it still open, next deadline, application questions, required assets, red flags, estimated hours).

Data lives in `src/lib/funding.ts` — 122 programs from YC / SPC / a16z Speedrun / Neo / Antler / Entrepreneur First / Conviction Embed / South Park Commons Fund / Thiel Fellowship / Schmidt Futures / DARPA / ARPA-H / Activate / Fast Grants / Pioneer / The ODI / Emergent Ventures / and many more.

### Cross-cutting: outreach modal

Clicking **Email** anywhere opens a two-column modal:

- **Left**: To / Subject / Email body.
- **Right**: "Who you are + what you do" textarea (persisted to `localStorage` under `cracked:senderProfile` so every regen uses it), plus a "Feedback for the rewrite" textarea.
- **Footer**: Send via Gmail SMTP, open in default mail app via `mailto:`, or copy.
- Hitting **Regenerate** POSTs to `/api/outreach/draft`, which calls Claude Sonnet 4.6 with a SYSTEM prompt tuned for short (90–160 word), specific, non-groveling cold outreach, plus the previous draft and the user's feedback so iteration is real (not tweaks).
- If the user has a roast in `localStorage` but no sender profile yet, the roast summary is pre-loaded as the sender context.

---

## Project layout

```
src/
  app/
    layout.tsx                 # ClerkProvider, header with Show + SignInButton / UserButton
    page.tsx                   # Landing
    roast/
      page.tsx
      roast-client.tsx         # FormData submit, score-ring, line-by-line rendering
    jobs/
      page.tsx
      jobs-client.tsx          # Filters + CompanyCard grid + side panel trigger
    funding/
      page.tsx
      funding-client.tsx       # List view with amount/location/deadline sort + filters
    api/
      roast/route.ts           # POST /api/roast → structured RoastSchema
      jobs/search/route.ts     # POST → Exa job search
      jobs/contacts/route.ts   # POST → Exa LinkedIn profile search
      funding/enrich/route.ts  # POST → Firecrawl + Claude structured enrichment
      outreach/draft/route.ts  # POST → generateObject email draft
      outreach/send/route.ts   # POST → nodemailer Gmail SMTP send
  components/
    logo-badge.tsx             # Clearbit → Google favicon → initials fallback
    side-sheet.tsx             # Reusable right-slide panel with backdrop + Esc
    company-panel.tsx          # Jobs/contacts + email flow
    funding-panel.tsx          # Live enrichment + Apply
    outreach-modal.tsx         # Email composer with regenerate-from-feedback
  lib/
    companies.ts               # 164 companies
    funding.ts                 # 122 funding opportunities
    exa.ts                     # searchJobs + findContacts
    firecrawl.ts               # REST wrapper
    logo.ts                    # URL helpers (Clearbit + Google favicons)
    parse-resume.ts            # pdf-parse + mammoth, server-only
    roast-schema.ts            # Zod schema for the roast output
    utils.ts                   # cn + truncate
  middleware.ts                # Clerk route gate (everything except / is protected)
```

---

## Environment variables

Copy the template and fill in. None of these are committed — `.env` is gitignored.

```env
ANTHROPIC_API_KEY=sk-ant-...
EXA_API_KEY=...
FIRECRAWL_API_KEY=fc-...

# Clerk — dashboard.clerk.com → create app → copy keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Gmail SMTP for outreach send. Without these, the modal falls back to mailto + copy.
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

Gmail requires an [app password](https://support.google.com/accounts/answer/185833) — your normal Gmail password won't work with SMTP.

---

## Local development

```bash
npm install
npm run dev -- -p 3100      # port is arbitrary; 3000 is often in use
```

Then visit `http://localhost:3100`.

Build:

```bash
npm run build
```

The project is deployed on Vercel; deploys are per-branch preview + `main` → production. Custom domain is configured via the Vercel dashboard.

---

## Auth model

Clerk (`src/middleware.ts`) runs on every non-static route. Public routes:

- `/`
- `/sign-in(.*)`, `/sign-up(.*)`
- `/api/webhooks(.*)`

Everything else (including all other `/api/*` routes) requires a signed-in Clerk session. Unauthenticated requests are redirected to the Clerk-hosted sign-in page.

Google is the only configured social provider by default — flip the switch in the Clerk dashboard if you want to allow email / GitHub / etc.

No user data is persisted server-side yet. Sender profile and the most recent roast summary live in `localStorage` under `cracked:senderProfile` and `cracked:lastRoast`. Wire Supabase (or Clerk's hosted Postgres) if you want cross-device roasts / outbox history / shortlists.

---

## Why it exists

Ambition is a lonely game. Most career tools are either (a) too polite to be useful or (b) pretending an LLM can replace a brutally honest mentor. Cracked is the mentor. It's a toy, it's for fun, and it's meant to be shared.

If it hurts, that's the point.
