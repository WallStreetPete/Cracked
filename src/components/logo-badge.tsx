"use client";
import { useState } from "react";
import { domainFromUrl, initials, logoFallbackUrl, logoUrl } from "@/lib/logo";

export function LogoBadge({
  name,
  website,
  size = 40,
  rounded = "rounded-xl",
}: {
  name: string;
  website?: string | null;
  size?: number;
  rounded?: string;
}) {
  const domain = domainFromUrl(website);
  const [step, setStep] = useState<0 | 1 | 2>(domain ? 0 : 2);
  const hd = Math.max(size * 4, 256);
  const src = step === 0 ? logoUrl(domain, hd) : step === 1 ? logoFallbackUrl(domain, hd) : "";
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden border border-[var(--color-border)] bg-[var(--color-muted)] ${rounded}`}
      style={{ width: size, height: size }}
      aria-label={`${name} logo`}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-contain p-1"
          onError={() => setStep((s) => ((s + 1) as 0 | 1 | 2))}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-[0.7rem] font-bold tracking-tight text-[var(--color-muted-foreground)]">
          {initials(name)}
        </span>
      )}
    </div>
  );
}
