import { Vazirmatn } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import IntroShell from "@/components/providers/IntroShell";
import MobileMotionRoot from "@/components/mobile/MobileMotionRoot";
import MobilePageTransition from "@/components/mobile/MobilePageTransition";
import { siteConfig } from "@/config/siteConfig";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.brand.nameFa,
    alternateName: siteConfig.brand.name,
    description: siteConfig.brand.description,
    url: siteConfig.seo.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.region,
      postalCode: siteConfig.contact.address.postal,
      addressCountry: "IR",
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.instagram,
      siteConfig.social.telegram,
    ].filter(Boolean),
  };

  return (
    <div
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.variable} ${vazirmatn.className} font-vazirmatn antialiased`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntroShell>
        <MobileMotionRoot>
          <Navbar />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-sky-500 focus:px-4 focus:py-2.5 focus:font-vazirmatn focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
          >
            پرش به محتوای اصلی
          </a>
          <main id="main-content">
            <MobilePageTransition>{children}</MobilePageTransition>
          </main>
          <Footer />
        </MobileMotionRoot>
      </IntroShell>
    </div>
  );
}
