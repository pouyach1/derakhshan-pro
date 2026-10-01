import Link from "next/link";
import BlogForm from "@/components/blog/admin/BlogForm";
import { getBlogPostById } from "@/data/blog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { id } = await params;
  const post = getBlogPostById(id);

  if (!post) {
    return (
      <div className="space-y-4 font-vazirmatn" dir="rtl">
        <h1 className="text-2xl font-bold text-admin-navy">مقاله یافت نشد</h1>
        <p className="text-sm text-slate-500">
          شناسه <span dir="ltr" className="font-mono">{id}</span> در دادهٔ آزمایشی وجود ندارد.
        </p>
        <Link href="/admin/blog" className="inline-flex text-sm font-semibold text-admin-sky">
          بازگشت به فهرست مجله
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      <div>
        <p className="text-sm text-slate-500">
          <Link href="/admin/blog" className="hover:text-admin-sky">
            مدیریت مجله
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          ویرایش
        </p>
        <h1 className="mt-2 text-2xl font-bold text-admin-navy">{post.title}</h1>
        <p className="mt-1 text-sm text-slate-500">فاز ۱ — فرم پرشده با دادهٔ آزمایشی، بدون ذخیره</p>
      </div>
      <BlogForm mode="edit" initial={post} />
    </div>
  );
}
