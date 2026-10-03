import BlogBackLink from "@/components/blog/admin/BlogBackLink";
import AgentBlogAuthorBridge from "@/components/blog/admin/AgentBlogAuthorBridge";
import { getBlogPostById } from "@/server/services/blog";
import { requireSession } from "@/server/http/guard";
import { ApiError } from "@/server/http/response";

const BASE_PATH = "/agent/blog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgentBlogEditPage({ params }: PageProps) {
  const session = await requireSession(undefined, ["agent"]);
  const { id } = await params;

  let post;
  try {
    post = await getBlogPostById(id, { session });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      return (
        <div className="space-y-4 font-vazirmatn" dir="rtl">
          <BlogBackLink href={BASE_PATH} />
          <h1 className="mt-4 text-2xl font-bold text-ws-text">
            {error.status === 403 ? "دسترسی مجاز نیست" : "مقاله یافت نشد"}
          </h1>
          <p className="text-sm text-ws-muted">{error.message}</p>
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      <div>
        <BlogBackLink href={BASE_PATH} />
        <h1 className="mt-4 font-vazirmatn text-2xl font-bold text-ws-text">{post.title}</h1>
        <p className="mt-1 text-sm leading-7 text-ws-muted">ویرایش مقاله مشاور.</p>
      </div>
      <AgentBlogAuthorBridge mode="edit" basePath={BASE_PATH} initial={post} />
    </div>
  );
}
