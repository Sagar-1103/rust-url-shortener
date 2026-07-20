"use client";

import { useState } from "react";
import { Copy, ExternalLink, QrCode, Archive, ArchiveRestore, Check } from "lucide-react";
import type { LinkItem } from "@/lib/dummy-data";

interface LinkRowProps {
  link: LinkItem;
  onToggleArchive?: (id: string) => void;
}

export function LinkRow({ link, onToggleArchive }: LinkRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${link.shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.03] dark:hover:shadow-primary/[0.06] transition-all duration-200">
      {/* Favicon */}
      <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={`https://www.google.com/s2/favicons?domain=${link.favicon}&sz=32`}
          alt=""
          className="size-5"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Link info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground truncate">{link.title}</p>
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

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 shrink-0">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{link.clicks.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">clicks</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{link.visitors.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">visitors</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          title="Copy short URL"
          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
        </button>
        <a
          href={`https://${link.shortUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open link"
          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink className="size-3.5" />
        </a>
        {link.hasQr && (
          <button
            title="View QR Code"
            className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <QrCode className="size-3.5" />
          </button>
        )}
        <button
          onClick={() => onToggleArchive?.(link.id)}
          title={link.archived ? "Restore" : "Archive"}
          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {link.archived ? (
            <ArchiveRestore className="size-3.5" />
          ) : (
            <Archive className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
