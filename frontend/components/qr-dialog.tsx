"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, QrCode, Download } from "lucide-react";
import QRCode from "qrcode";
import type { LinkItem } from "@/lib/dummy-data";

interface QrDialogProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkItem | null;
}

export function QrDialog({ isOpen, onClose, link }: QrDialogProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const fullShortUrl = link
    ? link.shortUrl.startsWith("http")
      ? link.shortUrl
      : `https://${link.shortUrl}`
    : "";

  useEffect(() => {
    if (fullShortUrl) {
      QRCode.toDataURL(fullShortUrl, {
        width: 300,
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

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-${link.shortCode || "link"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/40 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10 cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="pt-7 pb-2 px-6 text-center">
          <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <QrCode className="size-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">QR Code</h2>
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs mx-auto">
            {link.title || link.originalUrl}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Dynamic QR Code Canvas/Image */}
          <div className="p-6 flex flex-col items-center justify-center bg-white rounded-2xl border border-border/60 shadow-inner">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="size-44 object-contain rounded-lg"
              />
            ) : (
              <div className="size-44 flex items-center justify-center">
                <span className="size-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Link Info Pill */}
          <div className="p-3 bg-card rounded-xl border border-border flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">Short Link</p>
              <p className="text-sm font-semibold text-primary truncate">{fullShortUrl}</p>
            </div>
            <button
              onClick={handleCopy}
              className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={!qrDataUrl}
              className="w-full h-10 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs flex items-center justify-center gap-2 transition-all border border-border cursor-pointer disabled:opacity-50"
            >
              <Download className="size-4" />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
