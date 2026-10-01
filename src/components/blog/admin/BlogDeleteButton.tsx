"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogDeleteButtonProps = {
  title: string;
  className?: string;
};

/**
 * Destructive action with confirmation.
 * Mock phase: does not permanently delete — persistence comes later.
 */
export default function BlogDeleteButton({ title, className }: BlogDeleteButtonProps) {
  const [open, setOpen] = useState(false);

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
              «{title}» برای حذف انتخاب شد. حذف دائمی پس از اتصال پایگاه‌داده فعال می‌شود و در این فاز
              دادهٔ آزمایشی تغییر نمی‌کند.
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#F3F7FB] px-4 py-2 text-sm font-semibold text-[#0B3A5C] transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
