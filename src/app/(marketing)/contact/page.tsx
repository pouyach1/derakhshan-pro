import type { Metadata } from "next";
import { LuxuryContactView } from "@/components/contact/LuxuryContactView";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `ارتباط VIP | ${SITE.nameFa}`,
  description:
    "صفحه ارتباط لوکس درخشان پرو — پشتیبانی VIP، جلسه حضوری، کارشناسی ملک و مشاوره حقوقی با زیبایی‌شناسی آیس‌اسکای.",
};

export default function ContactPage() {
  return <LuxuryContactView />;
}
