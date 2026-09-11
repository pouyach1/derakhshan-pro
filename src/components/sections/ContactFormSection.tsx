"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import { UnderlineInput, UnderlineSelect, UnderlineTextarea } from "@/components/ui/Input";
import { SITE } from "@/config/site";

const INTERESTS = [
  "اجاره فضای لوکس",
  "خرید ملک VIP",
  "فروش یا معرفی دارایی",
  "مشاوره استراتژیک سرمایه‌گذاری",
] as const;

const CATEGORIES = ["مسکونی لوکس", "ویلا و باغ", "اداری", "تجاری و مختلط"] as const;

export default function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  return (
    <section id="contact" className="bg-brand-500 py-section-md text-beige">
      <div className="rio-container grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="font-vazirmatn text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-relaxed tracking-tight text-yellow-500">
            گفت‌وگوی اختصاصی
          </h2>
          <p className="mt-4 font-vazirmatn text-lg leading-relaxed text-beige/90">
            بگویید دقیقاً دنبال چه ملکی هستید
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-10 inline-flex items-center gap-3 font-sans text-xl font-semibold uppercase tracking-[0.12em] text-yellow-500 transition-colors duration-300 hover:text-beige md:text-2xl"
          >
            {SITE.email} <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="md:col-span-7">
          {submitted ? (
            <p className="font-vazirmatn text-2xl font-semibold leading-relaxed text-yellow-500 md:text-3xl">
              پیام شما دریافت شد. به‌زودی با شما تماس می‌گیریم.
            </p>
          ) : (
            <form className="space-y-8 font-vazirmatn" onSubmit={onSubmit} dir="rtl">
              <p className="text-sm text-beige/70">اطلاعات تماس</p>
              <div className="grid gap-6 md:grid-cols-2">
                <UnderlineInput label="نام و نام خانوادگی" name="name" required placeholder="نام کامل شما" />
                <UnderlineInput
                  label="ایمیل"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                />
              </div>
              <UnderlineInput label="شماره تماس" name="phone" type="tel" placeholder="۰۹۱۲..." />
              <UnderlineSelect label="موضوع درخواست" name="interest" options={[...INTERESTS]} />

              <fieldset>
                <legend className="text-sm text-beige/70">دسته‌بندی‌های موردنظر (چند گزینه)</legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  {CATEGORIES.map((category) => {
                    const active = categories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={
                          active
                            ? "rounded-pill border border-yellow-500 bg-yellow-500 px-4 py-2 text-sm text-brand-800"
                            : "rounded-pill border border-beige/30 px-4 py-2 text-sm text-beige transition-colors duration-300 hover:border-yellow-500 hover:text-yellow-500"
                        }
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <UnderlineTextarea
                label="پیام"
                name="message"
                placeholder="جزئیات بیشتری که باید بدانیم..."
              />

              <Button type="submit" variant="yellow" className="font-vazirmatn normal-case tracking-normal">
                ارسال درخواست
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
