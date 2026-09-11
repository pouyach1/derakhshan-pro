import Button from "@/components/ui/Button";
import PropertyCard from "@/components/ui/PropertyCard";
import { DEALS } from "@/config/home";

export default function DoneDealsSection() {
  return (
    <section className="bg-beige py-section-md text-brand-800">
      <div className="rio-container">
        <div className="mb-12 grid gap-8 md:grid-cols-12 md:items-end">
          <h2 className="rio-h2 md:col-span-8 font-vazirmatn leading-relaxed">نمونه معاملات موفقی که با همراهی ما به سرانجام رسیده‌اند.</h2>
          <div className="md:col-span-4 md:justify-self-end">
            <Button href="/done-deals" variant="primary" className="font-vazirmatn normal-case tracking-normal">
              مشاهده کارنامه معاملات
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
