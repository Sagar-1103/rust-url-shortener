import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Ignore internal Next.js system routes or static assets if any reach here
  if (!code || code.startsWith("_") || code.includes(".")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL!;
  const backendBase = apiBase.replace(/\/api\/?$/, "");
  const targetRedirectUrl = `${backendBase}/${code}`;

  return NextResponse.redirect(targetRedirectUrl, 307);
}
