"use client";

import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { fallbackImage } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { PropertyAgentSummary } from "@/server/services/agents-public";

type AgentProfileLinkProps = {
  agent: PropertyAgentSummary | null | undefined;
  className?: string;
  tone?: "light" | "dark" | "onMedia";
  showTitle?: boolean;
};

/** Clickable consultant name → public resume/profile. */
export default function AgentProfileLink({
  agent,
  className,
  tone = "light",
  showTitle = true,
}: AgentProfileLinkProps) {
  if (!agent) return null;

  return (
    <Link
      href={`/agents/${agent.id}`}
      className={cn(
        "group inline-flex min-w-0 items-center gap-2 rounded-full transition",
        tone === "light" && "bg-[#F3F7FB] px-2.5 py-1.5 ring-1 ring-[#0B3A5C]/10 hover:bg-sky-50 hover:ring-sky-300/50",
        tone === "dark" && "bg-white/10 px-2.5 py-1.5 ring-1 ring-white/20 hover:bg-white/15",
        tone === "onMedia" && "bg-black/45 px-2.5 py-1.5 ring-1 ring-white/25 backdrop-blur-md hover:bg-black/55",
        className,
      )}
    >
      <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-sky-100">
        {agent.avatarUrl ? (
          <Image
            src={fallbackImage(agent.avatarUrl)}
            alt=""
            fill
            className="object-cover"
            sizes="28px"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sky-700">
            <UserRound className="h-3.5 w-3.5" />
          </span>
        )}
      </span>
      <span className="min-w-0 text-start">
        <span
          className={cn(
            "block truncate text-xs font-bold",
            tone === "light" ? "text-[#0B3A5C] group-hover:text-sky-800" : "text-white",
          )}
        >
          {agent.name}
        </span>
        {showTitle ? (
          <span
            className={cn(
              "block truncate text-[10px]",
              tone === "light" ? "text-[#0B3A5C]/55" : "text-white/75",
            )}
          >
            {agent.title}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
