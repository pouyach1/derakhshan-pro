import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `حریم خصوصی | ${siteConfig.brand.nameFa}`,
};

export default function PrivacyPage() {
  return (
    <article className="bg-[#070C18] px-4 py-28 text-slate-200 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-5 leading-8">
        <p className="text-xs tracking-[0.2em] text-cyan-300">محرمانگی پرونده‌ها</p>
        <h1 className="text-3xl font-black text-white">سیاست حریم خصوصی</h1>
        <p>
          {siteConfig.brand.nameFa} اطلاعات تماس، بودجه و جزئیات ملک را فقط برای پیشبرد همان پرونده استفاده می‌کند.
          این داده‌ها در اختیار مشاور مسئول و مدیریت دفتر قرار می‌گیرد و برای تبلیغات عمومی فروخته نمی‌شود.
        </p>
        <p>
          فرم‌های سایت، درخواست بازدید و عضویت خبرنامه در سیستم دفتر ذخیره می‌شوند. صاحب سایت می‌تواند متن این صفحه را
          با نسخه حقوقی نهایی دفتر در `siteConfig` یا این مسیر جایگزین کند.
        </p>
        <p>
          تماس: {siteConfig.contact.email} · {siteConfig.contact.phone}
        </p>
        <Link href="/contact" className="inline-block text-cyan-300">
          بازگشت به مشاوره
        </Link>
      </div>
    </article>
  );
}
