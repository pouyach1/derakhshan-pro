import BlogBackLink from "@/components/blog/admin/BlogBackLink";
import AgentBlogAuthorBridge from "@/components/blog/admin/AgentBlogAuthorBridge";

const BASE_PATH = "/agent/blog";

export default function AgentBlogNewPage() {
  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      <div>
        <BlogBackLink href={BASE_PATH} />
        <h1 className="mt-4 font-vazirmatn text-2xl font-bold text-ws-text">مقاله جدید</h1>
        <p className="mt-1 text-sm leading-7 text-ws-muted">
          مقاله با هویت مشاور واردشده در پایگاه داده دفتر ثبت می‌شود.
        </p>
      </div>
      <AgentBlogAuthorBridge mode="create" basePath={BASE_PATH} />
    </div>
  );
}
