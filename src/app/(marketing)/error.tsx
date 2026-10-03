"use client";

import { useEffect } from "react";

type MarketingErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Public marketing error UI — light crystal language; details stay in the console in development.
 */
export default function MarketingError({ error, reset }: MarketingErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[marketing]", error);
    }
  }, [error]);

  return (
    <div className="bg-[#F3F7FB] px-4 py-28 text-center text-[#0B3A5C] sm:px-6">
      <div className="mx-auto max-w-lg rounded-[1.75rem] border border-sky-200/70 bg-white/90 px-6 py-10 shadow-[0_24px_60px_-40px_rgba(11,58,92,0.4)]">
        <p className="text-xs font-semibold tracking-[0.2em] text-sky-600">اختلال موقت</p>
        <h1 className="mt-4 font-vazirmatn text-2xl font-semibold sm:text-3xl">
          بارگذاری این صفحه کامل نشد
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#0B3A5C]/65">
          لطفاً چند لحظه دیگر دوباره تلاش کنید. اگر مشکل ادامه داشت، صفحه را رفرش کنید یا بعداً بازگردید.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex rounded-full bg-[#0B3A5C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
