"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, Copy, Check, QrCode } from "lucide-react";
import { getUrlsApi } from "@/lib/api";
import { mapBackendUrlToLinkItem } from "@/lib/utils";
import { LinkItem } from "@/lib/dummy-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function QrPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await getUrlsApi();
      if (res.success && res.data) {
        setLinks(res.data.map(mapBackendUrlToLinkItem));
      }
    } catch {
      // Error fetching links
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleCopy = (id: string, shortUrl: string) => {
    const fullUrl = shortUrl.startsWith("http") ? shortUrl : `https://${shortUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const activeLinks = links.filter((l) => !l.archived);

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
      {activeLinks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeLinks.map((link, idx) => (
            <div
              key={link.id}
              className="group bg-card rounded-2xl border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04] dark:hover:shadow-primary/[0.08] transition-all duration-300 overflow-hidden"
            >
              {/* QR Preview */}
              <div className="p-8 flex items-center justify-center bg-muted/30 dark:bg-muted/10">
                <div className="relative">
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

                    {/* Data modules */}
                    {[56, 64, 72, 80, 88, 96, 104].map((x) =>
                      [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144].map(
                        (y) => {
                          const show = (x * 7 + y * 13 + (idx + 1) * 37) % 3 !== 0;
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
                    className="flex-1 h-9 rounded-lg border border-border bg-card text-sm font-medium text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors cursor-pointer"
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
                  <button className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-all cursor-pointer">
                    <Download className="size-3.5" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <QrCode className="size-6 text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold">No QR Codes available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Shorten a link to automatically generate its QR code.
          </p>
        </div>
      )}
    </div>
  );
}
