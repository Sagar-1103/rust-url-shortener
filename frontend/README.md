# TrimIt Frontend

The user interface for **TrimIt**, a modern, high-performance link shortening and analytics platform. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

**Live Web App:** [https://trimit-green.vercel.app](https://trimit-green.vercel.app)

---

## Key Features

- **Instant URL Shortening**: Simple, clean hero widget on the landing page for quick link generation without clutter.
- **Interactive Dashboard**:
  - **Overview Stats**: Total links, total click tracking, top-performing links, and link activity breakdown.
  - **Link Filtering & Search**: Easily manage active vs. archived links with instant search and filter controls.
  - **Link Actions**: Edit original URL, update custom title, toggle archive status, and delete short links.
- **QR Code Generator**: Integrated QR code dialog with SVG/PNG preview and direct image download options.
- **Authentication System**:
  - Tabbed Modal for quick Login and Signup.
  - JWT token auto-refresh, local storage persistence, and secure logout handlers.
- **Responsive & Accessible Design**: Built with Tailwind CSS v4 and Base UI / Shadcn UI components supporting full dark and light mode themes.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Runtime & Package Manager**: Bun (`bun.lock`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, `tw-animate-css`
- **UI Components**: Lucide React icons, Base UI, Shadcn UI
- **Utilities**: `qrcode` (QR Code generation), `clsx`, `tailwind-merge`

---

## Directory Structure

```text
frontend/
├── app/
│   ├── [code]/            # Short code redirect page route
│   ├── dashboard/         # Protected dashboard views
│   │   ├── archived/      # Archived links management
│   │   ├── links/         # Full links list & management
│   │   ├── qr/            # Dedicated QR generator tool
│   │   └── settings/     # User profile & security settings
│   ├── globals.css        # Global CSS, Tailwind setup, & theme tokens
│   ├── layout.tsx         # Root layout with Auth & Theme providers
│   └── page.tsx           # Home landing page with url shortener input
├── components/
│   ├── ui/                # Base UI primitives (button, dialog, input, etc.)
│   ├── auth-dialog.tsx    # Login & Signup modal dialog
│   ├── create-link-dialog.tsx # New link creation modal
│   ├── edit-link-dialog.tsx   # Link editing modal
│   ├── link-details-dialog.tsx# Link analytics detail drawer
│   ├── qr-dialog.tsx      # QR code viewer & downloader
│   ├── sidebar.tsx        # Dashboard navigation sidebar
│   └── url-input.tsx      # Hero shortener widget
├── lib/
│   ├── api.ts             # Axios/fetch wrappers for Axum backend endpoints
│   ├── auth-context.tsx   # React context for JWT session management
│   └── utils.ts           # Classnames helper and link mapping utilities
├── bun.lock               # Bun lockfile
└── public/                # Static assets & icons
```

---

## Getting Started

### Prerequisites

- **Bun**: v1.0.0 or higher (recommended)

---

### Environment Setup

Create a `.env.local` file in the `frontend` root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

For production deployment, point `NEXT_PUBLIC_API_URL` to your live Axum backend URL.

---

### Installation & Development Server

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Start the development server**:

   ```bash
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## Production Build

To test or generate a production build:

```bash
bun run build
bun start
```

---

## Related Repositories / Backend

- **Backend Service**: Rust (Axum 0.8, SeaORM, PostgreSQL). Check the root [`README.md`](../README.md) for full project documentation and backend configuration.
