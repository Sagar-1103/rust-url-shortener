"use client";

import { useEffect, useState } from "react";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Download,
  Archive,
  ArchiveRestore,
  Trash2,
  Pencil,
  Calendar,
  MousePointerClick,
  Globe,
} from "lucide-react";
import QRCode from "qrcode";
import type { LinkItem } from "@/lib/dummy-data";
import { EditLinkDialog } from "@/components/edit-link-dialog";
import { getFullShortUrl } from "@/lib/utils";

interface LinkDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkItem | null;
  onToggleArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdated?: () => void;
}

export function LinkDetailsDialog({
  isOpen,
  onClose,
  link,
  onToggleArchive,
  onDelete,
  onUpdated,
}: LinkDetailsDialogProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);

  const fullShortUrl = link ? getFullShortUrl(link.shortUrl) : "";


  useEffect(() => {
    if (fullShortUrl) {
      QRCode.toDataURL(fullShortUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }
  }, [fullShortUrl]);

  if (!isOpen || !link) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-${link.shortCode || "link"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formattedDate = link.createdAt
    ? new Date(link.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently created";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto sm:p-6">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Dialog Content */}
        <div className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl shadow-black/20 dark:shadow-black/60 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200 overflow-hidden my-auto z-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer z-10"
          >
            <X className="size-4" />
          </button>

          {/* Header section */}
          <div className="p-6 pb-4 border-b border-border bg-muted/20">
            <div className="flex items-start gap-3.5 pr-8">
              {/* Favicon / Image */}
              <div className="size-12 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                {link.imageUrl ? (
                  <img src={link.imageUrl} alt="" className="size-full object-cover" />
                ) : (
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${link.favicon}&sz=64`}
                    alt=""
                    className="size-6"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground truncate">{link.title}</h2>
                  {link.archived && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      Archived
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <MousePointerClick className="size-3.5 text-primary" />
                    {link.clicks.toLocaleString()} clicks
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dialog Body */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Short URL Box */}
            <div className="p-4 bg-muted/40 rounded-xl border border-border space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Short Link
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-primary truncate select-all">
                  {fullShortUrl}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                  <a
                    href={fullShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                    title="Open Link"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Original URL Box */}
            <div className="p-4 bg-card rounded-xl border border-border space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Globe className="size-3" />
                Destination URL
              </div>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-foreground/80 hover:text-primary break-all line-clamp-2 underline-offset-2 hover:underline font-mono"
              >
                {link.originalUrl}
              </a>
            </div>

            {/* QR Code Section */}
            <div className="p-5 bg-card rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="size-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">QR Code</span>
                </div>
                <button
                  onClick={handleDownloadQr}
                  disabled={!qrDataUrl}
                  className="h-7 px-2.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-[11px] font-medium text-foreground flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="size-3" />
                  Download PNG
                </button>
              </div>

              <div className="p-4 bg-white rounded-xl border border-border/60 flex justify-center items-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Link QR Code"
                    className="size-36 object-contain rounded"
                  />
                ) : (
                  <div className="size-36 flex items-center justify-center">
                    <span className="size-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-border space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Actions
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setEditOpen(true)}
                  className="h-10 px-3.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Pencil className="size-3.5 text-muted-foreground" />
                  Edit Title
                </button>

                <button
                  onClick={handleCopy}
                  className="h-10 px-3.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="size-3.5 text-primary" />
                  ) : (
                    <Copy className="size-3.5 text-muted-foreground" />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </button>

                <a
                  href={fullShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-3.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                  Open Link
                </a>

                {onToggleArchive && (
                  <button
                    onClick={() => {
                      onToggleArchive(link.id);
                      onClose();
                    }}
                    className="h-10 px-3.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {link.archived ? (
                      <>
                        <ArchiveRestore className="size-3.5 text-muted-foreground" />
                        Restore Link
                      </>
                    ) : (
                      <>
                        <Archive className="size-3.5 text-muted-foreground" />
                        Archive Link
                      </>
                    )}
                  </button>
                )}
              </div>

              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(link.id);
                    onClose();
                  }}
                  className="w-full h-10 mt-1 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer border border-destructive/20"
                >
                  <Trash2 className="size-3.5" />
                  Delete Link
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditLinkDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        linkId={link.id}
        currentTitle={link.title}
        onUpdated={() => {
          onUpdated?.();
          onClose();
        }}
      />
    </>
  );
}
