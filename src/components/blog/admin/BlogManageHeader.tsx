import Link from "next/link";
import { Plus } from "lucide-react";

type BlogManageHeaderProps = {
  title?: string;
  subtitle: string;
  basePath: string;
  total: number;
  published: number;
  drafts: number;
};

export default function BlogManageHeader({
  title = "وبلاگ",
  subtitle,
  basePath,
  total,
  published,
  drafts,
}: BlogManageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4" dir="rtl">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-400">EDITORIAL CMS</p>
        <h1 className="mt-2 font-vazirmatn text-2xl font-bold text-ws-text md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-ws-muted">{subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-ws-surface px-3 py-1.5 font-semibold text-ws-text ring-1 ring-white/10">
            {total.toLocaleString("fa-IR")} مقاله
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 ring-1 ring-emerald-100">
            {published.toLocaleString("fa-IR")} منتشر شده
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700 ring-1 ring-amber-100">
            {drafts.toLocaleString("fa-IR")} پیش‌نویس
          </span>
        </div>
      </div>

      <Link
        href={`${basePath}/new`}
        className="inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
      >
        <Plus className="h-4 w-4" aria-hidden />
        مقاله جدید
      </Link>
    </div>
  );
}
