"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import AgentVisitManager from "@/components/agent/visits/AgentVisitManager";
import {
  ROLE_LABELS,
  displayNameForSession,
  readClientSession,
  type AuthSession,
} from "@/lib/auth";
import { api } from "@/lib/api";

/**
 * Agent profile hub — visit management lives here (opened from account menu).
 */
export default function AgentProfilePage() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(readClientSession());
    void api<{ session: AuthSession }>("/api/auth/me").then((res) => {
      if (res.ok) setSession(res.data.session);
    });
  }, []);

  const name = session ? displayNameForSession(session) : "مشاور";
  const roleLabel = session ? ROLE_LABELS[session.role] : "مشاور";

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur-md sm:rounded-[1.75rem] sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-700 ring-1 ring-sky-400/25">
            <UserRound className="h-5 w-5" strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-slate-900">{name}</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {roleLabel}
              {session?.phone ? (
                <span className="ms-2 tabular-nums" dir="ltr">
                  · {session.phone}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </section>

      <AgentVisitManager embedded />
    </div>
  );
}
