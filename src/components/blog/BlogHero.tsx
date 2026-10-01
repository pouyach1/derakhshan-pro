type BlogHeroProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

/**
 * Premium editorial hero — white / ice-blue / crystal Derakhshan identity.
 */
export default function BlogHero({
  eyebrow = "مجله درخشان",
  title = "نگاهی دقیق‌تر به دنیای املاک",
  subtitle = "بازار، خرید، فروش، سرمایه‌گذاری و راهنمای محله‌های کرج — با زبانی شفاف برای تصمیم‌های مهم.",
}: BlogHeroProps) {
  return (
    <header className="relative overflow-hidden border-b border-[#0B3A5C]/8 bg-[#F8FBFE]" dir="rtl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(125,211,252,0.28),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.1),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(11,58,92,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(11,58,92,0.55)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-16 top-10 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl md:h-56 md:w-56"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-10 bottom-0 h-36 w-36 rounded-full bg-sky-200/25 blur-3xl"
      />

      <div className="rio-container relative z-10 py-14 md:py-20 lg:py-24">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-sky-700 shadow-sm backdrop-blur-md md:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl font-vazirmatn text-[clamp(1.85rem,4.5vw,3.35rem)] font-black leading-[1.25] tracking-tight text-[#0B3A5C]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[#0B3A5C]/70 md:text-base md:leading-8">
              {subtitle}
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-[1.5rem] border border-sky-100/80 bg-white/55 p-5 shadow-[0_24px_60px_-40px_rgba(11,58,92,0.35)] backdrop-blur-xl md:p-6">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-600">EDITORIAL</p>
              <p className="mt-3 font-vazirmatn text-sm leading-7 text-[#0B3A5C]/75">
                مطالب منتخب برای کسانی که معامله را جدی می‌گیرند — از تحلیل بازار تا نکات قرارداد.
              </p>
              <div className="mt-4 h-px w-full bg-gradient-to-l from-sky-400/50 via-sky-200/40 to-transparent" />
              <p className="mt-3 text-xs text-[#0B3A5C]/45">املاک درخشان · کرج</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
