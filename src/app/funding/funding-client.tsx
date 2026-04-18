"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FundingType, Opportunity, Stage } from "@/lib/funding";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/logo-badge";
import { FundingPanel } from "@/components/funding-panel";

type Props = {
  funding: Opportunity[];
  types: { key: FundingType; label: string }[];
};

type SortKey = "name" | "amount" | "deadline";

const LOC_BUCKETS = [
  { key: "sf", label: "SF / Bay Area", patterns: ["sf", "san francisco", "bay area", "berkeley", "palo alto", "menlo park", "mountain view", "fort mason"] },
  { key: "nyc", label: "NYC", patterns: ["nyc", "new york"] },
  { key: "london", label: "London", patterns: ["london"] },
  { key: "boston", label: "Boston / Cambridge", patterns: ["boston", "cambridge"] },
  { key: "europe", label: "Europe (other)", patterns: ["paris", "berlin", "sofia", "cee", "€"] },
  { key: "asia", label: "Asia", patterns: ["india", "japan", " jp", "singapore", "bangalore", "shenzhen", "tokyo"] },
  { key: "remote", label: "Remote", patterns: ["remote"] },
  { key: "global", label: "Global", patterns: ["global"] },
] as const;

type LocKey = (typeof LOC_BUCKETS)[number]["key"] | "all";

const AMOUNT_BUCKETS: { key: string; label: string; min: number }[] = [
  { key: "any", label: "Any amount", min: 0 },
  { key: "25k", label: "$25K+", min: 25_000 },
  { key: "100k", label: "$100K+", min: 100_000 },
  { key: "500k", label: "$500K+", min: 500_000 },
  { key: "1m", label: "$1M+", min: 1_000_000 },
  { key: "10m", label: "$10M+", min: 10_000_000 },
];

function parseAmountUSD(s: string): number {
  const m = s.match(/[$€£]\s*([\d.]+)\s*([KM])?/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = m[2]?.toUpperCase();
  const mult = unit === "M" ? 1_000_000 : unit === "K" ? 1_000 : 1;
  const usdRate = s.startsWith("€") ? 1.08 : s.startsWith("£") ? 1.27 : 1;
  return n * mult * usdRate;
}

function deadlineScore(s: string): number {
  const x = s.toLowerCase();
  if (x.includes("rolling")) return 0;
  if (x.includes("batch") || x.includes("cohort") || x.includes("annual") || x.includes("multiple")) return 1;
  if (x.includes("per ")) return 2;
  return 3;
}

function locMatches(location: string, key: LocKey): boolean {
  if (key === "all") return true;
  const bucket = LOC_BUCKETS.find((b) => b.key === key);
  if (!bucket) return true;
  const low = location.toLowerCase();
  return bucket.patterns.some((p) => low.includes(p));
}

export default function FundingClient({ funding, types }: Props) {
  const params = useSearchParams();
  const initialTags = (params.get("tags") ?? "").split(",").filter(Boolean);
  const [type, setType] = useState<FundingType | "all">("all");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [loc, setLoc] = useState<LocKey>("all");
  const [minAmount, setMinAmount] = useState<string>("any");
  const [sort, setSort] = useState<SortKey>("name");
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [panelOpp, setPanelOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    setTags((params.get("tags") ?? "").split(",").filter(Boolean));
  }, [params]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    funding.forEach((c) => c.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [funding]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minUSD = AMOUNT_BUCKETS.find((b) => b.key === minAmount)?.min ?? 0;
    const rows = funding.filter((f) => {
      if (type !== "all" && f.type !== type) return false;
      if (stage !== "all" && !f.stage.includes(stage)) return false;
      if (!locMatches(f.location, loc)) return false;
      if (minUSD > 0 && parseAmountUSD(f.amount) < minUSD) return false;
      if (q && !(`${f.name} ${f.slug} ${f.focus} ${f.location}`.toLowerCase().includes(q))) return false;
      if (tags.length && !tags.some((t) => f.tags.includes(t))) return false;
      return true;
    });
    const sorted = [...rows];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "amount") sorted.sort((a, b) => parseAmountUSD(b.amount) - parseAmountUSD(a.amount));
    else if (sort === "deadline")
      sorted.sort((a, b) => {
        const d = deadlineScore(a.deadline) - deadlineScore(b.deadline);
        return d !== 0 ? d : a.name.localeCompare(b.name);
      });
    return sorted;
  }, [funding, type, stage, loc, minAmount, query, tags, sort]);

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <input className="input max-w-xs" placeholder="Search funding…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="input max-w-[11rem]" value={type} onChange={(e) => setType(e.target.value as FundingType | "all")}>
            <option value="all">All types ({funding.length})</option>
            {types.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
          <select className="input max-w-[9rem]" value={stage} onChange={(e) => setStage(e.target.value as Stage | "all")}>
            <option value="all">All stages</option>
            <option value="pre-idea">Pre-idea</option>
            <option value="pre-seed">Pre-seed</option>
            <option value="seed">Seed</option>
            <option value="series-a">Series A</option>
            <option value="any">Any stage</option>
          </select>
          <select className="input max-w-[10rem]" value={loc} onChange={(e) => setLoc(e.target.value as LocKey)}>
            <option value="all">All locations</option>
            {LOC_BUCKETS.map((b) => (
              <option key={b.key} value={b.key}>{b.label}</option>
            ))}
          </select>
          <select className="input max-w-[9rem]" value={minAmount} onChange={(e) => setMinAmount(e.target.value)}>
            {AMOUNT_BUCKETS.map((b) => (
              <option key={b.key} value={b.key}>{b.label}</option>
            ))}
          </select>
          <select className="input max-w-[11rem]" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="name">Sort: Name A–Z</option>
            <option value="amount">Sort: Amount (high→low)</option>
            <option value="deadline">Sort: Deadline (rolling first)</option>
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
            <button onClick={() => setTags([])} className="tag cursor-pointer">clear ×</button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
        <div className="hidden items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-muted)]/60 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)] md:grid md:grid-cols-[2.4fr_0.8fr_1.1fr_1.3fr_1.2fr_1fr_auto]">
          <span>Program</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Location</span>
          <span>Deadline</span>
          <span>Est. time</span>
          <span className="text-right">Actions</span>
        </div>
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-[var(--color-muted-foreground)]">No matches. Loosen a filter.</div>
        ) : (
          filtered.map((f, i) => (
            <OppRow key={f.slug} opp={f} onOpen={() => setPanelOpp(f)} zebra={i % 2 === 1} />
          ))
        )}
      </div>

      <FundingPanel opp={panelOpp} onClose={() => setPanelOpp(null)} />
    </div>
  );
}

function OppRow({ opp, onOpen, zebra }: { opp: Opportunity; onOpen: () => void; zebra: boolean }) {
  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "group grid cursor-pointer grid-cols-1 items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-sm transition last:border-b-0 hover:bg-[var(--color-muted)]/70 md:grid-cols-[2.4fr_0.8fr_1.1fr_1.3fr_1.2fr_1fr_auto]",
        zebra ? "bg-[var(--color-muted)]/25" : "bg-transparent"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <LogoBadge name={opp.name} website={opp.website} size={36} />
        <div className="min-w-0">
          <div className="truncate font-semibold leading-tight">{opp.name}</div>
          <div className="truncate text-[11px] text-[var(--color-muted-foreground)]">{opp.focus}</div>
        </div>
      </div>
      <div className="hidden md:block">
        <span className="tag">{opp.type.replace("-", " ")}</span>
      </div>
      <div className="hidden md:block">
        <div className="font-mono text-xs font-bold leading-tight text-[var(--color-accent)]">{opp.amount}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)]">{opp.terms}</div>
      </div>
      <div className="hidden truncate text-xs text-[var(--color-muted-foreground)] md:block">{opp.location}</div>
      <div className="hidden truncate text-xs text-[var(--color-muted-foreground)] md:block">{opp.deadline}</div>
      <div className="hidden truncate text-xs text-[var(--color-muted-foreground)] md:block">{opp.timeEstimate}</div>
      <div className="flex items-center justify-end gap-1.5">
        <a
          href={opp.applyUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm"
          onClick={(e) => e.stopPropagation()}
        >
          Apply ↗
        </a>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}
