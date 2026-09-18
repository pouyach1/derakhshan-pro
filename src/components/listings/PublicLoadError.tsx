"use client";

/**
 * Friendly empty/error state for public listing surfaces.
 * Keeps the existing dark marketing look without exposing technical details.
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
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-5 py-8 text-center sm:col-span-2 xl:col-span-3">
      <p className="font-vazirmatn text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-400">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        تلاش مجدد
      </button>
    </div>
  );
}
