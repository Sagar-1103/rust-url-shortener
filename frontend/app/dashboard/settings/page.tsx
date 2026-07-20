"use client";

import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Monitor, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

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

      {/* Appearance */}
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
                className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left group ${
                  theme === opt.value
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
                <div className={`w-full h-24 rounded-lg mb-4 border overflow-hidden ${
                  opt.value === "light" ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"
                }`}>
                  <div className={`h-6 border-b flex items-center gap-1.5 px-3 ${
                    opt.value === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700"
                  }`}>
                    <div className="size-1.5 rounded-full bg-red-400" />
                    <div className="size-1.5 rounded-full bg-yellow-400" />
                    <div className="size-1.5 rounded-full bg-green-400" />
                  </div>
                  <div className="p-2 flex gap-1.5">
                    <div className={`w-8 h-full rounded ${
                      opt.value === "light" ? "bg-gray-100" : "bg-gray-800"
                    }`} />
                    <div className="flex-1 space-y-1.5">
                      <div className={`h-2 rounded w-3/4 ${
                        opt.value === "light" ? "bg-gray-200" : "bg-gray-700"
                      }`} />
                      <div className={`h-2 rounded w-1/2 ${
                        opt.value === "light" ? "bg-gray-100" : "bg-gray-800"
                      }`} />
                      <div className="flex gap-1">
                        <div className="h-3 rounded w-8 bg-primary/30" />
                        <div className="h-3 rounded w-8 bg-primary/20" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <opt.icon className={`size-5 ${
                    theme === opt.value ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <div>
                    <p className={`text-sm font-semibold ${
                      theme === opt.value ? "text-primary" : "text-foreground"
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

      {/* Profile */}
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
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Sagar</p>
              <p className="text-sm text-muted-foreground">sagar@example.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="Sagar"
                className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                defaultValue="sagar@example.com"
                className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all">
            Save Changes
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center">
              <Bell className="size-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Notifications</h2>
              <p className="text-xs text-muted-foreground">Manage your notification preferences</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {[
            { label: "Email notifications", desc: "Get notified about link performance", default: true },
            { label: "Weekly reports", desc: "Receive weekly analytics summary", default: true },
            { label: "Click milestones", desc: "Get alerts when links hit milestones", default: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.default}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:size-4 after:transition-all peer-checked:after:translate-x-[18px] after:shadow-sm" />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-card rounded-2xl border border-destructive/30 overflow-hidden">
        <div className="px-6 py-5 border-b border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Shield className="size-4.5 text-destructive" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Danger Zone</h2>
              <p className="text-xs text-muted-foreground">Irreversible account actions</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all data.
            </p>
          </div>
          <button className="h-9 px-5 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
