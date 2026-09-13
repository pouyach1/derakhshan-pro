import { siteConfig } from "@/config/siteConfig";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.panels.loginTitle} | ${siteConfig.brand.productNameFa}`,
  description: siteConfig.panels.loginDescription,
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
