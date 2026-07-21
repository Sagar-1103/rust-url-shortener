"use client";

import { useState } from "react";
import { MousePointerClick, ExternalLink } from "lucide-react";
import type { LinkItem } from "@/lib/dummy-data";
import { LinkDetailsDialog } from "@/components/link-details-dialog";
import { getFullShortUrl } from "@/lib/utils";

interface LinkRowProps {
  link: LinkItem;
  onToggleArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdated?: () => void;
}

export function LinkRow({ link, onToggleArchive, onDelete, onUpdated }: LinkRowProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fullShortUrl = getFullShortUrl(link.shortUrl);


  return (
    <>
      <div
        onClick={() => setDetailsOpen(true)}
        className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.04] dark:hover:shadow-primary/[0.08] transition-all duration-200 cursor-pointer"
      >
        {/* Favicon / Preview Image */}
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {link.imageUrl ? (
            <img
              src={link.imageUrl}
              alt=""
              className="size-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <img
              src={`https://www.google.com/s2/favicons?domain=${link.favicon}&sz=32`}
              alt=""
              className="size-5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* Link info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {link.title}
            </p>
            {link.archived && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                Archived
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-medium text-primary">{link.shortUrl}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground truncate">{link.originalUrl}</span>
          </div>
        </div>

        {/* Clicks Pill & Redirect Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/60 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
            <MousePointerClick className="size-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              {link.clicks.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              {link.clicks === 1 ? "click" : "clicks"}
            </span>
          </div>

          <a
            href={fullShortUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open / Redirect Link"
            className="size-8.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer hover:border-primary/40 shadow-sm"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>

      <LinkDetailsDialog
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        link={link}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
        onUpdated={onUpdated}
      />
    </>
  );
}




