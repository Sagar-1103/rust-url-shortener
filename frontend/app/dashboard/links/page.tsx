"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import { LinkRow } from "@/components/link-row";
import { LinkItem } from "@/lib/dummy-data";
import { getUrlsApi, deleteUrlApi, toggleArchiveApi } from "@/lib/api";
import { mapBackendUrlToLinkItem } from "@/lib/utils";
import { CreateLinkDialog } from "@/components/create-link-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function LinksPage() {
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await getUrlsApi();
      if (res.success && res.data) {
        setLinks(res.data.map(mapBackendUrlToLinkItem));
      }
    } catch {
      // Failed to fetch links
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDelete = async (id: string) => {
    const res = await deleteUrlApi(id);
    if (res.success) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleToggleArchive = async (id: string) => {
    const res = await toggleArchiveApi(id);
    if (res.success) {
      fetchLinks();
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>

        <Skeleton className="h-10 w-full rounded-xl" />

        <div className="space-y-3 pt-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  const activeLinks = links.filter((l) => !l.archived);

  const filteredLinks = activeLinks.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.shortUrl.toLowerCase().includes(search.toLowerCase()) ||
      l.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Links</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all your shortened links in one place.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all self-start cursor-pointer"
        >
          <Plus className="size-4" />
          New Link
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Links count */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredLinks.length}</span> links
      </p>

      {/* Links list */}
      <div className="space-y-2">
        {filteredLinks.map((link) => (
          <LinkRow
            key={link.id}
            link={link}
            onDelete={handleDelete}
            onToggleArchive={handleToggleArchive}
            onUpdated={fetchLinks}
          />
        ))}
      </div>

      {filteredLinks.length === 0 && (
        <div className="text-center py-16">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="size-6 text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold">No links found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or create a new link.
          </p>
        </div>
      )}

      <CreateLinkDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onUrlCreated={fetchLinks}
      />
    </div>
  );
}
