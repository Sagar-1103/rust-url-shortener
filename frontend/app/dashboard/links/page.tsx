"use client";

import { useState } from "react";
import { Search, Filter, Plus, SortAsc } from "lucide-react";
import { LinkRow } from "@/components/link-row";
import { dummyLinks } from "@/lib/dummy-data";

export default function LinksPage() {
  const [search, setSearch] = useState("");
  const activeLinks = dummyLinks.filter((l) => !l.archived);

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
        <button className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all self-start">
          <Plus className="size-4" />
          New Link
        </button>
      </div>

      {/* Search & Filter Bar */}
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
        <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors">
          <Filter className="size-4" />
          Filter
        </button>
        <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors">
          <SortAsc className="size-4" />
          Sort
        </button>
      </div>

      {/* Links count */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredLinks.length}</span> links
      </p>

      {/* Links list */}
      <div className="space-y-2">
        {filteredLinks.map((link) => (
          <LinkRow key={link.id} link={link} />
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
    </div>
  );
}
