import PropertyCard from "@/components/ui/PropertyCard";
import { DEALS } from "@/config/home";

export default function DoneDealsPage() {
  return (
    <section className="bg-beige px-[var(--site--margin)] pb-24 pt-page-top text-brand-800">
      <div className="mx-auto max-w-rio">
        <h1 className="font-vazirmatn text-h1 font-semibold leading-relaxed normal-case tracking-tight">
          معاملات موفق
        </h1>
        <p className="mt-6 max-w-2xl font-vazirmatn text-lg leading-relaxed text-brand-800/75">
          گزیده‌ای از پرونده‌های فروش و اجاره که با همراهی درخشان پرو به نتیجه رسیده‌اند.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEALS.map((deal) => (
            <PropertyCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}
