import { Suspense } from "react";
import { COMPANIES, COMPANY_CATEGORIES } from "@/lib/companies";
import JobsClient from "./jobs-client";

export const metadata = { title: "Cracked — Jobs at category-defining companies" };

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tag border-[var(--color-accent)]/40 text-[var(--color-accent)]">/02 · jobs</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          {COMPANIES.length}+ companies building the future.
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted-foreground)]">
          Filter by category, pick a role, pull live openings via Exa, find the humans who'll actually
          read your email — and send it from here.
        </p>
      </header>
      <Suspense fallback={<div className="card h-40 animate-pulse" />}>
        <JobsClient companies={COMPANIES} categories={COMPANY_CATEGORIES} />
      </Suspense>
    </div>
  );
}
