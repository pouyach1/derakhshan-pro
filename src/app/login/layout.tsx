import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ورود | درخشان پرو",
  description: "ورود هوشمند به پنل مدیریت، مشاور و کاربری",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.variable} ${vazirmatn.className} min-h-dvh bg-[#F1EFEA] text-slate-900 antialiased`}
    >
      {children}
    </div>
  );
}
