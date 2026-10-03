import { describe, expect, it } from "vitest";
import {
  AUTH_COOKIE,
  clearClientSession,
  mirrorAuthSession,
  readClientSession,
  setClientSession,
} from "@/lib/client-session";

describe("client-session mirror — JWT cookie safety", () => {
  it("setClientSession writes mirror only, not a forged agency_auth cookie value", () => {
    document.cookie = `${AUTH_COOKIE}=should-not-remain; path=/`;
    setClientSession({
      id: "client-1",
      phone: "09120000000",
      name: "موکل",
      role: "client",
      onboardingComplete: true,
    });

    // Must not overwrite HttpOnly JWT with base64 session blob.
    expect(document.cookie).not.toMatch(new RegExp(`${AUTH_COOKIE}=ey`));
    expect(readClientSession()?.id).toBe("client-1");
    expect(sessionStorage.getItem("agency_auth_mirror")).toContain("client-1");
  });

  it("clearClientSession clears mirror and max-ages leftover non-HttpOnly cookie", () => {
    mirrorAuthSession({
      id: "client-1",
      phone: "09120000000",
      name: "موکل",
      role: "client",
    });
    clearClientSession();
    expect(sessionStorage.getItem("agency_auth_mirror")).toBeNull();
    expect(readClientSession()).toBeNull();
  });
});
