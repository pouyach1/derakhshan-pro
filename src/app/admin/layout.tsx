import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import AdminShell from "@/components/admin/AdminShell";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "پنل مدیریت | درخشان پرو",
  description: "مدیریت آگهی‌ها، پیگیری مشتریان، مشاوران و تنظیمات دفتر املاک",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${vazirmatn.variable} ${vazirmatn.className}`}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
