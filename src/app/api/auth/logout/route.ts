import { NextResponse } from "next/server";
import { authCookieName, sessionCookieOptions } from "@/server/auth/session";
import { jsonOk } from "@/server/http/response";

export async function POST() {
  const response = jsonOk({ loggedOut: true });
  response.cookies.set(authCookieName(), "", { ...sessionCookieOptions(0), maxAge: 0 });
  return response;
}

export async function GET() {
  return POST();
}
