import { Suspense } from "react";
import { FUNDING, FUNDING_TYPES } from "@/lib/funding";
import FundingClient from "./funding-client";

export const metadata = { title: "Cracked — Funding & accelerators" };

export default function FundingPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tag border-[var(--color-accent)]/40 text-[var(--color-accent)]">/03 · funding</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          {FUNDING.length}+ ways to fund whatever you're building.
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted-foreground)]">
          Accelerators, fellowships, studios, grants, residencies, and government programs. Each one
          lists amount, terms, required application assets, and a time estimate. Hit "refresh" to
          pull the latest details with Firecrawl.
        </p>
      </header>
      <Suspense fallback={<div className="card h-40 animate-pulse" />}>
        <FundingClient funding={FUNDING} types={FUNDING_TYPES} />
      </Suspense>
    </div>
  );
}
