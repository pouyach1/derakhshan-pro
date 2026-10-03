import type { Metadata } from "next";
import { LuxuryServicesView } from "@/components/services/LuxuryServicesView";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.servicesPage.seoTitle} | ${siteConfig.brand.nameFa}`,
  description: siteConfig.servicesPage.seoDescription,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${siteConfig.servicesPage.seoTitle} | ${siteConfig.brand.nameFa}`,
    description: siteConfig.servicesPage.seoDescription,
    type: "website",
    url: "/services",
    locale: "fa_IR",
    siteName: siteConfig.brand.nameFa,
  },
};

export default function ServicesPage() {
  return <LuxuryServicesView />;
}
