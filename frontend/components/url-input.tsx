"use client";

import { useState } from "react";
import { Link2, Scissors, ArrowRight } from "lucide-react";
import { shortenUrlApi, BackendUrl, getAccessToken } from "@/lib/api";
import { mapBackendUrlToLinkItem } from "@/lib/utils";
import { LinkItem } from "@/lib/dummy-data";
import { AuthDialog } from "@/components/auth-dialog";
import { LinkDetailsDialog } from "@/components/link-details-dialog";

export function UrlInput({
  compact = false,
  onUrlCreated,
}: {
  compact?: boolean;
  onUrlCreated?: (url: BackendUrl) => void;
}) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const [createdLink, setCreatedLink] = useState<LinkItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleShorten = async () => {
    if (!url.trim()) return;
    setError(null);

    let formattedUrl = url.trim();
    if (!/^https:\/\//i.test(formattedUrl)) {
      if (formattedUrl.startsWith("http://")) {
        formattedUrl = formattedUrl.replace(/^http:\/\//i, "https://");
      } else {
        formattedUrl = `https://${formattedUrl}`;
      }
    }
    setUrl(formattedUrl);

    const token = getAccessToken();
    if (!token) {
      setAuthDialogOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await shortenUrlApi(formattedUrl);
      if (res.success && res.data) {
        const newLinkItem = mapBackendUrlToLinkItem(res.data);
        if (onUrlCreated) {
          onUrlCreated(res.data);
        }
        setCreatedLink(newLinkItem);
        setUrl("");
        setDetailsOpen(true);
      } else {
        setError(res.message || "Failed to shorten URL.");
      }
    } catch {
      setError("Failed to shorten URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleShorten();
  };

  if (compact) {
    return (
      <>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com/my-long-url"
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={handleShorten}
              disabled={!url.trim() || isLoading}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Scissors className="size-4" />
              )}
              Trim
            </button>
          </div>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>

        <AuthDialog
          isOpen={authDialogOpen}
          onClose={() => setAuthDialogOpen(false)}
          defaultTab="login"
        />

        {createdLink && (
          <LinkDetailsDialog
            isOpen={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            link={createdLink}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-muted/50 to-primary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-3 p-2 bg-card rounded-2xl border border-border shadow-lg shadow-black/[0.03] dark:shadow-black/20">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com/my-long-url"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              onClick={handleShorten}
              disabled={!url.trim() || isLoading}
              className="h-12 px-7 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2.5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
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

        {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}
      </div>

      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        defaultTab="login"
      />

      {createdLink && (
        <LinkDetailsDialog
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          link={createdLink}
        />
      )}
    </>
  );
}

