import type { Metadata } from "next";
import { LuxuryContactView } from "@/components/contact/LuxuryContactView";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.contactPage.seoTitle} | ${siteConfig.brand.nameFa}`,
  description: siteConfig.contactPage.seoDescription,
};

export default function ContactPage() {
  return <LuxuryContactView />;
}
