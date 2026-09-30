import Button from "@/components/ui/Button";
import PropertyCard from "@/components/ui/PropertyCard";
import { DEALS } from "@/config/home";

export default function DoneDealsSection() {
  return (
    <section className="bg-beige py-section-md text-brand-800">
      <div className="rio-container">
        <div className="mb-12 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h2 className="font-vazirmatn text-h2 font-semibold leading-relaxed normal-case tracking-tight">
              کارنامه‌ی ما، حرف ما را می‌زند
            </h2>
            <p className="mt-3 font-vazirmatn text-sm leading-7 text-brand-800/70 md:text-base">
              نمونه‌ای از معاملاتی که با همراهی ما به سرانجام رسیده است.
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Button href="/done-deals" variant="primary" className="font-vazirmatn normal-case tracking-normal">
              مشاهده کارنامه کامل
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEALS.map((deal) => (
            <PropertyCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}
