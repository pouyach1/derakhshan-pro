"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { compressImageFile, isAllowedImageFile } from "@/lib/image-compress";
import { cn } from "@/lib/utils";

type BlogImageUploadProps = {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  name?: string;
};

/** Cover image: file upload (JPG/PNG) + optional URL fallback. */
export default function BlogImageUpload({
  value = "",
  onChange,
  label = "تصویر اصلی",
  name = "coverImage",
}: BlogImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function commit(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  async function uploadFile(file: File) {
    setError(null);
    if (!isAllowedImageFile(file)) {
      setError("فقط JPG و PNG مجاز است");
      return;
    }
    setUploading(true);
    try {
      const blob = await compressImageFile(file);
      const form = new FormData();
      form.append("files", blob, file.name.replace(/\.\w+$/, "") + ".jpg");
      const res = await fetch("/api/uploads/blog", { method: "POST", body: form });
      const payload = await res.json();
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error?.message || "آپلود ناموفق بود");
      }
      const next = (payload.data?.url || payload.data?.urls?.[0] || "") as string;
      if (!next) throw new Error("آدرس تصویر برنگشت");
      commit(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "آپلود ناموفق بود");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2" dir="rtl">
      <label htmlFor={name} className="text-sm font-medium text-ws-text">
        {label}
      </label>

      <div className="rounded-[1.25rem] border border-dashed border-white/15 bg-ws-elevated px-4 py-5">
        <input type="hidden" name={name} value={url} />

        {url ? (
          <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-ws-surface">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={url}
                alt="پیش‌نمایش تصویر مقاله"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
                unoptimized={url.startsWith("/uploads/")}
              />
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:opacity-60",
            )}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            {url ? "تعویض عکس" : "آپلود عکس از دستگاه"}
          </button>
          {url ? (
            <button
              type="button"
              disabled={uploading}
              onClick={() => commit("")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-ws-muted transition hover:bg-white/10 hover:text-rose-300"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              حذف
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-ws-muted">
              <ImagePlus className="h-3.5 w-3.5" aria-hidden />
              JPG یا PNG
            </span>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadFile(file);
          }}
        />

        <div className="mt-4 space-y-1.5">
          <p className="text-xs text-ws-muted">یا آدرس تصویر را وارد کنید:</p>
          <input
            id={name}
            type="text"
            dir="ltr"
            value={url}
            placeholder="/uploads/blog/... یا https://..."
            onChange={(event) => commit(event.target.value)}
            className="h-11 w-full rounded-2xl border border-white/10 bg-ws-surface px-4 text-sm text-ws-text outline-none transition duration-200 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/15"
          />
        </div>

        {error ? (
          <p className="mt-2 text-xs text-rose-300" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-2 text-xs leading-6 text-ws-muted">
            عکس از دستگاه آپلود می‌شود و به‌صورت خودکار روی مقاله ذخیره می‌گردد.
          </p>
        )}
      </div>
    </div>
  );
}
