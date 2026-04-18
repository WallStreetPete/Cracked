"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Opportunity } from "@/lib/funding";
import { truncate } from "@/lib/utils";
import { LogoBadge } from "@/components/logo-badge";
import { SideSheet } from "@/components/side-sheet";

type Enrichment = {
  stillOpen: boolean;
  nextDeadline: string | null;
  applicationQuestions: string[];
  requiredAssets: string[];
  estimatedHours: number;
  contact: string | null;
  redFlags: string[];
  summary: string;
};

export function FundingPanel({
  opp,
  onClose,
}: {
  opp: Opportunity | null;
  onClose: () => void;
}) {
  const [enrichment, setEnrichment] = useState<Enrichment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!opp) {
      setEnrichment(null);
      return;
    }
    enrich(opp.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opp?.slug]);

  async function enrich(slug: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/funding/enrich", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = (await res.json()) as { enrichment?: Enrichment; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Enrichment failed");
      setEnrichment(data.enrichment ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrichment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SideSheet open={!!opp} onClose={onClose}>
      {opp && (
        <>
          <header className="flex items-start gap-3 border-b border-[var(--color-border)] bg-[var(--color-muted)]/50 px-5 py-4">
            <LogoBadge name={opp.name} website={opp.website} size={48} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1">
                <h3 className="truncate text-xl font-bold">{opp.name}</h3>
                <span className="tag">{opp.type.replace("-", " ")}</span>
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)]">{opp.location}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-mono font-bold text-[var(--color-accent)]">{opp.amount}</span>
                <span className="text-xs text-[var(--color-muted-foreground)]">{opp.terms}</span>
              </div>
              <p className="mt-1 text-sm">{opp.focus}</p>
            </div>
            <button onClick={onClose} className="btn btn-ghost shrink-0 text-sm" aria-label="Close">
              ✕
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">Deadline</div>
                <div>{opp.deadline}</div>
              </div>
              <div>
                <div className="font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">Est. time</div>
                <div>{opp.timeEstimate}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">Requires</div>
              <ul className="mt-1 list-disc pl-4 text-sm">
                {opp.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-1">
              {opp.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <section className="rounded-xl border border-[var(--color-border)] p-3">
              <div className="flex items-center justify-between">
                <div className="tag">live details via firecrawl</div>
                <button className="text-xs underline" onClick={() => enrich(opp.slug)}>
                  refresh
                </button>
              </div>
              {loading && (
                <div className="mt-2 space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-[var(--color-muted)]" />
                  ))}
                </div>
              )}
              {!loading && enrichment && (
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="tag"
                      style={{
                        color: enrichment.stillOpen ? "var(--color-success)" : "var(--color-danger)",
                        borderColor: enrichment.stillOpen ? "var(--color-success)" : "var(--color-danger)",
                      }}
                    >
                      {enrichment.stillOpen ? "still open" : "likely closed"}
                    </span>
                    {enrichment.nextDeadline && <span className="tag">next: {enrichment.nextDeadline}</span>}
                    <span className="tag">est. {enrichment.estimatedHours}h</span>
                    {enrichment.contact && <span className="tag">{truncate(enrichment.contact, 30)}</span>}
                  </div>
                  <p>{enrichment.summary}</p>
                  {enrichment.applicationQuestions.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                        Application asks
                      </div>
                      <ul className="mt-1 list-disc pl-4">
                        {enrichment.applicationQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {enrichment.requiredAssets.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                        Assets you need
                      </div>
                      <ul className="mt-1 list-disc pl-4">
                        {enrichment.requiredAssets.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {enrichment.redFlags.length > 0 && (
                    <div>
                      <div
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "var(--color-danger)" }}
                      >
                        Red flags
                      </div>
                      <ul className="mt-1 list-disc pl-4">
                        {enrichment.redFlags.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {!loading && !enrichment && (
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                  Firecrawl didn&apos;t return details — click Apply to go to the source.
                </p>
              )}
            </section>
          </div>

          <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-muted)]/40 px-5 py-3">
            <a href={opp.applyUrl} target="_blank" rel="noreferrer" className="btn">
              Apply ↗
            </a>
            {opp.website && (
              <a href={opp.website} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
                Website ↗
              </a>
            )}
          </footer>
        </>
      )}
    </SideSheet>
  );
}
