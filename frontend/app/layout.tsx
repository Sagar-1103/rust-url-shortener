import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://trimit-green.vercel.app"),
  title: {
    default: "TrimIt | Smart URL Shortener",
    template: "%s | TrimIt",
  },
  description:
    "Shorten, manage, and track your links with TrimIt. Create branded short URLs, generate QR codes, and gain powerful analytics.",
  keywords: ["URL shortener", "link shortener", "custom links", "QR code generator", "link analytics", "TrimIt"],
  authors: [{ name: "TrimIt Team" }],
  creator: "TrimIt",
  icons: {
    icon: [
      { url: "/logo-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/logo-light.png",
    apple: "/logo-dark.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trimit-green.vercel.app",
    title: "TrimIt | Smart URL Shortener",
    description:
      "Shorten, manage, and track your links with TrimIt. Create branded short URLs, generate QR codes, and gain powerful analytics.",
    siteName: "TrimIt",
    images: [
      {
        url: "/logo-dark.png",
        width: 1254,
        height: 1254,
        alt: "TrimIt - Smart URL Shortener",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrimIt | Smart URL Shortener",
    description:
      "Shorten, manage, and track your links with TrimIt. Create branded short URLs, generate QR codes, and gain powerful analytics.",
    images: ["/logo-dark.png"],
    creator: "@trimit",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
