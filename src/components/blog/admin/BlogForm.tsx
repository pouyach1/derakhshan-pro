"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { BlogAuthor, BlogPost, BlogStatus } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/data/blog";
import BlogImageUpload from "@/components/blog/admin/BlogImageUpload";
import BlogStatusBadge from "@/components/blog/admin/BlogStatusBadge";
import BlogRichTextArea from "@/components/blog/admin/BlogRichTextArea";

type BlogFormProps = {
  initial?: Partial<BlogPost>;
  mode?: "create" | "edit";
  /** Management root for cancel / back targets */
  basePath: string;
  /** Author identity from authenticated session (agent) or initial post */
  author?: BlogAuthor;
};

const fieldClass =
  "h-11 w-full rounded-2xl border border-white/10 bg-ws-elevated px-4 text-sm text-ws-text outline-none transition duration-200 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/15";

/**
 * Professional article editor shell — dark-workspace friendly + rich toolbar.
 */
export default function BlogForm({
  initial,
  mode = "create",
  basePath,
  author,
}: BlogFormProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const [status, setStatus] = useState<BlogStatus>(initial?.status ?? "draft");
  const resolvedAuthor = author ?? initial?.author;
  const canPreview = mode === "edit" && initial?.status === "published" && initial?.slug;

  function notifyPersistence(nextStatus: BlogStatus) {
    setStatus(nextStatus);
    setNotice(
      nextStatus === "published"
        ? "انتشار واقعی پس از اتصال پایگاه‌داده فعال می‌شود. فرم برای یکپارچه‌سازی بعدی آماده است."
        : "ذخیرهٔ پیش‌نویس پس از اتصال پایگاه‌داده فعال می‌شود. تغییرات در این فاز ماندگار نیستند.",
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notifyPersistence("draft");
  }

  return (
    <form
      className="space-y-5 rounded-[1.5rem] border border-white/10 bg-ws-surface p-5 shadow-[0_20px_50px_-36px_rgba(0,0,0,0.55)] md:p-7"
      dir="rtl"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-400">
            {mode === "edit" ? "EDIT ARTICLE" : "NEW ARTICLE"}
          </p>
          <p className="mt-1 text-sm text-ws-muted">
            ویرایشگر مجله درخشان — ذخیرهٔ دائمی در فاز بک‌اند
          </p>
        </div>
        <BlogStatusBadge status={status} />
      </div>

      {notice ? (
        <div
          className="rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm leading-7 text-amber-100"
          role="status"
        >
          {notice}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-ws-text">عنوان</span>
          <input name="title" required defaultValue={initial?.title ?? ""} className={fieldClass} />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ws-text">اسلاگ</span>
          <input
            name="slug"
            required
            defaultValue={initial?.slug ?? ""}
            dir="ltr"
            className={fieldClass}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ws-text">دسته‌بندی</span>
          <select
            name="category"
            defaultValue={initial?.category ?? BLOG_CATEGORIES[0]}
            className={fieldClass}
          >
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ws-text">وضعیت</span>
          <select
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as BlogStatus)}
            className={fieldClass}
          >
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشر شده</option>
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ws-text">زمان مطالعه (دقیقه)</span>
          <input
            name="readingTime"
            type="number"
            min={1}
            defaultValue={initial?.readingTime ?? 5}
            className={fieldClass}
          />
        </label>

        <div className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-ws-text">نویسنده</span>
          <div className="flex h-11 items-center rounded-2xl border border-white/10 bg-ws-elevated px-4 text-sm text-ws-muted">
            {resolvedAuthor?.name ?? "—"}
          </div>
          {resolvedAuthor ? (
            <input type="hidden" name="authorId" value={resolvedAuthor.id} />
          ) : null}
        </div>

        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-ws-text">خلاصه</span>
          <textarea
            name="excerpt"
            rows={3}
            defaultValue={initial?.excerpt ?? ""}
            className="w-full rounded-2xl border border-white/10 bg-ws-elevated px-4 py-3 text-sm leading-7 text-ws-text outline-none transition duration-200 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/15"
          />
        </label>

        <BlogRichTextArea defaultValue={initial?.content ?? ""} />
      </div>

      <BlogImageUpload value={initial?.coverImage} />

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
        <button
          type="submit"
          className="rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
        >
          ذخیره پیش‌نویس
        </button>
        <button
          type="button"
          onClick={() => notifyPersistence("published")}
          className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
        >
          انتشار
        </button>
        {canPreview ? (
          <Link
            href={`/blog/${initial.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-ws-text transition duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
          >
            <Eye className="h-4 w-4" aria-hidden />
            پیش‌نمایش
          </Link>
        ) : null}
        <Link
          href={basePath}
          className="rounded-full px-4 py-2.5 text-sm font-semibold text-ws-muted transition hover:text-sky-300"
        >
          انصراف
        </Link>
      </div>
    </form>
  );
}
