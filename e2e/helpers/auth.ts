import fs from "node:fs";
import path from "node:path";
import type { BrowserContext, Page } from "@playwright/test";
import { SignJWT } from "jose";

export type E2EMeta = {
  storePath: string;
  admin: { id: string; phone: string; email: string | null };
  agentA: { id: string; phone: string; email: string | null; agentId: string | null; name: string };
  agentB: { id: string; phone: string; email: string | null; agentId: string | null; name: string };
  clientA: { id: string; phone: string; name: string };
  clientB: { id: string; phone: string; name: string };
  propertyA: { id: string; title: string };
  propertyB: { id: string; title: string };
  clientRecordA: { id: string; name: string };
  blogA: { id: string; slug: string };
  draftBlog: { id: string; slug: string };
  password: string;
};

export function readE2EMeta(): E2EMeta {
  const file = path.join(process.cwd(), ".tmp", "e2e-meta.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as E2EMeta;
}

async function signToken(session: {
  id: string;
  phone: string;
  name: string;
  role: "admin" | "agent" | "client";
  agentId?: string | null;
  onboardingComplete?: boolean;
}) {
  const secret =
    process.env.AUTH_SECRET || "vitest-auth-secret-derakhshan-pro-32chars";
  return new SignJWT({
    id: session.id,
    phone: session.phone,
    name: session.name,
    role: session.role,
    agentId: session.agentId || undefined,
    onboardingComplete: session.onboardingComplete ?? true,
    clientProfile: null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .setSubject(session.id)
    .sign(new TextEncoder().encode(secret));
}

export async function loginAs(
  context: BrowserContext,
  session: {
    id: string;
    phone: string;
    name: string;
    role: "admin" | "agent" | "client";
    agentId?: string | null;
    onboardingComplete?: boolean;
  },
) {
  const token = await signToken(session);
  await context.addCookies([
    {
      name: "agency_auth",
      value: encodeURIComponent(token),
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

export async function apiAs(
  page: Page,
  url: string,
  init?: { method?: string; data?: unknown },
) {
  return page.request.fetch(url, {
    method: init?.method ?? (init?.data ? "POST" : "GET"),
    data: init?.data,
    headers: init?.data ? { "content-type": "application/json" } : undefined,
  });
}
