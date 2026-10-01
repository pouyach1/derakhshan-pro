"use client";

import { useEffect, useState } from "react";
import type { BlogAuthor, BlogPost } from "@/types/blog";
import { displayNameForSession, readClientSession } from "@/lib/auth";
import BlogForm from "@/components/blog/admin/BlogForm";

type AgentBlogAuthorBridgeProps = {
  mode: "create" | "edit";
  basePath: string;
  initial?: Partial<BlogPost>;
};

/**
 * Supplies authenticated advisor identity (stable user id) into BlogForm.
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
        id: local.id,
        name: displayNameForSession(local),
      });
    }
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then((payload) => {
        const session = payload?.data?.session;
        if (!session) return;
        setAuthor({
          id: session.id,
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
