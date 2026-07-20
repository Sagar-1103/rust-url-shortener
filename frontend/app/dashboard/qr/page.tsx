"use client";

import { dummyLinks } from "@/lib/dummy-data";
import { Download, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function QrPage() {
  const linksWithQr = dummyLinks.filter((l) => l.hasQr);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, shortUrl: string) => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">QR Codes</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View and download QR codes for your links.
        </p>
      </div>

      {/* QR Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {linksWithQr.map((link) => (
          <div
            key={link.id}
            className="group bg-card rounded-2xl border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04] dark:hover:shadow-primary/[0.08] transition-all duration-300 overflow-hidden"
          >
            {/* QR Preview */}
            <div className="p-8 flex items-center justify-center bg-muted/30 dark:bg-muted/10">
              <div className="relative">
                {/* Generated QR using an SVG pattern */}
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                  className="text-foreground"
                >
                  {/* Corner squares */}
                  <rect x="8" y="8" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="16" y="16" width="24" height="24" rx="2" fill="currentColor" />
                  <rect x="112" y="8" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="120" y="16" width="24" height="24" rx="2" fill="currentColor" />
                  <rect x="8" y="112" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="16" y="120" width="24" height="24" rx="2" fill="currentColor" />

                  {/* Data modules (randomized pattern) */}
                  {[56, 64, 72, 80, 88, 96, 104].map((x) =>
                    [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144].map(
                      (y) => {
                        const show = (x * 7 + y * 13 + parseInt(link.id) * 37) % 3 !== 0;
                        if (!show) return null;
                        if (x < 52 && y < 52) return null;
                        if (x > 108 && y < 52) return null;
                        if (x < 52 && y > 108) return null;
                        return (
                          <rect
                            key={`${x}-${y}`}
                            x={x}
                            y={y}
                            width="6"
                            height="6"
                            rx="1"
                            fill="currentColor"
                            opacity={0.85}
                          />
                        );
                      }
                    )
                  )}
                  {[8, 16, 24, 32, 40, 48].map((x) =>
                    [56, 64, 72, 80, 88, 96, 104].map((y) => {
                      const show = (x * 11 + y * 17 + parseInt(link.id) * 23) % 3 !== 0;
                      if (!show) return null;
                      return (
                        <rect
                          key={`l-${x}-${y}`}
                          x={x}
                          y={y}
                          width="6"
                          height="6"
                          rx="1"
                          fill="currentColor"
                          opacity={0.85}
                        />
                      );
                    })
                  )}

                  {/* Center logo area */}
                  <rect x="60" y="60" width="40" height="40" rx="8" fill="var(--primary)" />
                  <text
                    x="80"
                    y="84"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="var(--primary-foreground)"
                  >
                    T
                  </text>
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <p className="text-sm font-semibold text-foreground truncate">{link.title}</p>
              <p className="text-xs text-primary font-medium mt-0.5">{link.shortUrl}</p>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => handleCopy(link.id, link.shortUrl)}
                  className="flex-1 h-9 rounded-lg border border-border bg-card text-sm font-medium text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
                >
                  {copiedId === link.id ? (
                    <>
                      <Check className="size-3.5 text-primary" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy
                    </>
                  )}
                </button>
                <button className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-all">
                  <Download className="size-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
