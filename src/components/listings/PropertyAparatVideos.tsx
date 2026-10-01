"use client";

import { PlayCircle } from "lucide-react";
import { aparatEmbedUrl, aparatWatchUrl } from "@/lib/aparat";

type Props = {
  videos?: string[] | null;
  className?: string;
  compact?: boolean;
};

export default function PropertyAparatVideos({ videos, className, compact }: Props) {
  const embeds = (videos ?? [])
    .map((raw) => {
      const embed = aparatEmbedUrl(raw);
      const watch = aparatWatchUrl(raw);
      if (!embed || !watch) return null;
      return { embed, watch };
    })
    .filter((item): item is { embed: string; watch: string } => Boolean(item));

  if (!embeds.length) return null;

  return (
    <div className={className}>
      <p
        className={
          compact
            ? "inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
            : "inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-sky-600"
        }
      >
        <PlayCircle className={compact ? "h-4 w-4" : "h-3.5 w-3.5"} />
        ویدیوی ملک
      </p>
      <div className="mt-4 space-y-4">
        {embeds.map((item, index) => (
          <div
            key={`${item.embed}-${index}`}
            className="overflow-hidden rounded-[1.35rem] border border-[#0B3A5C]/8 bg-[#0B3A5C] shadow-sm"
          >
            <div className="aspect-video w-full bg-slate-900">
              <iframe
                src={item.embed}
                title={`ویدیو آپارات ملک ${(index + 1).toLocaleString("fa-IR")}`}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="flex items-center justify-between gap-2 bg-white/95 px-3 py-2.5">
              <span className="text-xs font-medium text-[#0B3A5C]/70">
                ویدیو {(index + 1).toLocaleString("fa-IR")} از آپارات
              </span>
              <a
                href={item.watch}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                مشاهده در آپارات
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
