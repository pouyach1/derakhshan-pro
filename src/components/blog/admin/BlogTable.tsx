import type { BlogPost } from "@/types/blog";
import BlogTableRow from "@/components/blog/admin/BlogTableRow";

type BlogTableProps = {
  posts: BlogPost[];
};

export default function BlogTable({ posts }: BlogTableProps) {
  if (!posts.length) {
    return (
      <p className="rounded-2xl bg-admin-soft px-4 py-10 text-center text-sm text-slate-500">
        مقاله‌ای ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white" dir="rtl">
      <table className="min-w-full text-start">
        <thead className="bg-admin-soft text-xs font-semibold text-slate-500">
          <tr>
            <th className="px-3 py-3">عنوان</th>
            <th className="px-3 py-3">دسته</th>
            <th className="px-3 py-3">نویسنده</th>
            <th className="px-3 py-3">وضعیت</th>
            <th className="px-3 py-3">زمان مطالعه</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <BlogTableRow key={post.id} post={post} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
