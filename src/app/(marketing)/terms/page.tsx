import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `شرایط استفاده | ${siteConfig.brand.nameFa}`,
};

export default function TermsPage() {
  return (
    <article className="bg-[#070C18] px-4 py-28 text-slate-200 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-5 leading-8">
        <p className="text-xs tracking-[0.2em] text-cyan-300">چارچوب همکاری</p>
        <h1 className="text-3xl font-black text-white">شرایط استفاده از خدمات</h1>
        <p>
          آگهی‌های منتشرشده معرفی فایل هستند و معامله نهایی پس از احراز مالکیت، استعلام ثبتی و توافق طرفین در دفتر انجام
          می‌شود. قیمت‌ها تا تأیید مشاور مسئول قابل تغییرند.
        </p>
        <p>
          ورود به پنل ادمین، مشاور و مشتری فقط برای افراد مجاز دفتر است. صاحب سایت باید رمزهای پیش‌فرض را قبل از تحویل
          عمومی عوض کند.
        </p>
        <Link href="/listings" className="inline-block text-cyan-300">
          مشاهده آرشیو فایل‌ها
        </Link>
      </div>
    </article>
  );
}
