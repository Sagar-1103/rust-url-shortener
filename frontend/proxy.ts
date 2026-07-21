import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, system routes, home, dashboard and its sub-routes
  if (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Extract short code (e.g. /V1StGXR8 -> V1StGXR8)
  const code = pathname.slice(1);
  if (!code) {
    return NextResponse.next();
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL!;
  const backendBase = apiBase.replace(/\/api\/?$/, "");
  return NextResponse.redirect(`${backendBase}/${code}`, 307);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
