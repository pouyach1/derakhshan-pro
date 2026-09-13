import type { Metadata } from "next";
import { LuxuryDoneDealsView } from "@/components/done-deals/LuxuryDoneDealsView";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.doneDealsPage.seoTitle} | ${siteConfig.brand.nameFa}`,
  description: siteConfig.doneDealsPage.seoDescription,
};

export default function DoneDealsPage() {
  return <LuxuryDoneDealsView />;
}
