"use client";

import { useEffect, useState } from "react";
import type { BlogAuthor } from "@/types/blog";
import { displayNameForSession, readClientSession } from "@/lib/auth";
import BlogForm from "@/components/blog/admin/BlogForm";
import type { BlogPost } from "@/types/blog";

type AgentBlogAuthorBridgeProps = {
  mode: "create" | "edit";
  basePath: string;
  initial?: Partial<BlogPost>;
};

/**
 * Supplies authenticated advisor identity into BlogForm for create/edit.
 * Uses session name + agentId — ready for future DB author mapping.
 */
export default function AgentBlogAuthorBridge({
  mode,
  basePath,
  initial,
}: AgentBlogAuthorBridgeProps) {
  const [author, setAuthor] = useState<BlogAuthor | undefined>(initial?.author);

  useEffect(() => {
    const local = readClientSession();
    if (local) {
      setAuthor({
        id: local.agentId ? `agent-${local.agentId}` : `user-${local.id}`,
        name: displayNameForSession(local),
      });
    }
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then((payload) => {
        const session = payload?.data?.session;
        if (!session) return;
        setAuthor({
          id: session.agentId ? `agent-${session.agentId}` : `user-${session.id}`,
          name: displayNameForSession(session),
        });
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  return (
    <BlogForm
      mode={mode}
      basePath={basePath}
      initial={initial}
      author={mode === "create" ? author : initial?.author ?? author}
    />
  );
}
