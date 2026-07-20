"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors } from "lucide-react";
import { UrlInput } from "@/components/url-input";
import { AuthDialog } from "@/components/auth-dialog";

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

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
            <button
              onClick={() => openAuth("login")}
              className="h-9 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="h-9 px-5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-80 transition-all"
            >
              Sign Up
            </button>
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
