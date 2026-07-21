"use client";

import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/auth-context";
import { Sun, Moon, User, Palette } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const username = user?.username || "User";
  const initial = username.charAt(0).toUpperCase();

  const themeOptions = [
    { value: "light" as const, label: "Light", icon: Sun, desc: "Clean and bright interface" },
    { value: "dark" as const, label: "Dark", icon: Moon, desc: "Easy on the eyes at night" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize your TrimIt experience.
        </p>
      </div>

      {/* Profile Section (Top) */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center">
              <User className="size-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Profile</h2>
              <p className="text-xs text-muted-foreground">Your account information</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-primary-foreground">{initial}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{username}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Appearance Section (Bottom) */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center">
              <Palette className="size-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Appearance</h2>
              <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left group cursor-pointer ${theme === opt.value
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border hover:border-primary/30 bg-card"
                  }`}
              >
                {/* Check indicator */}
                {theme === opt.value && (
                  <div className="absolute top-3 right-3 size-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="size-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Theme preview */}
                <div className={`w-full h-24 rounded-lg mb-4 border overflow-hidden ${opt.value === "light" ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"
                  }`}>
                  <div className={`h-6 border-b flex items-center gap-1.5 px-3 ${opt.value === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                    }`}>
                    <div className="size-1.5 rounded-full bg-red-400" />
                    <div className="size-1.5 rounded-full bg-yellow-400" />
                    <div className="size-1.5 rounded-full bg-green-400" />
                  </div>
                  <div className="p-2 flex gap-1.5">
                    <div className={`w-8 h-full rounded ${opt.value === "light" ? "bg-gray-100" : "bg-gray-800"
                      }`} />
                    <div className="flex-1 space-y-1.5">
                      <div className={`h-2 rounded w-3/4 ${opt.value === "light" ? "bg-gray-200" : "bg-gray-700"
                        }`} />
                      <div className={`h-2 rounded w-1/2 ${opt.value === "light" ? "bg-gray-100" : "bg-gray-800"
                        }`} />
                      <div className="flex gap-1">
                        <div className="h-3 rounded w-8 bg-primary/30" />
                        <div className="h-3 rounded w-8 bg-primary/20" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <opt.icon className={`size-5 ${theme === opt.value ? "text-primary" : "text-muted-foreground"
                    }`} />
                  <div>
                    <p className={`text-sm font-semibold ${theme === opt.value ? "text-primary" : "text-foreground"
                      }`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
