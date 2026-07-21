import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BackendUrl } from "@/lib/api";
import { LinkItem } from "@/lib/dummy-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullShortUrl(shortUrl: string): string {
  if (!shortUrl) return "";
  if (shortUrl.startsWith("http://") || shortUrl.startsWith("https://")) {
    return shortUrl;
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${shortUrl}`;
  }
  if (shortUrl.includes("localhost") || shortUrl.includes("127.0.0.1")) {
    return `http://${shortUrl}`;
  }
  return `https://${shortUrl}`;
}

export function mapBackendUrlToLinkItem(item: BackendUrl): LinkItem {
  let domain = "";
  try {
    domain = new URL(item.original_url).hostname;
  } catch {
    domain = item.original_url;
  }

  const host = typeof window !== "undefined" ? window.location.host : "localhost:3000";
  const shortUrl = `${host}/${item.code}`;

  return {
    id: item.id,
    originalUrl: item.original_url,
    shortCode: item.code,
    shortUrl: shortUrl,
    title: item.title || item.original_url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    clicks: item.click_count,
    visitors: Math.floor(item.click_count * 0.7),
    createdAt: item.created_at ? item.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
    archived: item.archived ?? false,
    hasQr: true,
    favicon: domain,
    imageUrl: item.image_url,
  };
}

