import { redirect } from "next/navigation";
import BlogManageHeader from "@/components/blog/admin/BlogManageHeader";
import BlogTable from "@/components/blog/admin/BlogTable";
import { getBlogStats, listBlogPosts } from "@/server/services/blog";
import { getSessionFromRequest } from "@/server/http/guard";

const BASE_PATH = "/agent/blog";

export default async function AgentBlogPage() {
  const session = await getSessionFromRequest();
  if (!session || session.role !== "agent") {
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
        subtitle={`مقالات مرتبط با ${session.name}. ایجاد و ویرایش از پنل مشاور.`}
        basePath={BASE_PATH}
        total={stats.total}
        published={stats.published}
        drafts={stats.drafts}
      />
      <BlogTable posts={posts} basePath={BASE_PATH} />
    </div>
  );
}
