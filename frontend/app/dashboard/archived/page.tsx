"use client";

import { dummyLinks } from "@/lib/dummy-data";
import { LinkRow } from "@/components/link-row";
import { Archive } from "lucide-react";

export default function ArchivedPage() {
  const archivedLinks = dummyLinks.filter((l) => l.archived);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Archived Links</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Links you&apos;ve archived. They still redirect but won&apos;t appear in your active list.
        </p>
      </div>

      {/* Archived count */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
          <Archive className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {archivedLinks.length} archived link{archivedLinks.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            These links are still functional but hidden from your dashboard.
          </p>
        </div>
      </div>

      {/* Links */}
      {archivedLinks.length > 0 ? (
        <div className="space-y-2">
          {archivedLinks.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Archive className="size-6 text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold">No archived links</p>
          <p className="text-sm text-muted-foreground mt-1">
            Links you archive will show up here.
          </p>
        </div>
      )}
    </div>
  );
}
