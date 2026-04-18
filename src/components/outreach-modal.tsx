"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ExaResult } from "@/lib/exa";
import { LogoBadge } from "@/components/logo-badge";
import { truncate } from "@/lib/utils";

export type OutreachSeed = {
  companyName: string;
  companyWebsite?: string;
  contact?: ExaResult;
  job?: ExaResult;
  role?: string;
};

export function OutreachModal({
  open,
  onClose,
  seed,
}: {
  open: boolean;
  onClose: () => void;
  seed: OutreachSeed | null;
}) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [senderProfile, setSenderProfile] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const iterations = useRef(0);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    try {
      const stored = window.localStorage.getItem("cracked:senderProfile");
      if (stored) setSenderProfile(stored);
      else {
        const roast = window.localStorage.getItem("cracked:lastRoast");
        if (roast) setSenderProfile(`Roast summary JSON: ${roast.slice(0, 1500)}`);
      }
    } catch {}
    if (seed) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seed?.companyName]);

  async function generate(withFeedback?: string) {
    if (!seed) return;
    setLoading(true);
    try {
      const res = await fetch("/api/outreach/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contactName: seed.contact?.author ?? seed.contact?.title ?? "Hiring team",
          contactRole: seed.role,
          contactContext: truncate(seed.contact?.text ?? "", 600),
          companyName: seed.companyName,
          jobTitle: seed.job?.title ?? undefined,
          jobUrl: seed.job?.url ?? undefined,
          senderProfile,
          senderAsks: "15-minute intro call",
          feedback: withFeedback,
          previousDraft: withFeedback && (subject || bodyText) ? { subject, body: bodyText } : undefined,
        }),
      });
      const data = (await res.json()) as { subject?: string; body?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Draft failed");
      setSubject(data.subject ?? "");
      setBodyText(data.body ?? "");
      iterations.current += 1;
      if (withFeedback) setFeedback("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Draft failed");
    } finally {
      setLoading(false);
    }
  }

  function saveProfile(p: string) {
    setSenderProfile(p);
    try {
      window.localStorage.setItem("cracked:senderProfile", p);
    } catch {}
  }

  async function send() {
    if (!to) return toast.error("Need a recipient email.");
    setSending(true);
    try {
      const res = await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ to, subject, body: bodyText }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Send failed");
      toast.success("Sent ✓");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  async function copyAll() {
    const blob = `Subject: ${subject}\n\n${bodyText}`;
    await navigator.clipboard.writeText(blob);
    toast.success("Copied");
  }

  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  if (!open || !seed) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-muted)]/50 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <LogoBadge name={seed.companyName} website={seed.companyWebsite} size={44} />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">outreach · iter {iterations.current || 1}</div>
              <div className="truncate text-lg font-bold">{seed.companyName}</div>
              {seed.contact && (
                <div className="truncate text-xs text-[var(--color-muted-foreground)]">
                  to {seed.contact.author ?? seed.contact.title ?? "contact"}
                  {seed.role ? ` · ${seed.role}` : ""}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost btn text-sm" aria-label="Close">
            ✕
          </button>
        </header>

        <div className="grid gap-4 overflow-y-auto p-5 md:grid-cols-[1fr_1fr]">
          <section className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">To</label>
              <input
                className="input mt-1"
                placeholder="person@company.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                type="email"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">Subject</label>
              <input className="input mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">Email</label>
              <textarea className="textarea mt-1" rows={12} value={bodyText} onChange={(e) => setBodyText(e.target.value)} />
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">Who you are + what you do</label>
              <textarea
                className="textarea mt-1"
                rows={5}
                placeholder="e.g. cs @ stanford, shipping a voice-AI tool, 2 yrs at anthropic, looking for forward-deployed eng role"
                value={senderProfile}
                onChange={(e) => saveProfile(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-[var(--color-muted-foreground)]">Saved locally so every regen uses it.</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">Feedback for the rewrite</label>
              <textarea
                className="textarea mt-1"
                rows={3}
                placeholder='"punchier", "drop the flattery", "mention my deepgram paper"'
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            <button
              onClick={() => generate(feedback || undefined)}
              disabled={loading}
              className="btn w-full"
            >
              {loading ? "rewriting…" : iterations.current === 0 ? "Draft email" : feedback ? "↻ Rewrite with feedback" : "↻ Regenerate"}
            </button>
            <p className="text-[11px] text-[var(--color-muted-foreground)]">
              Refresh as many times as you want — each regen reads your context + feedback.
            </p>
          </section>
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-muted)]/40 px-5 py-4">
          <button onClick={send} disabled={sending || !to || !bodyText} className="btn">
            {sending ? "sending…" : "Send via Gmail"}
          </button>
          <a href={mailto} className="btn btn-ghost">
            Open in mail app
          </a>
          <button onClick={copyAll} className="btn btn-ghost">
            Copy
          </button>
          <span className="ml-auto text-xs text-[var(--color-muted-foreground)]">
            Gmail needs GMAIL_USER + GMAIL_APP_PASSWORD envs · mailto always works
          </span>
        </footer>
      </div>
    </div>
  );
}
