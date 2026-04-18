import RoastClient from "./roast-client";

export const metadata = { title: "Cracked — Roast me" };

export default function RoastPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="tag border-[var(--color-accent)]/40 text-[var(--color-accent)]">/01 · roast</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Drop your resume. Get cooked.
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted-foreground)]">
          PDF or DOCX. Optional LinkedIn URL + a paragraph about what you're up to. Claude will rate
          you out of 100, demolish you line-by-line, and suggest the only jobs and checks that
          actually fit you.
        </p>
      </header>
      <RoastClient />
    </div>
  );
}
