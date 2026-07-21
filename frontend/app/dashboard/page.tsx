"use client";

import { useEffect, useState, useCallback } from "react";
import { StatCard } from "@/components/stat-card";
import { LinkRow } from "@/components/link-row";
import { CreateLinkDialog } from "@/components/create-link-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStatsApi, deleteUrlApi, toggleArchiveApi, DashboardStatsData } from "@/lib/api";
import { mapBackendUrlToLinkItem } from "@/lib/utils";
import { LinkItem } from "@/lib/dummy-data";
import { useAuth } from "@/lib/auth-context";
import { Plus, Link2, MousePointerClick, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await getDashboardStatsApi();
      if (res.success && res.data) {
        setStatsData(res.data);
      }
    } catch {
      // Error fetching stats
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleDelete = async (id: string): Promise<boolean> => {
    try {
      const res = await deleteUrlApi(id);
      if (res.success) {
        await fetchDashboardStats();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleToggleArchive = async (id: string) => {
    const res = await toggleArchiveApi(id);
    if (res.success) {
      fetchDashboardStats();
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>

        <Skeleton className="h-44 rounded-2xl" />

        <div className="space-y-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  const topLinkItems: LinkItem[] = statsData?.top_links.map(mapBackendUrlToLinkItem) || [];
  const recentLinkItems: LinkItem[] = statsData?.recent_links.map(mapBackendUrlToLinkItem) || [];

  const currentStats = [
    { label: "Total Links", value: (statsData?.total_links ?? 0).toString(), icon: "link" },
    { label: "Total Clicks", value: (statsData?.total_clicks ?? 0).toLocaleString(), icon: "mouse-pointer-click" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Welcome back{user?.username ? `, ${user.username}` : ""}!
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s what&apos;s happening with your links today.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Top Links */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-base font-semibold text-foreground mb-1">Top Links</h2>
        <p className="text-xs text-muted-foreground mb-5">Best performing links</p>

        {topLinkItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topLinkItems.map((link, i) => (
              <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <span className="text-xs font-bold text-muted-foreground w-4 text-center">
                  {i + 1}
                </span>
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {link.imageUrl ? (
                    <img src={link.imageUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${link.favicon}&sz=32`}
                      alt=""
                      className="size-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                  <p className="text-[11px] text-muted-foreground">{link.clicks.toLocaleString()} clicks</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-6">
            No top links yet. Shorten a URL to get started!
          </p>
        )}
      </div>

      {/* Recent Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent Links</h2>
          <Link
            href="/dashboard/links"
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/50 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
          </Link>
        </div>

        {recentLinkItems.length > 0 ? (
          <div className="space-y-2">
            {recentLinkItems.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                onDelete={handleDelete}
                onToggleArchive={handleToggleArchive}
                onUpdated={fetchDashboardStats}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Link2 className="size-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold">No links created yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Create your first shortened URL to start tracking clicks.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="size-3.5" />
              Create Link
            </button>
          </div>
        )}
      </div>

      <CreateLinkDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onUrlCreated={fetchDashboardStats}
      />
    </div>
  );
}
