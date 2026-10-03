import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import MarketSignalSection from "@/components/sections/MarketSignalSection";
import ValuePropsSection from "@/components/sections/ValuePropsSection";
import HomePropertiesSection from "@/components/sections/HomePropertiesSection";
import FeaturedCategoriesSection from "@/components/sections/FeaturedCategoriesSection";
import ClientLogoMarquee from "@/components/sections/ClientLogoMarquee";
import DoneDealsSection from "@/components/sections/DoneDealsSection";
import LawsSection from "@/components/sections/LawsSection";
import FullImageCtaSection from "@/components/sections/FullImageCtaSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    type: "website",
    url: "/",
    locale: "fa_IR",
    siteName: siteConfig.brand.nameFa,
    images: [{ url: siteConfig.seo.ogImage }],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarketSignalSection />
      <ValuePropsSection />
      {/* فایل‌های زنده — جدا از Hero، برای موبایل و دسکتاپ */}
      <HomePropertiesSection />
      <FeaturedCategoriesSection />
      <ClientLogoMarquee />
      <DoneDealsSection />
      <LawsSection />
      <FullImageCtaSection />
      <ContactFormSection />
    </>
  );
}
