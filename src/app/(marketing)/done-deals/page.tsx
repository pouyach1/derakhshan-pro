import type { Metadata } from "next";
import { LuxuryDoneDealsView } from "@/components/done-deals/LuxuryDoneDealsView";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `معاملات موفق | ${SITE.nameFa}`,
  description:
    "کارنامه درخشان معاملات موفق درخشان پرو — پنت‌هاوس، ویلا، اداری و پرونده‌های دیپلماتیک با محرمانگی کامل.",
};

export default function DoneDealsPage() {
  return <LuxuryDoneDealsView />;
}
