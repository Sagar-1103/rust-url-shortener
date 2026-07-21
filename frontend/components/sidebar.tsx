"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Link2,
  QrCode,
  Archive,
  Settings,
  Scissors,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/archived", label: "Archived", icon: Archive },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const username = user?.username || "User";
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside
      className={`${collapsed ? "w-[72px]" : "w-[260px]"
        } h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Scissors className="size-4.5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-in fade-in duration-200">
              <h1 className="text-base font-bold text-foreground tracking-tight">TrimIt</h1>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? "bg-primary/10 text-primary dark:bg-primary/15"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={`size-[18px] shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
              />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto size-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="px-3 py-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-[18px] shrink-0 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="size-[18px] shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-sidebar-border shrink-0">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="size-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary-foreground">{initial}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in duration-200">
              <p className="text-sm font-semibold text-foreground truncate">{username}</p>
              <p className="text-xs text-muted-foreground truncate">Logged in</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="size-8 cursor-pointer rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
