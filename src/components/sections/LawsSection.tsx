import { LAWS } from "@/config/home";

export default function LawsSection() {
  return (
    <section className="bg-beige py-section-md text-brand-800">
      <div className="rio-container">
        <div className="mb-12 max-w-4xl">
          <h2 className="rio-h2 font-vazirmatn leading-relaxed">وقتی معاملات زیادی انجام می‌دهید، الگوها خودشان را نشان می‌دهند.</h2>
          <p className="mt-4 font-vazirmatn text-sm text-brand-500">قوانین معامله‌گری درخشان پرو</p>
        </div>

        <div className="grid gap-px bg-brand-800/15 md:grid-cols-3">
          {LAWS.map((law, index) => (
            <article
              key={law.title}
              className="group bg-beige p-6 transition-colors duration-300 hover:bg-brand-800 md:min-h-56"
            >
              <p className="text-xs uppercase tracking-wide text-brand-500 group-hover:text-yellow-500">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-vazirmatn text-xl font-semibold leading-relaxed tracking-tight text-brand-800 transition-colors duration-300 group-hover:text-beige">
                {law.title}
              </h3>
              <p className="mt-3 font-vazirmatn text-sm leading-relaxed text-brand-800/70 transition-colors duration-300 group-hover:text-beige/80">
                {law.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
