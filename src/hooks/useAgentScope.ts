"use client";

import { useMemo } from "react";
import { readClientSession } from "@/lib/auth";

/**
 * Resolve the signed-in agent's id for strict CRM isolation.
 * Falls back to demo agent `a1` when no session is present (local preview).
 */
export function useAgentScope(): string {
  return useMemo(() => {
    const session = readClientSession();
    if (session?.role === "agent" && session.agentId) {
      return session.agentId;
    }
    return "a1";
  }, []);
}
