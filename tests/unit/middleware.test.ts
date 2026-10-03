import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { middleware } from "@/middleware";
import { AUTH_COOKIE } from "@/lib/auth";

const SECRET = process.env.AUTH_SECRET || "vitest-auth-secret-derakhshan-pro-32chars";

async function token(session: {
  id: string;
  phone: string;
  name: string;
  role: "admin" | "agent" | "client";
  agentId?: string;
  onboardingComplete?: boolean;
}, ttl = "1h") {
  return new SignJWT({
    id: session.id,
    phone: session.phone,
    name: session.name,
    role: session.role,
    agentId: session.agentId,
    onboardingComplete: session.onboardingComplete ?? true,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .setSubject(session.id)
    .sign(new TextEncoder().encode(SECRET));
}

function request(path: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(new URL(path, "http://localhost:3010"), { headers });
}

function location(response: Response) {
  return response.headers.get("location") || "";
}

describe("middleware — route role gates", () => {
  it("allows anonymous access to public marketing routes", async () => {
    for (const path of ["/", "/listings", "/blog", "/contact", "/services"]) {
      const response = await middleware(request(path));
      expect(response.status, `${path} must stay public`).toBeLessThan(300);
      expect(location(response)).not.toContain("/login");
    }
  });

  it("redirects anonymous private panels to login with next=", async () => {
    for (const path of ["/admin/dashboard", "/agent/dashboard", "/client/dashboard"]) {
      const response = await middleware(request(path));
      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(location(response)).toContain("/login");
      expect(location(response)).toContain(`next=${encodeURIComponent(path)}`);
    }
  });

  it("does not treat /agents/[id] as the agent panel", async () => {
    const response = await middleware(request("/agents/a-test-a"));
    expect(location(response)).not.toContain("/login");
  });

  it("admin session may open admin and is redirected away from agent panel", async () => {
    const jwt = await token({
      id: "admin-1",
      phone: "09121111111",
      name: "مدیر",
      role: "admin",
    });
    const cookie = `${AUTH_COOKIE}=${encodeURIComponent(jwt)}`;
    const adminOk = await middleware(request("/admin/dashboard", cookie));
    expect(location(adminOk) || "").not.toContain("/login");

    const agentDenied = await middleware(request("/agent/dashboard", cookie));
    expect(location(agentDenied)).toMatch(/\/admin|\/$/);
  });

  it("agent session may open agent and is redirected away from admin", async () => {
    const jwt = await token({
      id: "agent-a",
      phone: "09120000001",
      name: "مشاور",
      role: "agent",
      agentId: "a-test-a",
    });
    const cookie = `${AUTH_COOKIE}=${encodeURIComponent(jwt)}`;
    const agentOk = await middleware(request("/agent/clients", cookie));
    expect(location(agentOk) || "").not.toContain("/login");

    const adminDenied = await middleware(request("/admin/dashboard", cookie));
    expect(location(adminDenied)).toContain("/agent");
  });

  it("client incomplete onboarding is forced to /client/onboarding", async () => {
    const jwt = await token({
      id: "client-a",
      phone: "09120000011",
      name: "موکل",
      role: "client",
      onboardingComplete: false,
    });
    const cookie = `${AUTH_COOKIE}=${encodeURIComponent(jwt)}`;
    const response = await middleware(request("/client/dashboard", cookie));
    expect(location(response)).toContain("/client/onboarding");
  });

  it("client support remains reachable during incomplete onboarding", async () => {
    const jwt = await token({
      id: "client-a",
      phone: "09120000011",
      name: "موکل",
      role: "client",
      onboardingComplete: false,
    });
    const cookie = `${AUTH_COOKIE}=${encodeURIComponent(jwt)}`;
    const response = await middleware(request("/client/support", cookie));
    expect(location(response) || "").not.toContain("/client/onboarding");
  });

  it("invalid JWT is treated as anonymous on private routes", async () => {
    const cookie = `${AUTH_COOKIE}=not-a-valid-jwt`;
    const response = await middleware(request("/admin/dashboard", cookie));
    expect(location(response)).toContain("/login");
  });

  it("expired JWT is treated as anonymous", async () => {
    const jwt = await new SignJWT({
      id: "agent-a",
      phone: "09120000001",
      name: "مشاور",
      role: "agent",
      agentId: "a-test-a",
      onboardingComplete: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 120)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .setSubject("agent-a")
      .sign(new TextEncoder().encode(SECRET));
    const cookie = `${AUTH_COOKIE}=${encodeURIComponent(jwt)}`;
    const response = await middleware(request("/agent/dashboard", cookie));
    expect(location(response)).toContain("/login");
  });

  it("authenticated user hitting /login is redirected to role home", async () => {
    const jwt = await token({
      id: "agent-a",
      phone: "09120000001",
      name: "مشاور",
      role: "agent",
      agentId: "a-test-a",
    });
    const cookie = `${AUTH_COOKIE}=${encodeURIComponent(jwt)}`;
    const response = await middleware(request("/login", cookie));
    expect(location(response)).toContain("/agent");
  });
});
