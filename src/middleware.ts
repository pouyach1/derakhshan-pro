import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  decodeSession,
  homeForRole,
  needsClientOnboarding,
  postAuthPath,
} from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  const session = decodeSession(raw ? decodeURIComponent(raw) : null);

  const isAdminRoute = pathname.startsWith("/admin");
  const isAgentRoute = pathname.startsWith("/agent");
  const isClientRoute = pathname.startsWith("/client");
  const isOnboarding = pathname.startsWith("/client/onboarding");
  const isLogin = pathname.startsWith("/login");

  if ((isAdminRoute || isAgentRoute || isClientRoute) && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && session && session.role !== "admin") {
    return NextResponse.redirect(new URL(postAuthPath(session), request.url));
  }

  if (isAgentRoute && session && session.role !== "agent" && session.role !== "admin") {
    return NextResponse.redirect(new URL(postAuthPath(session), request.url));
  }

  if (isClientRoute && session && session.role !== "client") {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  if (isOnboarding && session && session.role === "client" && !needsClientOnboarding(session)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL(postAuthPath(session), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/client/:path*", "/login"],
};
