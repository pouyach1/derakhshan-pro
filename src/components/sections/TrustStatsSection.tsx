import { TRUST_STATS } from "@/config/home";

export default function TrustStatsSection() {
  return (
    <section className="border-y border-sky-100/80 bg-white py-10 text-slate-900 md:py-12" aria-label="آمار اعتماد">
      <div className="rio-container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-start">
              <p className="font-vazirmatn text-2xl font-semibold tracking-tight text-sky-600 md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2 font-vazirmatn text-sm leading-relaxed text-slate-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
