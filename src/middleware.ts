import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, decodeSession, homeForRole } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  const session = decodeSession(raw ? decodeURIComponent(raw) : null);

  const isAdminRoute = pathname.startsWith("/admin");
  const isAgentRoute = pathname.startsWith("/agent");
  const isLogin = pathname.startsWith("/login");

  if ((isAdminRoute || isAgentRoute) && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && session && session.role !== "admin") {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  if (isAgentRoute && session && session.role !== "agent" && session.role !== "admin") {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/login"],
};
