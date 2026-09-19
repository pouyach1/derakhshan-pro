import { siteConfig } from "@/config/siteConfig";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `پنل مشتری | ${siteConfig.brand.productNameFa}`,
  description: "داشبورد اختصاصی موکل برای پیشنهاد فایل، مشاوره و پیگیری بازدید",
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.variable} ${vazirmatn.className} min-h-dvh bg-[#F3F7FB] font-vazirmatn text-[#0B3A5C] antialiased`}
    >
      {children}
    </div>
  );
}
