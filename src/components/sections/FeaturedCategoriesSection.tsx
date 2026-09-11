import Image from "next/image";
import Link from "next/link";
import { FEATURED_CATEGORIES } from "@/config/home";

export default function FeaturedCategoriesSection() {
  return (
    <section className="bg-white py-section-md text-slate-900">
      <div className="rio-container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-vazirmatn text-xs font-semibold tracking-[0.08em] text-sky-500">
              مجموعه‌های گزیده
            </p>
            <h2 className="mt-3 font-vazirmatn text-2xl font-semibold leading-relaxed md:text-4xl">
              دسته‌بندی‌های پیشنهادی
            </h2>
            <p className="mt-4 font-vazirmatn text-sm leading-relaxed text-slate-600 md:text-base">
              ویترین گزیده برای کسانی که فقط بهترین‌ها را می‌خواهند.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {FEATURED_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-slate-900 text-white shadow-lg"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 font-vazirmatn text-[11px] text-sky-300 backdrop-blur-md">
                  {category.locations}
                </span>
                <h3 className="mt-3 font-vazirmatn text-xl font-semibold leading-relaxed md:text-2xl">
                  {category.title}
                </h3>
                <p className="mt-2 font-vazirmatn text-sm text-white/75 transition group-hover:text-sky-300">
                  مشاهده این مجموعه ←
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
