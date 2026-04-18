"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ExaResult } from "@/lib/exa";
import { LogoBadge } from "@/components/logo-badge";

export type PitchDeckSeed = {
  companyName: string;
  companyWebsite?: string;
  companyBlurb?: string;
  companyCategory?: string;
  companyTags?: string[];
  role?: string;
  job?: ExaResult;
};

const STORAGE = {
  name: "cracked:personName",
  email: "cracked:contactEmail",
  website: "cracked:websiteUrl",
  linkedin: "cracked:linkedin",
  resume: "cracked:resumeText",
  projects: "cracked:featuredProjects",
  tagline: "cracked:personTagline",
};

export function PitchDeckModal({
  open,
  onClose,
  seed,
}: {
  open: boolean;
  onClose: () => void;
  seed: PitchDeckSeed | null;
}) {
  const [personName, setPersonName] = useState("");
  const [personTagline, setPersonTagline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [featuredProjects, setFeaturedProjects] = useState("");
  const [loading, setLoading] = useState(false);

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
      setPersonName(localStorage.getItem(STORAGE.name) ?? "");
      setPersonTagline(localStorage.getItem(STORAGE.tagline) ?? "");
      setContactEmail(localStorage.getItem(STORAGE.email) ?? "");
      setLinkedinUrl(localStorage.getItem(STORAGE.linkedin) ?? "");
      setWebsiteUrl(localStorage.getItem(STORAGE.website) ?? "");
      setResumeText(localStorage.getItem(STORAGE.resume) ?? "");
      setFeaturedProjects(localStorage.getItem(STORAGE.projects) ?? "");
    } catch {}
  }, [open]);

  function save(key: string, value: string) {
    try {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    } catch {}
  }

  async function generate() {
    if (!seed) return;
    if (!personName.trim()) {
      toast.error("Need your name.");
      return;
    }
    if (!resumeText.trim() && !linkedinUrl.trim()) {
      toast.error("Need resume text or a LinkedIn URL.");
      return;
    }
    setLoading(true);
    try {
      let roastSummary: string | undefined;
      try {
        roastSummary = localStorage.getItem("cracked:lastRoast") ?? undefined;
      } catch {}

      const res = await fetch("/api/pitch-deck", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          personName,
          personTagline,
          contactEmail,
          linkedinUrl,
          websiteUrl,
          resumeText,
          featuredProjects,
          roastSummary,
          company: {
            name: seed.companyName,
            website: seed.companyWebsite,
            blurb: seed.companyBlurb,
            category: seed.companyCategory,
            tags: seed.companyTags,
          },
          role: {
            title: seed.job?.title ?? seed.role,
            url: seed.job?.url,
            snippet: seed.job?.text,
          },
        }),
      });

      if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
          const err = (await res.json()) as { error?: string };
          if (err.error) message = err.error;
        } catch {}
        throw new Error(message);
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("content-disposition") ?? "";
      const match = /filename="?([^";]+)"?/i.exec(contentDisposition);
      const filename = match?.[1] ?? `${personName.trim() || "pitch"}-${seed.companyName}.pptx`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("Deck downloaded. Open in PowerPoint, Keynote, or import to Canva.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  if (!open || !seed) return null;

  const targetRole = seed.job?.title ?? seed.role ?? "the role";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-muted)]/50 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <LogoBadge name={seed.companyName} website={seed.companyWebsite} size={44} />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">pitch deck</div>
              <div className="truncate text-lg font-bold">{seed.companyName}</div>
              <div className="truncate text-xs text-[var(--color-muted-foreground)]">{targetRole}</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost btn text-sm" aria-label="Close">
            ✕
          </button>
        </header>

        <div className="grid gap-4 overflow-y-auto p-5 md:grid-cols-2">
          <section className="space-y-3">
            <Field label="Your name">
              <input
                className="input"
                placeholder="Peter Yuan Lu"
                value={personName}
                onChange={(e) => {
                  setPersonName(e.target.value);
                  save(STORAGE.name, e.target.value);
                }}
              />
            </Field>
            <Field label="One-line positioning">
              <input
                className="input"
                placeholder="ex-SpaceX prop eng turned voice-AI founder"
                value={personTagline}
                onChange={(e) => {
                  setPersonTagline(e.target.value);
                  save(STORAGE.tagline, e.target.value);
                }}
              />
            </Field>
            <Field label="Contact email">
              <input
                className="input"
                type="email"
                placeholder="you@domain.com"
                value={contactEmail}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  save(STORAGE.email, e.target.value);
                }}
              />
            </Field>
            <Field label="LinkedIn URL">
              <input
                className="input"
                type="url"
                placeholder="https://linkedin.com/in/you"
                value={linkedinUrl}
                onChange={(e) => {
                  setLinkedinUrl(e.target.value);
                  save(STORAGE.linkedin, e.target.value);
                }}
              />
            </Field>
            <Field label="Personal website (optional)">
              <input
                className="input"
                type="url"
                placeholder="https://yoursite.com"
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  save(STORAGE.website, e.target.value);
                }}
              />
            </Field>
          </section>

          <section className="space-y-3">
            <Field
              label="Resume text"
              hint="Paste the plain text. Pulled from your last roast if available. We don't upload this to any server other than Anthropic."
            >
              <textarea
                rows={9}
                className="textarea"
                placeholder="Paste full resume text…"
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  save(STORAGE.resume, e.target.value);
                }}
              />
            </Field>
            <Field label="2-3 projects to feature (optional)" hint="Name each project and what shipped / the outcome / the stack.">
              <textarea
                rows={5}
                className="textarea"
                placeholder={"1. CrackedScore — shipped Next.js + AI SDK + Clerk app in 72h, 120+ funding programs indexed.\n2. …"}
                value={featuredProjects}
                onChange={(e) => {
                  setFeaturedProjects(e.target.value);
                  save(STORAGE.projects, e.target.value);
                }}
              />
            </Field>
          </section>
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-muted)]/40 px-5 py-4">
          <button onClick={generate} disabled={loading} className="btn">
            {loading ? "Generating deck (20-40s)…" : `Generate .pptx for ${seed.companyName}`}
          </button>
          <span className="ml-auto text-xs text-[var(--color-muted-foreground)]">
            Downloads as .pptx · opens in PowerPoint, Keynote, or Canva (File → Import).
          </span>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <p className="mt-1 text-[11px] text-[var(--color-muted-foreground)]">{hint}</p>}
    </div>
  );
}
