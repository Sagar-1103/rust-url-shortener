export interface LinkItem {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title: string;
  clicks: number;
  visitors: number;
  createdAt: string;
  archived: boolean;
  hasQr: boolean;
  favicon: string;
}

export interface StatData {
  label: string;
  value: string;
  change: number;
  icon: string;
}

export const dummyStats: StatData[] = [
  { label: "Total Links", value: "142", change: 12.5, icon: "link" },
  { label: "Total Clicks", value: "28,922", change: -3.2, icon: "mouse-pointer-click" },
  { label: "Visitors", value: "6,351", change: 8.7, icon: "users" },
  { label: "QR Scans", value: "1,204", change: 15.3, icon: "qr-code" },
];

export const dummyLinks: LinkItem[] = [
  {
    id: "1",
    originalUrl: "https://www.figma.com/design/project-alpha-dashboard-v2",
    shortCode: "figma-dash",
    shortUrl: "trimit.io/figma-dash",
    title: "Figma – Project Alpha Dashboard",
    clicks: 4521,
    visitors: 1203,
    createdAt: "2026-07-15",
    archived: false,
    hasQr: true,
    favicon: "figma.com",
  },
  {
    id: "2",
    originalUrl: "https://github.com/rust-lang/rust/releases/tag/1.82.0",
    shortCode: "rust-82",
    shortUrl: "trimit.io/rust-82",
    title: "Rust 1.82.0 Release",
    clicks: 8934,
    visitors: 2145,
    createdAt: "2026-07-12",
    archived: false,
    hasQr: true,
    favicon: "github.com",
  },
  {
    id: "3",
    originalUrl: "https://nextjs.org/blog/next-16",
    shortCode: "next-16",
    shortUrl: "trimit.io/next-16",
    title: "Next.js 16 Blog Post",
    clicks: 6231,
    visitors: 1876,
    createdAt: "2026-07-10",
    archived: false,
    hasQr: false,
    favicon: "nextjs.org",
  },
  {
    id: "4",
    originalUrl: "https://docs.google.com/spreadsheets/d/1abc-quarterly-report",
    shortCode: "q3-report",
    shortUrl: "trimit.io/q3-report",
    title: "Q3 Quarterly Report",
    clicks: 2104,
    visitors: 543,
    createdAt: "2026-07-08",
    archived: false,
    hasQr: true,
    favicon: "docs.google.com",
  },
  {
    id: "5",
    originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    shortCode: "cool-vid",
    shortUrl: "trimit.io/cool-vid",
    title: "Amazing Video – YouTube",
    clicks: 12450,
    visitors: 3201,
    createdAt: "2026-07-05",
    archived: false,
    hasQr: false,
    favicon: "youtube.com",
  },
  {
    id: "6",
    originalUrl: "https://linear.app/team/project-roadmap-2026",
    shortCode: "roadmap",
    shortUrl: "trimit.io/roadmap",
    title: "2026 Product Roadmap – Linear",
    clicks: 3872,
    visitors: 897,
    createdAt: "2026-06-28",
    archived: false,
    hasQr: true,
    favicon: "linear.app",
  },
  {
    id: "7",
    originalUrl: "https://medium.com/@techwriter/understanding-webassembly",
    shortCode: "wasm-101",
    shortUrl: "trimit.io/wasm-101",
    title: "Understanding WebAssembly – Medium",
    clicks: 1567,
    visitors: 421,
    createdAt: "2026-06-20",
    archived: true,
    hasQr: false,
    favicon: "medium.com",
  },
  {
    id: "8",
    originalUrl: "https://stackoverflow.com/questions/12345/best-rust-practices",
    shortCode: "rust-tips",
    shortUrl: "trimit.io/rust-tips",
    title: "Best Rust Practices – Stack Overflow",
    clicks: 987,
    visitors: 312,
    createdAt: "2026-06-15",
    archived: true,
    hasQr: true,
    favicon: "stackoverflow.com",
  },
];

export const dummyChartData = [
  { day: "Mon", clicks: 1240, visitors: 430 },
  { day: "Tue", clicks: 1580, visitors: 520 },
  { day: "Wed", clicks: 980, visitors: 340 },
  { day: "Thu", clicks: 2100, visitors: 710 },
  { day: "Fri", clicks: 1890, visitors: 640 },
  { day: "Sat", clicks: 760, visitors: 280 },
  { day: "Sun", clicks: 1340, visitors: 460 },
];
