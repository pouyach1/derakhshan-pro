"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2 } from "lucide-react";
import type { BlogAuthor, BlogPost, BlogStatus } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/data/blog-categories";
import { api } from "@/lib/api";
import { slugFromTitle } from "@/lib/blog/slug";
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

type SaveState = "idle" | "saving" | "success" | "error";

/**
 * Professional article editor — persists via /api/blog against AgencyStore.
 */
export default function BlogForm({
  initial,
  mode = "create",
  basePath,
  author,
}: BlogFormProps) {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [status, setStatus] = useState<BlogStatus>(initial?.status ?? "draft");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [dirty, setDirty] = useState(false);
  const resolvedAuthor = author ?? initial?.author;
  const canPreview =
    (mode === "edit" && status === "published" && (slug || initial?.slug)) ||
    (status === "published" && Boolean(slug));

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  async function persist(nextStatus: BlogStatus, form: HTMLFormElement) {
    setSaveState("saving");
    setError(null);
    setNotice(null);

    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const content = String(data.get("content") ?? "").trim();
    const excerpt = String(data.get("excerpt") ?? "").trim();
    const category = String(data.get("category") ?? BLOG_CATEGORIES[0]).trim();
    const coverImage = String(data.get("coverImage") ?? "").trim();
    const readingTimeRaw = Number(data.get("readingTime"));
    const nextSlug = (slug || slugFromTitle(title)).trim();

    const payload = {
      title,
      slug: nextSlug,
      excerpt,
      content,
      category,
      coverImage,
      status: nextStatus,
      readingTime:
        Number.isFinite(readingTimeRaw) && readingTimeRaw > 0
          ? readingTimeRaw
          : undefined,
      authorUserId: resolvedAuthor?.id,
    };

    const result =
      mode === "edit" && initial?.id
        ? await api<BlogPost>(`/api/blog/${initial.id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          })
        : await api<BlogPost>("/api/blog", {
            method: "POST",
            body: JSON.stringify(payload),
          });

    if (!result.ok) {
      setSaveState("error");
      setError(result.error.message || "ذخیره ناموفق بود");
      return;
    }

    setStatus(result.data.status);
    setSlug(result.data.slug);
    setDirty(false);
    setSaveState("success");
    setNotice(
      result.data.status === "published"
        ? "مقاله با موفقیت منتشر شد."
        : "پیش‌نویس با موفقیت ذخیره شد.",
    );

    if (mode === "create") {
      router.replace(`${basePath}/${result.data.id}`);
      router.refresh();
      return;
    }
    router.refresh();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void persist("draft", event.currentTarget);
  }

  return (
    <form
      className="space-y-5 rounded-[1.5rem] border border-white/10 bg-ws-surface p-5 shadow-[0_20px_50px_-36px_rgba(0,0,0,0.55)] md:p-7"
      dir="rtl"
      onSubmit={handleSubmit}
      onChange={() => {
        setDirty(true);
        if (saveState === "success") setSaveState("idle");
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-400">
            {mode === "edit" ? "EDIT ARTICLE" : "NEW ARTICLE"}
          </p>
          <p className="mt-1 text-sm text-ws-muted">
            ویرایشگر مجله درخشان — ذخیره در پایگاه داده دفتر
          </p>
        </div>
        <BlogStatusBadge status={status} />
      </div>

      {notice ? (
        <div
          className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm leading-7 text-emerald-100"
          role="status"
        >
          {notice}
        </div>
      ) : null}

      {error ? (
        <div
          className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm leading-7 text-rose-100"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-ws-text">عنوان</span>
          <input
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            className={fieldClass}
            onChange={(event) => {
              if (!slugTouched) setSlug(slugFromTitle(event.target.value));
            }}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ws-text">اسلاگ</span>
          <input
            name="slug"
            required
            value={slug}
            dir="ltr"
            className={fieldClass}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
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
          disabled={saveState === "saving"}
          className="inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:opacity-60"
        >
          {saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          ذخیره پیش‌نویس
        </button>
        <button
          type="button"
          disabled={saveState === "saving"}
          onClick={(event) => {
            const form = event.currentTarget.closest("form");
            if (form) void persist("published", form);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:opacity-60"
        >
          انتشار
        </button>
        {canPreview ? (
          <Link
            href={`/blog/${slug || initial?.slug}`}
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
