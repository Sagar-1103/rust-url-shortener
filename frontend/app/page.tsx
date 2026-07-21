"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { UrlInput } from "@/components/url-input";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const openAuth = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-foreground flex items-center justify-center">
              <Scissors className="size-4 text-background" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">TrimIt</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-border bg-card hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="size-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary-foreground">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{user.username}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </button>

                  {profileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl border border-border shadow-lg shadow-black/10 dark:shadow-black/30 z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-[11px] font-medium text-muted-foreground">Signed in as</p>
                          <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
                        </div>
                        <button
                          onClick={async () => {
                            setProfileMenuOpen(false);
                            await logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="size-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="h-9 px-4 cursor-pointer rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="h-9 px-5 cursor-pointer rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-80 transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero — just the input */}
      <section className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-3">
            Shorten your links
          </h1>
          <p className="text-base text-muted-foreground mb-10 max-w-md mx-auto">
            Paste a long URL and get a short, trackable link instantly.
          </p>

          <UrlInput />
        </div>
      </section>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </div>
  );
}
