import type { BlogStatus } from "@/types/blog";

const LABELS: Record<BlogStatus, string> = {
  draft: "پیش‌نویس",
  published: "منتشرشده",
};

type BlogStatusBadgeProps = {
  status: BlogStatus;
};

export default function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        published
          ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      }`}
    >
      {LABELS[status]}
    </span>
  );
}
