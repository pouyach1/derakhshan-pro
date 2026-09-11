export default function ServicesPage() {
  const services = [
    {
      title: "فروش ملک فاخر",
      body: "از قیمت‌گذاری هوشمند تا معرفی خریدار جدی؛ پرونده فروش را تا امضای نهایی با انضباط حقوقی پیش می‌بریم.",
    },
    {
      title: "اجاره و بهره‌برداری",
      body: "انتخاب مستأجر معتبر، تنظیم قرارداد شفاف و مدیریت شروطی که جریان درآمد را پایدار نگه دارد.",
    },
    {
      title: "ارزش‌گذاری و مشاوره سرمایه",
      body: "تحلیل بازار، سناریوی بازده و مسیر خروج برای تصمیم‌هایی که فقط به حس و شهود متکی نباشند.",
    },
  ];

  return (
    <section className="bg-beige px-[var(--site--margin)] pb-24 pt-page-top text-brand-800">
      <div className="mx-auto max-w-rio">
        <h1 className="font-vazirmatn text-h1 font-semibold leading-relaxed normal-case tracking-tight">
          خدمات تخصصی
        </h1>
        <p className="mt-6 max-w-2xl font-vazirmatn text-lg leading-relaxed text-brand-800/75">
          همراهی کامل برای خرید، فروش، اجاره و سرمایه‌گذاری در املاک لوکس تهران و حومه.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((item) => (
            <article key={item.title} className="rounded-rio border border-brand-800/10 p-8">
              <h2 className="font-vazirmatn text-2xl font-semibold leading-relaxed tracking-tight md:text-3xl">
                {item.title}
              </h2>
              <p className="mt-4 font-vazirmatn leading-relaxed text-brand-800/75">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
