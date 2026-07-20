"use client";

import { StatCard } from "@/components/stat-card";
import { LinkRow } from "@/components/link-row";
import { UrlInput } from "@/components/url-input";
import { dummyStats, dummyLinks, dummyChartData } from "@/lib/dummy-data";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const activeLinks = dummyLinks.filter((l) => !l.archived);
  const maxClicks = Math.max(...dummyChartData.map((d) => d.clicks));

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Good afternoon, Sagar!
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s what&apos;s happening with your links today.
          </p>
        </div>
        <button className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all self-start">
          <Plus className="size-4" />
          New Link
        </button>
      </div>

      {/* URL Input */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <UrlInput compact />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummyStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">Click Analytics</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-primary" />
                Clicks
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-chart-3" />
                Visitors
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-3 h-48">
            {dummyChartData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-1 h-40">
                  <div
                    className="flex-1 bg-primary/20 dark:bg-primary/30 rounded-t-md transition-all duration-500 hover:bg-primary/30 dark:hover:bg-primary/40"
                    style={{ height: `${(d.clicks / maxClicks) * 100}%` }}
                    title={`${d.clicks} clicks`}
                  />
                  <div
                    className="flex-1 bg-chart-3/40 rounded-t-md transition-all duration-500 hover:bg-chart-3/60"
                    style={{ height: `${(d.visitors / maxClicks) * 100}%` }}
                    title={`${d.visitors} visitors`}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Links */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-1">Top Links</h2>
          <p className="text-xs text-muted-foreground mb-5">Best performing this week</p>

          <div className="space-y-4">
            {activeLinks.slice(0, 4).map((link, i) => (
              <div key={link.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                  {i + 1}
                </span>
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${link.favicon}&sz=32`}
                    alt=""
                    className="size-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{link.shortUrl}</p>
                  <p className="text-[11px] text-muted-foreground">{link.clicks.toLocaleString()} clicks</p>
                </div>
                {/* Mini bar */}
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(link.clicks / activeLinks[0].clicks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent Links</h2>
          <a
            href="/dashboard/links"
            className="text-sm text-primary font-medium hover:underline"
          >
            View all →
          </a>
        </div>
        <div className="space-y-2">
          {activeLinks.slice(0, 5).map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
}
