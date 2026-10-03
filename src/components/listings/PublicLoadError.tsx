"use client";

/**
 * Friendly error state for public listing surfaces (light crystal marketing UI).
 * Does not expose technical details.
 */
export default function PublicLoadError({
  onRetry,
  title = "بارگذاری اطلاعات ممکن نشد",
  message = "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.",
}: {
  onRetry: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-sky-200/70 bg-white/90 px-5 py-8 text-center shadow-[0_20px_50px_-36px_rgba(11,58,92,0.35)] sm:col-span-2 xl:col-span-3">
      <p className="font-vazirmatn text-base font-semibold text-[#0B3A5C]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[#0B3A5C]/65">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
      >
        تلاش مجدد
      </button>
    </div>
  );
}
