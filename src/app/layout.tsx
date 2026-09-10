import type { Metadata } from "next";
<<<<<<< HEAD
=======
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import IntroShell from "@/components/providers/IntroShell";
>>>>>>> origin/main
import { SITE } from "@/config/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    images: [{ url: SITE.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postal,
      addressCountry: "ZA",
    },
    sameAs: [SITE.social.linkedin],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
<<<<<<< HEAD
        {children}
=======
        <IntroShell>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </IntroShell>
>>>>>>> origin/main
      </body>
    </html>
  );
}
