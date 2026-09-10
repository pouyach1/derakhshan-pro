import HeroSection from "@/components/sections/HeroSection";
import CtaTextSection from "@/components/sections/CtaTextSection";
import ClientLogoMarquee from "@/components/sections/ClientLogoMarquee";
import PersonasSection from "@/components/sections/PersonasSection";
import DoneDealsSection from "@/components/sections/DoneDealsSection";
import LawsSection from "@/components/sections/LawsSection";
import FullImageCtaSection from "@/components/sections/FullImageCtaSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import { INTRO_CTA } from "@/config/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CtaTextSection title={INTRO_CTA.title} body={INTRO_CTA.body} cta={INTRO_CTA.cta} />
      <ClientLogoMarquee />
      <PersonasSection />
      <DoneDealsSection />
      <LawsSection />
      <FullImageCtaSection />
      <ContactFormSection />
    </>
  );
}
