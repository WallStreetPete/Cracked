import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cracked — are you actually cracked?",
  description:
    "Upload your resume. Get roasted out of 100. Find category-defining jobs and funding. No mercy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ff3d00",
          colorBackground: "#0a0a0a",
          colorText: "#fafafa",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#fafafa",
          borderRadius: "0.5rem",
        },
      }}
    >
      <html lang="en">
        <body>
          <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-black/60 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-accent)] glow" />
                <span className="text-lg">cracked</span>
                <span className="text-xs font-mono text-[var(--color-muted-foreground)]">v0.1</span>
              </Link>
              <nav className="flex items-center gap-1 text-sm">
                <Link className="btn-ghost btn btn-sm" href="/roast">Roast me</Link>
                <Link className="btn-ghost btn btn-sm" href="/jobs">Jobs</Link>
                <Link className="btn-ghost btn btn-sm" href="/funding">Funding</Link>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="btn btn-ghost btn-sm">Sign in</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn btn-sm">Sign up</button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <div className="ml-1">
                    <UserButton />
                  </div>
                </Show>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="mx-auto max-w-6xl px-4 py-10 text-xs text-[var(--color-muted-foreground)]">
            Built to be brutally honest. If this hurts, that's the point.
          </footer>
          <Toaster position="top-right" theme="dark" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
