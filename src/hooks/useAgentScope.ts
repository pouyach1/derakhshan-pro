"use client";

import { useEffect, useState } from "react";
import { readClientSession } from "@/lib/auth";
import { api } from "@/lib/api";

/**
 * Resolve the signed-in agent's id for CRM isolation.
 */
export function useAgentScope(): string {
  const [agentId, setAgentId] = useState(() => readClientSession()?.agentId || "a1");

  useEffect(() => {
    void (async () => {
      const res = await api<{ session: { agentId?: string } }>("/api/auth/me");
      if (res.ok && res.data.session.agentId) {
        setAgentId(res.data.session.agentId);
        return;
      }
      const local = readClientSession();
      if (local?.agentId) setAgentId(local.agentId);
    })();
  }, []);

  return agentId;
}
