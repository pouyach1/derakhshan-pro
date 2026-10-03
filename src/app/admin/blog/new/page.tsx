import BlogBackLink from "@/components/blog/admin/BlogBackLink";
import BlogForm from "@/components/blog/admin/BlogForm";

const BASE_PATH = "/admin/blog";

export default function AdminBlogNewPage() {
  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      <div>
        <BlogBackLink href={BASE_PATH} />
        <h1 className="mt-4 font-vazirmatn text-2xl font-bold text-ws-text">مقاله جدید</h1>
        <p className="mt-1 text-sm leading-7 text-ws-muted">
          فرم حرفه‌ای ثبت مقاله برای مجله درخشان.
        </p>
      </div>
      <BlogForm
        mode="create"
        basePath={BASE_PATH}
        author={{ id: "admin-1", name: "تحریریه درخشان" }}
      />
    </div>
  );
}
