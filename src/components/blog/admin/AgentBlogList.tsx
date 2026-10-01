"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlogPost } from "@/types/blog";
import { displayNameForSession, readClientSession } from "@/lib/auth";
import BlogManageHeader from "@/components/blog/admin/BlogManageHeader";
import BlogTable from "@/components/blog/admin/BlogTable";

type AgentBlogListProps = {
  allPosts: BlogPost[];
  basePath: string;
};

/**
 * Advisor blog list — filters mock posts by authenticated advisor name.
 * Future backend should filter by stable user/agent id.
 */
export default function AgentBlogList({ allPosts, basePath }: AgentBlogListProps) {
  const [authorName, setAuthorName] = useState<string | null>(null);

  useEffect(() => {
    const local = readClientSession();
    if (local) setAuthorName(displayNameForSession(local));
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then((payload) => {
        const session = payload?.data?.session;
        if (session) setAuthorName(displayNameForSession(session));
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  const posts = useMemo(() => {
    if (!authorName) return [];
    return allPosts.filter((post) => post.author.name.trim() === authorName.trim());
  }, [allPosts, authorName]);

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;

  return (
    <div className="space-y-6 font-vazirmatn" dir="rtl">
      <BlogManageHeader
        title="وبلاگ"
        subtitle={
          authorName
            ? `مقالات مرتبط با ${authorName}. ایجاد و ویرایش از پنل مشاور — ذخیرهٔ دائمی در فاز بک‌اند.`
            : "مقالات شما در مجله درخشان — در حال بارگذاری هویت مشاور…"
        }
        basePath={basePath}
        total={posts.length}
        published={published}
        drafts={drafts}
      />
      <BlogTable posts={posts} basePath={basePath} />
    </div>
  );
}
