# TrimIt: High-Performance URL Shortener & Analytics

**TrimIt** is a modern, high-performance URL shortener and link management platform built with Rust (Axum, SeaORM) and Next.js 16. It enables users to instantly convert long URLs into custom, trackable short links, generate QR codes, automatically fetch webpage metadata, and monitor detailed click analytics through an intuitive dashboard.

**Live Site:** [https://trimit-green.vercel.app](https://trimit-green.vercel.app) &nbsp;|&nbsp; **Demo Video:** [https://youtu.be/cRl7cxT2d8w](https://youtu.be/cRl7cxT2d8w)

## Application Preview

<div align="center">
  <video src="https://y8x88r93kn.ufs.sh/f/ykoVjJ0HJaODHwX2bK3DIL6skeD0jyCRzBOUc7Xla1v4rfHp" autoplay loop muted playsinline width="100%" style="border-radius: 8px;"></video>
  <br /><br />
  <a href="https://youtu.be/cRl7cxT2d8w" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/YouTube-Watch%20Demo%20Video-red?style=for-the-badge&logo=youtube" alt="Watch Demo Video on YouTube" />
  </a>
</div>

---

## Features

- **Instant Link Shortening**: Convert lengthy URLs into clean, shareable short links powered by NanoID collision-resistant generators.
- **Auto Metadata Scraping**: Asynchronously fetches and parses web page HTML titles and favicons on URL creation.
- **QR Code Generation**: Download high-resolution QR codes for any shortened link for offline and mobile sharing.
- **Click Analytics**: Monitor link engagement in real time with total click counters, link status, and top-performing URLs.
- **Link Management Dashboard**: Filter, search, edit target URLs, toggle archived state, and safely delete short links.
- **JWT & Argon2 Authentication**: Secure user accounts with stateless access/refresh tokens and state-of-the-art Argon2 password hashing.
- **Full-Stack Performance**: Powered by a lightweight, multi-threaded Rust Axum backend connected to PostgreSQL via SeaORM, paired with a Next.js 16 frontend.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, `tw-animate-css`
- **UI & Icons**: Lucide React, Base UI, Shadcn UI
- **Utilities**: `qrcode` for QR rendering, custom `AuthContext` for JWT lifecycle

### Backend & Database
- **Runtime & Web Framework**: Rust (Edition 2024), Axum 0.8 & Tokio
- **Database & ORM**: PostgreSQL with SeaORM 1.1 (Async SeaORM, SQLx Postgres)
- **Security & Auth**: JWT (`jsonwebtoken`) & Argon2 password hashing (`argon2`)
- **Metadata Scraping**: `reqwest` & `scraper` for async page parsing
- **Identifier Generation**: `nanoid` 0.5 for unique short keys

---

## Architecture

TrimIt is structured as a decoupled monorepo optimized for deployment on cloud platforms like Vercel and Render.

<div align="center">
  <img src="./frontend/public/trimit-architecture.png" alt="TrimIt Architecture" width="100%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
</div>

---

## Getting Started

Follow these instructions to set up and run TrimIt locally.

### Prerequisites

- **Rust**: v1.80+ (Cargo package manager)
- **Bun**: v1.0+ (recommended for frontend package management) or Node.js v18+
- **PostgreSQL**: Local PostgreSQL server or cloud-hosted instance (e.g. Neon, Supabase)

---

### 1. Repository Setup

Clone the repository:

```bash
git clone https://github.com/Sagar-1103/rust-url-shortner.git
cd rust-url-shortner
```

---

### 2. Environment Setup

#### Backend Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=3001
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DATABASE_URL=postgresql://username:password@localhost:5432/trimit_db
ACCESS_TOKEN_SECRET=your_super_secret_access_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
ACCESS_TOKEN_EXPIRY_HOURS=24
REFRESH_TOKEN_EXPIRY_DAYS=15
```

#### Frontend Configuration

Create a `.env.local` file inside the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

### 3. Database Migration

Run the database migrations using SeaORM CLI or Cargo:

```bash
cd backend/migration
cargo run
```

---

### 4. Running the Application

#### Start the Backend API

```bash
cd backend
cargo run
```
The Axum API server will start at `http://localhost:3001`.

#### Start the Frontend Web App

In a new terminal window:

```bash
cd frontend
bun install
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

- **Frontend**: Configured for Vercel deployment with root directory set to `frontend`.
- **Backend**: Can be deployed to Render, Railway, Fly.io, or AWS using standard Rust binaries.
- **Routing**: `vercel.json` proxies `/api/backend` and handles microservice rewrites automatically.

---

## License

This project is open-source under the [MIT License](LICENSE).
