import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Editorial end-of-article CTA — premium, not salesy.
 */
export default function ArticleCTA() {
  return (
    <section
      className="relative overflow-hidden rounded-[1.75rem] border border-sky-100/80 bg-white/60 px-6 py-8 shadow-[0_24px_60px_-44px_rgba(11,58,92,0.35)] backdrop-blur-xl md:px-10 md:py-10"
      aria-label="ادامه مسیر در درخشان"
      dir="rtl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(125,211,252,0.22),transparent_55%)]"
      />
      <div className="relative z-10 grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-8">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-600">DERAKHSHAN</p>
          <h2 className="mt-2 font-vazirmatn text-xl font-bold leading-9 text-[#0B3A5C] md:text-2xl">
            آماده‌اید ملک مناسب را دقیق‌تر ببینید؟
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[#0B3A5C]/65">
            آرشیو خصوصی املاک درخشان و مشاورهٔ اختصاصی، برای تصمیم‌هایی که ارزش دقت دارند.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-start">
          <Link
            href="/listings"
            className="group/cta inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            مشاهده آرشیو
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 ease-out group-hover/cta:-translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#0B3A5C] transition duration-200 hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            درخواست مشاوره
          </Link>
        </div>
      </div>
    </section>
  );
}
