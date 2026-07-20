"use client";

import {
  Link2,
  MousePointerClick,
  Users,
  QrCode,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  link: Link2,
  "mouse-pointer-click": MousePointerClick,
  users: Users,
  "qr-code": QrCode,
};

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  icon: string;
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
  const Icon = iconMap[icon] || Link2;
  const isPositive = change >= 0;

  return (
    <div className="group relative p-5 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.04] dark:hover:shadow-primary/[0.08] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="size-11 rounded-xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center group-hover:bg-primary/12 dark:group-hover:bg-primary/20 transition-colors">
          <Icon className="size-5 text-primary" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? "text-green-600 bg-green-500/10 dark:text-green-400 dark:bg-green-500/15"
              : "text-red-600 bg-red-500/10 dark:text-red-400 dark:bg-red-500/15"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
