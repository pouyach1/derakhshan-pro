import { NextResponse } from "next/server";
import { authCookieName, sessionCookieOptions } from "@/server/auth/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(authCookieName(), "", { ...sessionCookieOptions(0), maxAge: 0 });
  return response;
}
