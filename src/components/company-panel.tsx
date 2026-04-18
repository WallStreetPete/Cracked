"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Company } from "@/lib/companies";
import type { ExaResult } from "@/lib/exa";
import { truncate } from "@/lib/utils";
import { LogoBadge } from "@/components/logo-badge";
import { SideSheet } from "@/components/side-sheet";
import type { OutreachSeed } from "@/components/outreach-modal";

export function CompanyPanel({
  company,
  role,
  onClose,
  onOpenOutreach,
}: {
  company: Company | null;
  role: string;
  onClose: () => void;
  onOpenOutreach: (seed: OutreachSeed) => void;
}) {
  const [jobs, setJobs] = useState<ExaResult[] | null>(null);
  const [contacts, setContacts] = useState<ExaResult[] | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    if (!company) {
      setJobs(null);
      setContacts(null);
      return;
    }
    loadJobs(company.slug);
    loadContacts(company.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company?.slug, role]);

  async function loadJobs(slug: string) {
    setLoadingJobs(true);
    try {
      const res = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, role }),
      });
      const data = (await res.json()) as { results?: ExaResult[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Job search failed");
      setJobs(data.results ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Job search failed");
    } finally {
      setLoadingJobs(false);
    }
  }

  async function loadContacts(slug: string) {
    setLoadingContacts(true);
    try {
      const res = await fetch("/api/jobs/contacts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, role }),
      });
      const data = (await res.json()) as { results?: ExaResult[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Contact search failed");
      setContacts(data.results ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Contact search failed");
    } finally {
      setLoadingContacts(false);
    }
  }

  return (
    <SideSheet open={!!company} onClose={onClose}>
      {company && (
        <>
          <header className="flex items-start gap-3 border-b border-[var(--color-border)] bg-[var(--color-muted)]/50 px-5 py-4">
            <LogoBadge name={company.name} website={company.website} size={48} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1">
                <h3 className="truncate text-xl font-bold">{company.name}</h3>
                <span className="tag">{company.category.replace("-", " ")}</span>
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)]">{company.hq}</p>
              <p className="mt-1 text-sm">{company.blurb}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {company.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="btn btn-ghost shrink-0 text-sm" aria-label="Close">
              ✕
            </button>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <section>
              <div className="flex items-center justify-between">
                <div className="tag">live roles via exa · {role}</div>
                <button className="text-xs underline" onClick={() => loadJobs(company.slug)}>
                  refresh
                </button>
              </div>
              {loadingJobs && <Skeleton rows={3} />}
              {!loadingJobs && jobs && jobs.length === 0 && (
                <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">No results — try a different role.</p>
              )}
              {jobs && jobs.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {jobs.slice(0, 10).map((r) => (
                    <li key={r.url} className="rounded-lg border border-[var(--color-border)] p-2 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <a href={r.url} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                            {r.title ?? r.url}
                          </a>
                          {r.text && (
                            <div className="mt-1 text-xs text-[var(--color-muted-foreground)]">{truncate(r.text, 180)}</div>
                          )}
                        </div>
                        <button
                          className="btn btn-ghost shrink-0 text-xs"
                          onClick={() =>
                            onOpenOutreach({
                              companyName: company.name,
                              companyWebsite: company.website,
                              job: r,
                              role,
                            })
                          }
                        >
                          email
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between">
                <div className="tag">contacts</div>
                <button className="text-xs underline" onClick={() => loadContacts(company.slug)}>
                  refresh
                </button>
              </div>
              {loadingContacts && <Skeleton rows={3} />}
              {!loadingContacts && contacts && contacts.length === 0 && (
                <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">No contacts found.</p>
              )}
              {contacts && contacts.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {contacts.slice(0, 10).map((r) => (
                    <li key={r.url} className="rounded-lg border border-[var(--color-border)] p-2 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <a href={r.url} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                            {r.author ?? r.title ?? r.url}
                          </a>
                          {r.text && (
                            <div className="mt-1 text-xs text-[var(--color-muted-foreground)]">{truncate(r.text, 160)}</div>
                          )}
                        </div>
                        <button
                          className="btn shrink-0 text-xs"
                          onClick={() =>
                            onOpenOutreach({
                              companyName: company.name,
                              companyWebsite: company.website,
                              contact: r,
                              job: jobs?.[0],
                              role,
                            })
                          }
                        >
                          draft email
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-muted)]/40 px-5 py-3">
            <a href={company.careers} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
              Careers ↗
            </a>
            <button
              onClick={() =>
                onOpenOutreach({
                  companyName: company.name,
                  companyWebsite: company.website,
                  job: jobs?.[0],
                  role,
                })
              }
              className="btn"
            >
              Draft cold email
            </button>
          </footer>
        </>
      )}
    </SideSheet>
  );
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mt-2 space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-[var(--color-muted)]" />
      ))}
    </div>
  );
}
