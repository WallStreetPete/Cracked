"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { RoastResult } from "@/lib/roast-schema";
import { scoreBand } from "@/lib/utils";
import { roastToMarkdown, buildPrintableHtml } from "@/lib/roast-markdown";

export default function RoastClient() {
  const [file, setFile] = useState<File | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [context, setContext] = useState("");
  const [pasted, setPasted] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file && !linkedin && !context && !pasted) {
      toast.error("Give us something to roast.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      if (file) fd.append("resume", file);
      if (linkedin) fd.append("linkedin", linkedin);
      if (context) fd.append("context", context);
      if (pasted) fd.append("pasted", pasted);
      const res = await fetch("/api/roast", { method: "POST", body: fd });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as RoastResult;
      setResult(data);
      try {
        localStorage.setItem("cracked:lastRoast", JSON.stringify(data));
        if (linkedin) localStorage.setItem("cracked:linkedin", linkedin);
        if (pasted) localStorage.setItem("cracked:resumeText", pasted);
        if (context) localStorage.setItem("cracked:personTagline", context.slice(0, 140));
      } catch {}
      toast.success(`Score: ${data.crackedScore}/100`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something broke.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <form onSubmit={submit} className="card space-y-5">
        <div>
          <label className="text-sm font-semibold">Resume (PDF, DOCX, or TXT)</label>
          <input
            type="file"
            accept=".pdf,.docx,.txt,application/pdf"
            className="input mt-2"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold">LinkedIn URL</label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/you"
            className="input mt-2"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Paragraph about yourself</label>
          <textarea
            rows={5}
            placeholder="what you're building, what you want, flex shamelessly"
            className="textarea mt-2"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
        <details>
          <summary className="cursor-pointer text-sm text-[var(--color-muted-foreground)]">
            No file? Paste resume text instead
          </summary>
          <textarea
            rows={6}
            className="textarea mt-2"
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
          />
        </details>
        <button disabled={loading} className="btn w-full">
          {loading ? "Cooking you… (30–60s)" : "Roast me"}
        </button>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          We don't store your resume.
        </p>
      </form>

      <div className="min-h-[12rem]">
        {loading && <Skeleton />}
        {result && <Result result={result} />}
        {!loading && !result && (
          <div className="card flex h-full min-h-[18rem] items-center justify-center text-center text-[var(--color-muted-foreground)]">
            Your demolition will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

function MediaRoast({ result, onMemeReady }: { result: RoastResult; onMemeReady?: (blob: Blob) => void }) {
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [memeErr, setMemeErr] = useState<string | null>(null);
  const [memeLoading, setMemeLoading] = useState(false);

  async function gen() {
    setMemeErr(null);
    setMemeLoading(true);
    try {
      const res = await fetch("/api/roast/meme", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          verdict: result.verdict,
          oneLinerMeme: result.oneLinerMeme,
          crackedScore: result.crackedScore,
          category: result.category,
          redFlags: result.redFlags.slice(0, 3),
          topLine: result.lineByLine[0]?.quote,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      onMemeReady?.(blob);
      const url = URL.createObjectURL(blob);
      setMemeUrl(url);
    } catch (err) {
      setMemeErr(err instanceof Error ? err.message : "Meme gen failed");
    } finally {
      setMemeLoading(false);
    }
  }

  useEffect(() => {
    setMemeUrl(null);
    setMemeErr(null);
    let cancelled = false;
    (async () => {
      setMemeLoading(true);
      try {
        const res = await fetch("/api/roast/meme", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            verdict: result.verdict,
            oneLinerMeme: result.oneLinerMeme,
            crackedScore: result.crackedScore,
            category: result.category,
            redFlags: result.redFlags.slice(0, 3),
            topLine: result.lineByLine[0]?.quote,
          }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const blob = await res.blob();
        if (cancelled) return;
        onMemeReady?.(blob);
        setMemeUrl(URL.createObjectURL(blob));
      } catch (err) {
        if (!cancelled) setMemeErr(err instanceof Error ? err.message : "Meme gen failed");
      } finally {
        if (!cancelled) setMemeLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result.verdict, result.oneLinerMeme, result.crackedScore, result.category, result.redFlags, result.lineByLine]);

  return (
    <div className="card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="tag">roast meme · nano banana</div>
        <div className="flex gap-2">
          {memeUrl && (
            <>
              <button onClick={gen} className="btn btn-ghost btn-sm" disabled={memeLoading}>
                regenerate
              </button>
              <a href={memeUrl} download="cracked-meme.png" className="btn btn-ghost btn-sm">
                download
              </a>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        {memeLoading && <div className="aspect-square w-full animate-pulse rounded-xl bg-[var(--color-muted)]" />}
        {!memeLoading && memeUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={memeUrl} alt="roast meme" className="w-full rounded-xl border border-[var(--color-border)]" />
        )}
        {!memeLoading && !memeUrl && memeErr && (
          <div className="rounded-xl border border-[var(--color-danger)]/40 p-3 text-xs text-[var(--color-danger)]">
            {memeErr}
            <button onClick={gen} className="btn btn-ghost btn-sm mt-2">retry</button>
          </div>
          )}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="h-24 rounded-xl bg-[var(--color-muted)]" />
      <div className="h-3 w-3/4 rounded bg-[var(--color-muted)]" />
      <div className="h-3 w-2/3 rounded bg-[var(--color-muted)]" />
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[var(--color-muted)]" />
        ))}
      </div>
      <div className="h-3 w-1/2 rounded bg-[var(--color-muted)]" />
      <div className="space-y-2">
        <div className="h-12 rounded-xl bg-[var(--color-muted)]" />
        <div className="h-12 rounded-xl bg-[var(--color-muted)]" />
        <div className="h-12 rounded-xl bg-[var(--color-muted)]" />
      </div>
    </div>
  );
}

function Result({ result }: { result: RoastResult }) {
  const band = scoreBand(result.crackedScore);
  const [memeBlob, setMemeBlob] = useState<Blob | null>(null);

  async function memeDataUrl(): Promise<string | undefined> {
    if (!memeBlob) return undefined;
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : undefined);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(memeBlob);
    });
  }

  function downloadMarkdown() {
    const md = roastToMarkdown(result);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cracked-roast-${result.crackedScore}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast.success("Markdown downloaded.");
  }

  async function openPrintView() {
    const md = roastToMarkdown(result);
    const meme = await memeDataUrl();
    const html = buildPrintableHtml(md, { title: `Cracked roast · ${result.crackedScore}/100`, memeDataUrl: meme });
    const win = window.open("", "_blank", "width=820,height=1000");
    if (!win) {
      toast.error("Allow popups to export as PDF, or use download markdown.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
          your demolition
        </div>
        <div className="flex gap-2">
          <button onClick={downloadMarkdown} className="btn btn-ghost btn-sm">
            ⬇ markdown
          </button>
          <button onClick={openPrintView} className="btn btn-sm">
            📄 save as PDF
          </button>
        </div>
      </div>
      <MediaRoast result={result} onMemeReady={setMemeBlob} />
      <div className="card">
        <div className="flex flex-wrap items-center gap-6">
          <div
            className="score-ring grid h-32 w-32 place-items-center"
            style={{ ["--score" as string]: String(result.crackedScore) }}
          >
            <div className="grid h-[108px] w-[108px] place-items-center rounded-full bg-[var(--color-background)]">
              <div className="text-center">
                <div className="text-3xl font-black">{result.crackedScore}</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">/ 100</div>
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag" style={{ color: band.color, borderColor: band.color }}>
                {band.label}
              </span>
              <span className="tag">{result.category.replace("_", " ")}</span>
              <span className="tag">confidence {Math.round(result.categoryConfidence * 100)}%</span>
            </div>
            <p className="text-xl font-bold leading-snug">{result.verdict}</p>
            <p className="text-sm italic text-[var(--color-muted-foreground)]">"{result.oneLinerMeme}"</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-5">
          {Object.entries(result.scoreBreakdown).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-[var(--color-border)] p-3 text-center">
              <div className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
                {k.replace(/([A-Z])/g, " $1").trim()}
              </div>
              <div className="mt-1 text-2xl font-bold">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="tag mb-3">what's actually cracked</div>
          <ul className="space-y-2 text-sm">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--color-success)]">▲</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="tag mb-3" style={{ color: "var(--color-danger)" }}>red flags</div>
          <ul className="space-y-2 text-sm">
            {result.redFlags.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--color-danger)]">▼</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="tag mb-3">line-by-line demolition</div>
        <ul className="space-y-3">
          {result.lineByLine.map((l, i) => (
            <li key={i} className="rounded-xl border border-[var(--color-border)] p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-mono text-xs text-[var(--color-muted-foreground)]">"{l.quote}"</div>
                <span className="tag shrink-0" style={{ color: l.rating >= 7 ? "var(--color-success)" : l.rating >= 4 ? "var(--color-warning)" : "var(--color-danger)" }}>
                  {l.rating}/10
                </span>
              </div>
              <div className="mt-2 text-sm">{l.roast}</div>
              {l.fix && (
                <div className="mt-2 text-xs text-[var(--color-muted-foreground)]">
                  <span className="font-semibold text-[var(--color-accent)]">fix →</span> {l.fix}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div className="tag mb-3">30/60/90 level-up</div>
        <ol className="space-y-2 text-sm">
          {result.levelUpPlan.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-mono text-[var(--color-accent)]">{String(i + 1).padStart(2, "0")}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="tag mb-3">above you</div>
          <ul className="space-y-1 text-sm">{result.comparables.aboveYou.map((s, i) => <li key={i}>◆ {s}</li>)}</ul>
        </div>
        <div className="card">
          <div className="tag mb-3">below you</div>
          <ul className="space-y-1 text-sm">{result.comparables.belowYou.map((s, i) => <li key={i}>◇ {s}</li>)}</ul>
        </div>
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[var(--color-muted-foreground)]">
          Based on your profile, we'll filter jobs and funding to match.
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={{ pathname: "/jobs", query: { tags: result.suggestedJobTags.join(",") } }}
            className="btn"
          >
            See matching jobs →
          </Link>
          <Link
            href={{ pathname: "/funding", query: { tags: result.suggestedFundingTags.join(",") } }}
            className="btn btn-ghost"
          >
            See matching funding →
          </Link>
        </div>
      </div>
    </div>
  );
}
