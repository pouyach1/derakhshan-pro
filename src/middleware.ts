import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  homeForRole,
  needsClientOnboarding,
  postAuthPath,
} from "@/lib/auth";
import { verifySessionToken } from "@/server/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  const session = await verifySessionToken(raw ? decodeURIComponent(raw) : null);

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

  if (isClientRoute && session && session.role === "client" && !isOnboarding && needsClientOnboarding(session)) {
    return NextResponse.redirect(new URL("/client/onboarding", request.url));
  }

  // Strict role homes — never let staff land on the client portal.
  if (isAdminRoute && session && session.role !== "admin") {
    return NextResponse.redirect(new URL(postAuthPath(session), request.url));
  }

  if (isAgentRoute && session && session.role !== "agent") {
    return NextResponse.redirect(new URL(postAuthPath(session), request.url));
  }

  if (isClientRoute && session && session.role !== "client") {
    return NextResponse.redirect(new URL(postAuthPath(session), request.url));
  }

  if (isOnboarding && session && session.role === "client" && !needsClientOnboarding(session)) {
    return NextResponse.redirect(new URL("/client/dashboard", request.url));
  }

  if (isLogin && session) {
    const next = request.nextUrl.searchParams.get("next");
    const home = postAuthPath(session);
    if (next && next.startsWith(homeForRole(session.role))) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/client/:path*", "/login"],
};
