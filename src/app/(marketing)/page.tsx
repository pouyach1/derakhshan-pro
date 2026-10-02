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
