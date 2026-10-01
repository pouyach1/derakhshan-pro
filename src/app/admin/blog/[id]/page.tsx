import { redirect } from "next/navigation";
import BlogBackLink from "@/components/blog/admin/BlogBackLink";
import BlogForm from "@/components/blog/admin/BlogForm";
import { getBlogPostById } from "@/server/services/blog";
import { getSessionFromRequest } from "@/server/http/guard";
import { ApiError } from "@/server/http/response";

const BASE_PATH = "/admin/blog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogEditPage({ params }: PageProps) {
  const session = await getSessionFromRequest();
  if (!session || session.role !== "admin") {
    redirect(`/login?next=${encodeURIComponent(BASE_PATH)}`);
  }

  const { id } = await params;

  let post;
  try {
    post = await getBlogPostById(id, { session });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) throw error;
    return (
      <div className="space-y-4 font-vazirmatn" dir="rtl">
        <BlogBackLink href={BASE_PATH} />
        <h1 className="mt-4 text-2xl font-bold text-[#0B3A5C]">مقاله یافت نشد</h1>
        <p className="text-sm text-[#0B3A5C]/60">
          شناسه <span dir="ltr" className="font-mono">{id}</span> در پایگاه داده وجود ندارد.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      <div>
        <BlogBackLink href={BASE_PATH} />
        <h1 className="mt-4 font-vazirmatn text-2xl font-bold text-[#0B3A5C]">{post.title}</h1>
        <p className="mt-1 text-sm leading-7 text-[#0B3A5C]/60">ویرایش مقاله — ذخیره در پایگاه داده دفتر.</p>
      </div>
      <BlogForm mode="edit" basePath={BASE_PATH} initial={post} author={post.author} />
    </div>
  );
}
