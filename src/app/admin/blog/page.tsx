import { redirect } from "next/navigation";
import BlogManageHeader from "@/components/blog/admin/BlogManageHeader";
import BlogTable from "@/components/blog/admin/BlogTable";
import { getBlogStats, listBlogPosts } from "@/server/services/blog";
import { getSessionFromRequest } from "@/server/http/guard";

const BASE_PATH = "/admin/blog";

export default async function AdminBlogPage() {
  const session = await getSessionFromRequest();
  if (!session || session.role !== "admin") {
    redirect(`/login?next=${encodeURIComponent(BASE_PATH)}`);
  }

  const [{ items: posts }, stats] = await Promise.all([
    listBlogPosts(
      {
        page: 1,
        pageSize: 200,
        q: undefined,
        status: undefined,
        category: undefined,
        authorUserId: undefined,
      },
      { session },
    ),
    getBlogStats(session),
  ]);

  return (
    <div className="space-y-6 font-vazirmatn" dir="rtl">
      <BlogManageHeader
        title="وبلاگ"
        subtitle="مدیریت مجله املاک درخشان — ایجاد، ویرایش و انتشار مقالات تحریریه."
        basePath={BASE_PATH}
        total={stats.total}
        published={stats.published}
        drafts={stats.drafts}
      />
      <BlogTable posts={posts} basePath={BASE_PATH} />
    </div>
  );
}
