"use client";

import { useState } from "react";
import { X, Link2, ArrowRight, Tag } from "lucide-react";
import { shortenUrlApi, BackendUrl } from "@/lib/api";
import { mapBackendUrlToLinkItem } from "@/lib/utils";
import { LinkItem } from "@/lib/dummy-data";
import { LinkDetailsDialog } from "@/components/link-details-dialog";
import { Logo } from "@/components/logo";

interface CreateLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUrlCreated?: (url: BackendUrl) => void;
}

export function CreateLinkDialog({ isOpen, onClose, onUrlCreated }: CreateLinkDialogProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdLink, setCreatedLink] = useState<LinkItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleShorten = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    setIsLoading(true);
    try {
      const res = await shortenUrlApi(formattedUrl, title.trim() || undefined);
      if (res.success && res.data) {
        const linkData = {
          ...res.data,
          title: title.trim() || res.data.title,
        };
        const newLinkItem = mapBackendUrlToLinkItem(linkData);

        if (onUrlCreated) {
          onUrlCreated(linkData);
        }

        setCreatedLink(newLinkItem);
        setTitle("");
        setUrl("");
        setError(null);
        onClose();
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

  const handleClose = () => {
    setTitle("");
    setUrl("");
    setError(null);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/40 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10 cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="pt-8 pb-3 px-8 text-center">
              <Logo size={48} showText={false} className="justify-center mb-3" />
              <h2 className="text-xl font-bold text-foreground">Create New Link</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter a long URL to shorten and generate a trackable link
              </p>
            </div>

            {/* Content Form */}
            <div className="px-8 pb-8 pt-2">
              {error && (
                <div className="mb-4 p-3 text-xs font-medium rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleShorten} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Title <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. My Portfolio, Marketing Campaign"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Destination URL
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setError(null);
                      }}
                      placeholder="https://example.com/my-long-url"
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Shorten URL
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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

