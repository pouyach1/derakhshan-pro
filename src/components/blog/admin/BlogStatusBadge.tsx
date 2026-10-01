import type { BlogStatus } from "@/types/blog";
import { cn } from "@/lib/utils";

const LABELS: Record<BlogStatus, string> = {
  draft: "پیش‌نویس",
  published: "منتشر شده",
};

type BlogStatusBadgeProps = {
  status: BlogStatus;
  className?: string;
};

export default function BlogStatusBadge({ status, className }: BlogStatusBadgeProps) {
  const published = status === "published";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
        published
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-amber-50 text-amber-700 ring-amber-100",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-emerald-500" : "bg-amber-400")}
      />
      {LABELS[status]}
    </span>
  );
}
