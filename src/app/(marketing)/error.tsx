"use client";

import { useEffect } from "react";

type MarketingErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Public marketing error UI — friendly copy only; full details stay in the console during development.
 */
export default function MarketingError({ error, reset }: MarketingErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[marketing]", error);
    }
  }, [error]);

  return (
    <div className="bg-[#070C18] px-4 py-28 text-center text-white sm:px-6">
      <div className="mx-auto max-w-lg rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">اختلال موقت</p>
        <h1 className="mt-4 font-vazirmatn text-2xl font-semibold sm:text-3xl">
          بارگذاری این صفحه کامل نشد
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          لطفاً چند لحظه دیگر دوباره تلاش کنید. اگر مشکل ادامه داشت، صفحه را رفرش کنید یا بعداً بازگردید.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
