"use client";

import { useState } from "react";
import { Link2, Scissors, ArrowRight } from "lucide-react";

export function UrlInput({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8);
      setShortened(`trimit.io/${code}`);
      setIsLoading(false);
    }, 800);
  };

  const handleCopy = () => {
    if (shortened) {
      navigator.clipboard.writeText(`https://${shortened}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleShorten();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setShortened(null); }}
            onKeyDown={handleKeyDown}
            placeholder="Paste your long URL here..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={handleShorten}
          disabled={!url.trim() || isLoading}
          className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Scissors className="size-4" />
          )}
          Trim
        </button>
        {shortened && (
          <button
            onClick={handleCopy}
            className="h-10 px-4 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-85 transition-all shrink-0 border border-border"
          >
            {copied ? "Copied!" : shortened}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-muted/50 to-primary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-3 p-2 bg-card rounded-2xl border border-border shadow-lg shadow-black/[0.03] dark:shadow-black/20">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setShortened(null); }}
              onKeyDown={handleKeyDown}
              placeholder="Paste your long URL here..."
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            onClick={handleShorten}
            disabled={!url.trim() || isLoading}
            className="h-12 px-7 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2.5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <span className="size-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Shorten
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {shortened && (
        <div className="mt-4 flex items-center justify-between p-4 bg-secondary rounded-xl border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
              <Scissors className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Your shortened link</p>
              <p className="text-sm font-semibold text-foreground">{shortened}</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {copied ? "Copied! ✓" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
