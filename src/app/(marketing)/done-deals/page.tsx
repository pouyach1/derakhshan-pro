import type { Metadata } from "next";
import { LuxuryDoneDealsView } from "@/components/done-deals/LuxuryDoneDealsView";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.doneDealsPage.seoTitle} | ${siteConfig.brand.nameFa}`,
  description: siteConfig.doneDealsPage.seoDescription,
  alternates: { canonical: "/done-deals" },
  openGraph: {
    title: `${siteConfig.doneDealsPage.seoTitle} | ${siteConfig.brand.nameFa}`,
    description: siteConfig.doneDealsPage.seoDescription,
    type: "website",
    url: "/done-deals",
    locale: "fa_IR",
    siteName: siteConfig.brand.nameFa,
  },
};

export default function DoneDealsPage() {
  return <LuxuryDoneDealsView />;
}
