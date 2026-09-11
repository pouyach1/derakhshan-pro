import { VALUE_PROPS } from "@/config/home";

export default function ValuePropsSection() {
  return (
    <section className="bg-slate-50 py-section-md text-slate-900">
      <div className="rio-container">
        <div className="mb-12 max-w-3xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-sky-500">
            Why Derakhshan
          </p>
          <h2 className="mt-3 font-vazirmatn text-2xl font-semibold leading-relaxed md:text-4xl">
            چهار ستون یک تجربه ملکی فاخر
          </h2>
          <p className="mt-4 font-vazirmatn text-sm leading-relaxed text-slate-600 md:text-base">
            از دسترسی آف‌مارکت تا انضباط حقوقی و استراتژی سرمایه؛ هر بخش برای تصمیم‌های جدی طراحی شده است.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {VALUE_PROPS.map((item, index) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-[0_24px_60px_-28px_rgba(0,163,255,0.45)]"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 font-sans text-sm font-semibold text-sky-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {item.subtitle}
                </span>
              </div>
              <h3 className="font-vazirmatn text-lg font-semibold leading-relaxed text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 font-vazirmatn text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
              <div className="mt-8 h-px w-full bg-gradient-to-l from-sky-500/50 to-transparent opacity-0 transition group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
