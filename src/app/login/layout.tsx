import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ورود | درخشان پرو",
  description: "به پنل درخشان پرو وارد شوید و املاک منتخب را با مشاوران معتبر مدیریت کنید.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.variable} ${vazirmatn.className} min-h-dvh bg-[#F0F4F8] font-vazirmatn text-slate-900 antialiased`}
    >
      {children}
    </div>
  );
}
