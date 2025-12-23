import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  // Update session expiration if it exists
  const response = await updateSession(request);

  const session = request.cookies.get("session")?.value;
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response || NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
