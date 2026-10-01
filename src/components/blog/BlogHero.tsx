type BlogHeroProps = {
  title?: string;
  subtitle?: string;
};

export default function BlogHero({
  title = "مجله املاک درخشان",
  subtitle = "راهنمای خرید، فروش و سرمایه‌گذاری در بازار املاک کرج",
}: BlogHeroProps) {
  return (
    <header className="border-b border-[#0B3A5C]/10 bg-white px-4 py-10 md:px-6 md:py-14" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-sky-600">BLOG</p>
        <h1 className="mt-3 font-vazirmatn text-3xl font-bold text-[#0B3A5C] md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0B3A5C]/70 md:text-base">{subtitle}</p>
      </div>
    </header>
  );
}
