import type { Metadata } from "next";
import { LuxuryServicesView } from "@/components/services/LuxuryServicesView";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `خدمات VIP | ${SITE.nameFa}`,
  description:
    "خدمات جامع املاک درخشان پرو — خرید و فروش پنت‌هاوس، اجاره VIP، سرمایه‌گذاری، حقوقی، کارشناسی و بازسازی لوکس.",
};

export default function ServicesPage() {
  return <LuxuryServicesView />;
}
