"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff, Scissors } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export function AuthDialog({ isOpen, onClose, defaultTab = "login" }: AuthDialogProps) {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (tab === "signup") {
      if (!confirmPassword.trim()) {
        setError("Please confirm your password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (tab === "login") {
        const res = await login(username.trim(), password);
        if (res.success) {
          onClose();
          router.push("/dashboard");
        } else {
          setError(res.message || "Failed to log in.");
        }
      } else {
        const res = await signup(username.trim(), password);
        if (res.success) {
          onClose();
          router.push("/dashboard");
        } else {
          setError(res.message || "Failed to sign up.");
        }
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md mx-4 bg-card rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/40 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="pt-8 pb-2 px-8 text-center">
          <div className="size-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Scissors className="size-5.5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {tab === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {tab === "login"
              ? "Sign in to your TrimIt account"
              : "Start shortening your URLs for free"}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-4">
          <div className="flex p-1 bg-muted rounded-xl">
            <button
              onClick={() => { setTab("login"); setError(null); setConfirmPassword(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${tab === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground cursor-pointer"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("signup"); setError(null); setConfirmPassword(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${tab === "signup"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground cursor-pointer"
                }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pt-5 pb-8">
          {error && (
            <div className="mb-4 p-3 text-xs font-medium rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {tab === "signup" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 px-4 pr-11 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer h-11 mt-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : tab === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-5">
            {tab === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => { setTab("signup"); setError(null); setConfirmPassword(""); }} className="text-primary cursor-pointer font-medium hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => { setTab("login"); setError(null); setConfirmPassword(""); }} className="text-primary cursor-pointer font-medium hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
