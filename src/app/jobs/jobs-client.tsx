"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Company, CompanyCategory } from "@/lib/companies";
import { ROLE_PRESETS } from "@/lib/companies";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/logo-badge";
import { CompanyPanel } from "@/components/company-panel";
import { OutreachModal, type OutreachSeed } from "@/components/outreach-modal";
import { PitchDeckModal, type PitchDeckSeed } from "@/components/pitch-deck-modal";

type Props = {
  companies: Company[];
  categories: { key: CompanyCategory; label: string }[];
};

export default function JobsClient({ companies, categories }: Props) {
  const params = useSearchParams();
  const initialTags = (params.get("tags") ?? "").split(",").filter(Boolean);
  const [cat, setCat] = useState<CompanyCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [role, setRole] = useState<string>("engineer");
  const [panelCompany, setPanelCompany] = useState<Company | null>(null);
  const [modalSeed, setModalSeed] = useState<OutreachSeed | null>(null);
  const [pitchSeed, setPitchSeed] = useState<PitchDeckSeed | null>(null);

  useEffect(() => {
    setTags((params.get("tags") ?? "").split(",").filter(Boolean));
  }, [params]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    companies.forEach((c) => c.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [companies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      if (cat !== "all" && c.category !== cat) return false;
      if (q && !(`${c.name} ${c.slug} ${c.blurb}`.toLowerCase().includes(q))) return false;
      if (tags.length && !tags.some((t) => c.tags.includes(t))) return false;
      return true;
    });
  }, [companies, cat, query, tags]);

  return (
    <div className="space-y-5">
      <div className="card space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="input max-w-xs"
            placeholder="Search companies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="input max-w-xs" value={cat} onChange={(e) => setCat(e.target.value as CompanyCategory | "all")}>
            <option value="all">All categories ({companies.length})</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <select className="input max-w-xs" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLE_PRESETS.map((r) => (
              <option key={r.key} value={r.key}>
                Role: {r.label}
              </option>
            ))}
          </select>
          <span className="ml-auto text-xs text-[var(--color-muted-foreground)]">{filtered.length} shown</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTags((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}
              className={cn(
                "tag cursor-pointer transition",
                tags.includes(t) && "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
              )}
            >
              {t}
            </button>
          ))}
          {tags.length > 0 && (
            <button onClick={() => setTags([])} className="tag cursor-pointer">
              clear ×
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <CompanyCard
            key={c.slug}
            company={c}
            onOpenPanel={() => setPanelCompany(c)}
            onDraftEmail={() =>
              setModalSeed({
                companyName: c.name,
                companyWebsite: c.website,
                role,
              })
            }
          />
        ))}
      </div>

      <CompanyPanel
        company={panelCompany}
        role={role}
        onClose={() => setPanelCompany(null)}
        onOpenOutreach={(seed) => setModalSeed(seed)}
        onOpenPitch={(seed) => setPitchSeed(seed)}
      />
      <OutreachModal open={modalSeed !== null} onClose={() => setModalSeed(null)} seed={modalSeed} />
      <PitchDeckModal open={pitchSeed !== null} onClose={() => setPitchSeed(null)} seed={pitchSeed} />
    </div>
  );
}

function CompanyCard({
  company,
  onOpenPanel,
  onDraftEmail,
}: {
  company: Company;
  onOpenPanel: () => void;
  onDraftEmail: () => void;
}) {
  return (
    <div
      onClick={onOpenPanel}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenPanel();
        }
      }}
      className="card card-hover group flex cursor-pointer flex-col gap-2.5"
    >
      <div className="flex items-start gap-3">
        <LogoBadge name={company.name} website={company.website} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-base font-bold leading-tight">{company.name}</h3>
            <span className="tag shrink-0">{company.category.replace("-", " ")}</span>
          </div>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-muted-foreground)]">{company.hq}</p>
        </div>
        <span
          className="shrink-0 self-center text-[var(--color-muted-foreground)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
          aria-hidden
        >
          →
        </span>
      </div>
      <p className="line-clamp-2 text-sm leading-snug text-[var(--color-muted-foreground)]">{company.blurb}</p>
      <div className="flex flex-wrap gap-1">
        {company.tags.slice(0, 4).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-1.5 pt-1">
        <a
          href={company.careers}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost btn-sm flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          Careers ↗
        </a>
        <button
          type="button"
          className="btn btn-ghost btn-sm flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPanel();
          }}
        >
          Contacts
        </button>
        <button
          type="button"
          className="btn btn-sm flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onDraftEmail();
          }}
        >
          Email
        </button>
      </div>
    </div>
  );
}
