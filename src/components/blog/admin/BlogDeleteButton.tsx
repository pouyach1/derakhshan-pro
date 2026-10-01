"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type BlogDeleteButtonProps = {
  postId: string;
  title: string;
  className?: string;
};

/**
 * Destructive soft-delete with confirmation — server re-checks ownership.
 */
export default function BlogDeleteButton({
  postId,
  title,
  className,
}: BlogDeleteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmDelete() {
    setLoading(true);
    setError(null);
    const result = await api<{ id: string; deleted: true }>(`/api/blog/${postId}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error.message || "حذف ناموفق بود");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-rose-600 ring-1 ring-rose-200/80 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300",
          className,
        )}
        aria-label={`حذف مقاله ${title}`}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        حذف
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#0B3A5C]/25 p-4 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-delete-title"
        >
          <div className="w-full max-w-md rounded-[1.5rem] border border-sky-100/80 bg-white p-5 shadow-xl" dir="rtl">
            <h2 id="blog-delete-title" className="font-vazirmatn text-lg font-bold text-[#0B3A5C]">
              حذف مقاله؟
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#0B3A5C]/70">
              «{title}» برای حذف انتخاب شد. این عملیات مقاله را از فهرست مدیریت حذف می‌کند و از وبلاگ
              عمومی نیز ناپدید می‌شود.
            </p>
            {error ? (
              <p className="mt-3 text-sm text-rose-600" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#F3F7FB] px-4 py-2 text-sm font-semibold text-[#0B3A5C] transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:opacity-60"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => void confirmDelete()}
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
