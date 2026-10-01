import Link from "next/link";
import BlogForm from "@/components/blog/admin/BlogForm";

export default function AdminBlogNewPage() {
  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      <div>
        <p className="text-sm text-slate-500">
          <Link href="/admin/blog" className="hover:text-admin-sky">
            مدیریت مجله
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          مقاله جدید
        </p>
        <h1 className="mt-2 text-2xl font-bold text-admin-navy">ثبت مقاله جدید</h1>
        <p className="mt-1 text-sm text-slate-500">فاز ۱ — فرم ساختاری بدون ذخیره</p>
      </div>
      <BlogForm mode="create" />
    </div>
  );
}
