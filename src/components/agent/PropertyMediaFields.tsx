"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  GripVertical,
  ImagePlus,
  Loader2,
  PlayCircle,
  Star,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { aparatEmbedUrl, isValidAparatUrl } from "@/lib/aparat";
import { compressImageFile, isAllowedImageFile, PROPERTY_IMAGE } from "@/lib/image-compress";
import { cn } from "@/lib/utils";

const MAX_VIDEOS = 3;

type Props = {
  images: string[];
  videos: string[];
  onImagesChange: (urls: string[]) => void;
  onVideosChange: (urls: string[]) => void;
  error?: string;
};

export default function PropertyMediaFields({
  images,
  videos,
  onImagesChange,
  onVideosChange,
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function uploadFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    if (!incoming.length) return;

    setLocalError("");
    const remaining = PROPERTY_IMAGE.maxCount - images.length;
    if (remaining <= 0) {
      setLocalError(`حداکثر ${PROPERTY_IMAGE.maxCount} عکس مجاز است`);
      return;
    }

    const picked = incoming.slice(0, remaining);
    const invalid = picked.find((f) => !isAllowedImageFile(f));
    if (invalid) {
      setLocalError("فقط JPG و PNG مجاز است");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      for (const file of picked) {
        const blob = await compressImageFile(file);
        form.append("files", blob, file.name.replace(/\.\w+$/, "") + ".jpg");
      }
      const res = await fetch("/api/uploads/images", {
        method: "POST",
        body: form,
      });
      const payload = await res.json();
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error?.message || "آپلود ناموفق بود");
      }
      const urls = (payload.data?.urls ?? []) as string[];
      onImagesChange([...images, ...urls].slice(0, PROPERTY_IMAGE.maxCount));
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "آپلود ناموفق بود");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  function makeCover(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onImagesChange(next);
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onImagesChange(next);
  }

  function setVideoAt(index: number, value: string) {
    const next = [...videos];
    next[index] = value;
    onVideosChange(next);
  }

  function addVideoSlot() {
    if (videos.length >= MAX_VIDEOS) return;
    onVideosChange([...videos, ""]);
  }

  function removeVideo(index: number) {
    onVideosChange(videos.filter((_, i) => i !== index));
  }

  const message = localError || error;

  return (
    <div className="space-y-8 font-vazirmatn" dir="rtl">
      {/* Photos */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#0B3A5C]">عکس‌های ملک</h3>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              حداقل ۱ و حداکثر {PROPERTY_IMAGE.maxCount.toLocaleString("fa-IR")} عکس · فقط JPG و PNG ·
              خودکار بهینه می‌شود تا سایت سنگین نشود
            </p>
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            {images.length.toLocaleString("fa-IR")} / {PROPERTY_IMAGE.maxCount.toLocaleString("fa-IR")}
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void uploadFiles(e.dataTransfer.files);
          }}
          className={cn(
            "relative overflow-hidden rounded-[1.5rem] border-2 border-dashed px-4 py-8 text-center transition",
            dragOver
              ? "border-sky-400 bg-sky-50"
              : "border-slate-200 bg-[#F3F7FB] hover:border-sky-300 hover:bg-sky-50/50",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={PROPERTY_IMAGE.accept}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) void uploadFiles(e.target.files);
            }}
          />
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm ring-1 ring-sky-100">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-[#0B3A5C]">
            {uploading ? "در حال آپلود و بهینه‌سازی..." : "عکس را بکشید اینجا یا انتخاب کنید"}
          </p>
          <p className="mt-1 text-xs text-slate-500">JPG · PNG</p>
          <button
            type="button"
            disabled={uploading || images.length >= PROPERTY_IMAGE.maxCount}
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            <ImagePlus className="h-4 w-4" />
            انتخاب عکس
          </button>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E8F1F8] ring-1 ring-slate-200"
              >
                <Image src={url} alt="" fill className="object-cover" sizes="240px" />
                {index === 0 ? (
                  <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-1 text-[10px] font-bold text-white">
                    <Star className="h-3 w-3" />
                    کاور
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-[#0B3A5C]/85 to-transparent p-2 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="rounded-lg bg-white/90 p-1.5 text-[#0B3A5C]"
                      aria-label="جابه‌جایی"
                      title="بالا"
                    >
                      <GripVertical className="h-3.5 w-3.5" />
                    </button>
                    {index !== 0 ? (
                      <button
                        type="button"
                        onClick={() => makeCover(index)}
                        className="rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-[#0B3A5C]"
                      >
                        کاور
                      </button>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-lg bg-white/90 p-1.5 text-rose-600"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
            حداقل یک عکس کاور لازم است.
          </p>
        )}
      </section>

      {/* Aparat videos */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="inline-flex items-center gap-2 text-base font-bold text-[#0B3A5C]">
              <Video className="h-4 w-4 text-sky-600" />
              ویدیوی ملک (آپارات)
            </h3>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              اختیاری · حداکثر {MAX_VIDEOS.toLocaleString("fa-IR")} ویدیو · لینک آپارات بگذارید تا
              بدون سنگین کردن سایت پخش شود
            </p>
          </div>
          <span className="rounded-full bg-[#F3F7FB] px-3 py-1 text-xs font-semibold text-slate-600">
            {videos.filter(Boolean).length.toLocaleString("fa-IR")} /{" "}
            {MAX_VIDEOS.toLocaleString("fa-IR")}
          </span>
        </div>

        <div className="space-y-3">
          {videos.map((value, index) => {
            const embed = value.trim() ? aparatEmbedUrl(value) : null;
            const valid = !value.trim() || isValidAparatUrl(value);
            return (
              <div
                key={`video-${index}`}
                className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white"
              >
                <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
                  <PlayCircle className="h-4 w-4 text-sky-500" />
                  <span className="text-xs font-semibold text-[#0B3A5C]">
                    ویدیو {(index + 1).toLocaleString("fa-IR")}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="ms-auto rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="حذف ویدیو"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3 p-3">
                  <input
                    value={value}
                    onChange={(e) => setVideoAt(index, e.target.value)}
                    placeholder="https://www.aparat.com/v/..."
                    dir="ltr"
                    className={cn(
                      "h-11 w-full rounded-xl border bg-[#F3F7FB] px-3 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/20",
                      valid ? "border-slate-200" : "border-rose-300",
                    )}
                  />
                  {!valid ? (
                    <p className="text-[11px] text-rose-600">لینک آپارات معتبر نیست</p>
                  ) : null}
                  {embed ? (
                    <div className="overflow-hidden rounded-xl bg-slate-900 aspect-video">
                      <iframe
                        src={embed}
                        title={`ویدیو آپارات ${index + 1}`}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-xl bg-[#F3F7FB] text-xs text-slate-400">
                      پیش‌نمایش بعد از وارد کردن لینک آپارات
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {videos.length < MAX_VIDEOS ? (
          <button
            type="button"
            onClick={addVideoSlot}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#0B3A5C] transition hover:border-sky-300 hover:bg-sky-50"
          >
            <Video className="h-4 w-4 text-sky-600" />
            افزودن لینک آپارات
          </button>
        ) : null}
      </section>

      {message ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{message}</p>
      ) : null}
    </div>
  );
}
