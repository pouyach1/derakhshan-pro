import BlogManageHeader from "@/components/blog/admin/BlogManageHeader";
import BlogTable from "@/components/blog/admin/BlogTable";
import { getBlogPosts } from "@/data/blog";

const BASE_PATH = "/admin/blog";

export default function AdminBlogPage() {
  const posts = getBlogPosts();
  const published = posts.filter((post) => post.status === "published").length;
  const drafts = posts.length - published;

  return (
    <div className="space-y-6 font-vazirmatn" dir="rtl">
      <BlogManageHeader
        title="وبلاگ"
        subtitle="مدیریت مجله املاک درخشان — ایجاد، ویرایش و انتشار مقالات تحریریه."
        basePath={BASE_PATH}
        total={posts.length}
        published={published}
        drafts={drafts}
      />
      <BlogTable posts={posts} basePath={BASE_PATH} />
    </div>
  );
}
