export function domainFromUrl(url?: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function logoUrl(domain: string, size = 256): string {
  if (!domain) return "";
  const s = Math.min(Math.max(size, 128), 400);
  return `https://logo.clearbit.com/${domain}?size=${s}`;
}

export function logoFallbackUrl(domain: string, size = 256): string {
  if (!domain) return "";
  const s = Math.min(Math.max(size, 64), 256);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${s}`;
}

export function initials(name: string): string {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
