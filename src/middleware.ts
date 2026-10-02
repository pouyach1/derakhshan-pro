import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  homeForRole,
  needsClientOnboarding,
  postAuthPath,
} from "@/lib/auth";
import { verifySessionToken } from "@/server/auth/session";

function isPublicPath(pathname: string) {
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/api/health")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/images")) return true;
  if (pathname.startsWith("/uploads")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  const session = await verifySessionToken(raw ? decodeURIComponent(raw) : null);

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  // Exact panel prefix — do not match public `/agents/[id]` profiles.
  const isAgentRoute = pathname === "/agent" || pathname.startsWith("/agent/");
  const isClientRoute = pathname === "/client" || pathname.startsWith("/client/");
  const isOnboarding = pathname.startsWith("/client/onboarding");
  const isClientSupport = pathname.startsWith("/client/support");
  const isLogin = pathname.startsWith("/login");

  // Whole-site gate: phone/email login required to enter and see prices.
  if (!session && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname === "/" ? "/" : pathname);
    return NextResponse.redirect(url);
  }

  if ((isAdminRoute || isAgentRoute || isClientRoute) && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Support chat stays reachable while the client finishes onboarding.
  if (
    isClientRoute &&
    session &&
    session.role === "client" &&
    !isOnboarding &&
    !isClientSupport &&
    needsClientOnboarding(session)
  ) {
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
    // Allow returning to public site after phone login (prices/listings).
    if (next && (next.startsWith("/") && !next.startsWith("//"))) {
      if (
        next.startsWith(homeForRole(session.role)) ||
        next === "/" ||
        next.startsWith("/listings") ||
        next.startsWith("/agents") ||
        next.startsWith("/contact") ||
        next.startsWith("/blog") ||
        next.startsWith("/services") ||
        next.startsWith("/meet-the-team") ||
        next.startsWith("/done-deals")
      ) {
        return NextResponse.redirect(new URL(next, request.url));
      }
    }
    // Clients who only need to browse prices go home first.
    if (session.role === "client" && !needsClientOnboarding(session)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
