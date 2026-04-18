import Link from "next/link";

const tiles = [
  {
    href: "/roast",
    tag: "01",
    title: "Roast me",
    blurb:
      "Upload your resume + LinkedIn. We'll grade you out of 100 on how cracked you are, line-by-line. Bring ego-protection.",
    cta: "Get roasted →",
  },
  {
    href: "/jobs",
    tag: "02",
    title: "Category-defining jobs",
    blurb:
      "100+ companies building the future — Anthropic, OpenAI, SpaceX, Harvey, Hebbia, Rogo. Roles + contact discovery + one-click outreach.",
    cta: "Find roles →",
  },
  {
    href: "/funding",
    tag: "03",
    title: "Funding & accelerators",
    blurb:
      "YC, SPC, A16Z Speedrun, 500, Antler, and 40+ more. Live apply links, what they actually ask, and who to email.",
    cta: "Raise →",
  },
];

export default function Home() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 px-6 py-20 md:px-12 md:py-28">
        <div className="grain absolute inset-0 opacity-40" aria-hidden />
        <div className="relative">
          <span className="tag border-[var(--color-accent)]/40 text-[var(--color-accent)]">
            ◉ Live · brutal honesty mode
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Are you actually <span className="text-[var(--color-accent)]">cracked</span>,
            <br /> or just coping?
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--color-muted-foreground)]">
            Upload your resume. Get a cracked-score out of 100, line-by-line demolition, and a
            curated list of the only jobs and checks that actually matter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/roast" className="btn">Start the roast</Link>
            <Link href="/jobs" className="btn btn-ghost">Browse jobs</Link>
            <Link href="/funding" className="btn btn-ghost">Browse funding</Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card group flex flex-col justify-between transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]/50">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-muted-foreground)]">/{t.tag}</span>
                <span className="tag">{t.href.slice(1)}</span>
              </div>
              <h3 className="mt-4 text-2xl font-bold">{t.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{t.blurb}</p>
            </div>
            <div className="mt-8 text-sm font-semibold text-[var(--color-accent)] group-hover:translate-x-1 transition">{t.cta}</div>
          </Link>
        ))}
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-4">
        {[
          ["100+", "companies"],
          ["1000+", "live jobs"],
          ["50+", "accelerators"],
          ["100", "cracked score"],
        ].map(([n, l]) => (
          <div key={l} className="card text-center">
            <div className="text-4xl font-black text-[var(--color-accent)]">{n}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">{l}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
