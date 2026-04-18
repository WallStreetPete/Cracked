import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreBand(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "ACTUALLY CRACKED", color: "var(--color-success)" };
  if (score >= 75) return { label: "Close to cracked", color: "var(--color-success)" };
  if (score >= 60) return { label: "Mid", color: "var(--color-warning)" };
  if (score >= 40) return { label: "NPC", color: "var(--color-warning)" };
  return { label: "Cooked", color: "var(--color-danger)" };
}

export function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
