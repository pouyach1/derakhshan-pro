import { redirect } from "next/navigation";
import BlogBackLink from "@/components/blog/admin/BlogBackLink";
import AgentBlogAuthorBridge from "@/components/blog/admin/AgentBlogAuthorBridge";
import { getBlogPostById } from "@/server/services/blog";
import { getSessionFromRequest } from "@/server/http/guard";
import { ApiError } from "@/server/http/response";

const BASE_PATH = "/agent/blog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgentBlogEditPage({ params }: PageProps) {
  const session = await getSessionFromRequest();
  if (!session || session.role !== "agent") {
    redirect(`/login?next=${encodeURIComponent(BASE_PATH)}`);
  }

  const { id } = await params;

  let post;
  try {
    post = await getBlogPostById(id, { session });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      return (
        <div className="space-y-4 font-vazirmatn" dir="rtl">
          <BlogBackLink href={BASE_PATH} />
          <h1 className="mt-4 text-2xl font-bold text-[#0B3A5C]">
            {error.status === 403 ? "دسترسی مجاز نیست" : "مقاله یافت نشد"}
          </h1>
          <p className="text-sm text-[#0B3A5C]/60">{error.message}</p>
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      <div>
        <BlogBackLink href={BASE_PATH} />
        <h1 className="mt-4 font-vazirmatn text-2xl font-bold text-[#0B3A5C]">{post.title}</h1>
        <p className="mt-1 text-sm leading-7 text-[#0B3A5C]/60">ویرایش مقاله مشاور.</p>
      </div>
      <AgentBlogAuthorBridge mode="edit" basePath={BASE_PATH} initial={post} />
    </div>
  );
}
