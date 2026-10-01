"use client";

type BlogEmptyStateProps = {
  query: string;
  category: string | null;
  onReset: () => void;
};

export default function BlogEmptyState({ query, category, onReset }: BlogEmptyStateProps) {
  const queryLabel = query.trim();
  const parts: string[] = [];
  if (queryLabel) parts.push(`«${queryLabel}»`);
  if (category) parts.push(`دستهٔ ${category}`);

  return (
    <div
      className="rounded-[1.75rem] border border-sky-100/80 bg-white/75 px-6 py-14 text-center shadow-[0_20px_50px_-40px_rgba(11,58,92,0.3)] backdrop-blur-xl md:px-10"
      role="status"
      dir="rtl"
    >
      <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-600">NO RESULTS</p>
      <p className="mt-3 font-vazirmatn text-lg font-bold text-[#0B3A5C]">
        مطلبی با این شرایط پیدا نشد
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#0B3A5C]/60">
        {parts.length
          ? `برای ${parts.join(" و ")} نتیجه‌ای در آرشیو فعلی نیست. فیلترها را پاک کنید یا عبارت دیگری امتحان کنید.`
          : "مقاله‌ای برای نمایش نیست."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
      >
        پاک کردن فیلترها
      </button>
    </div>
  );
}
