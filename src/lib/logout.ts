import { clearClientSession } from "@/lib/auth";

type LogoutRouter = {
  replace: (href: string) => void;
  refresh: () => void;
};

/**
 * Clear local session and call logout API without throwing on network failures.
 * Always navigates to /login so a dead server never leaves the UI stuck.
 */
export async function performLogout(router: LogoutRouter, options?: { delayMs?: number }) {
  clearClientSession();
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
  } catch {
    /* ignore — cookie may already be gone / server restarting */
  }
  const delay = options?.delayMs ?? 0;
  if (delay > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, delay));
  }
  router.replace("/login");
  router.refresh();
}

/** Fire-and-forget wrapper for click handlers that also show a toast first. */
export function logoutSafely(
  router: LogoutRouter,
  options?: { delayMs?: number; onStart?: () => void },
) {
  options?.onStart?.();
  void performLogout(router, { delayMs: options?.delayMs ?? 450 }).catch(() => {
    try {
      router.replace("/login");
    } catch {
      window.location.href = "/login";
    }
  });
}
