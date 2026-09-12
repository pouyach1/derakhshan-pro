import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "تکمیل پروفایل مشتری | درخشان پرو",
  description: "تنظیم پروفایل ملکی برای پیشنهادهای دقیق‌تر",
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.variable} ${vazirmatn.className} min-h-dvh bg-[#F1EFEA] font-vazirmatn text-slate-900 antialiased`}
    >
      {children}
    </div>
  );
}
