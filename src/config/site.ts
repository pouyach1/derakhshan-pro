import { siteConfig } from "@/config/siteConfig";

/** شکل قبلی SITE برای سازگاری با importهای موجود — مقادیر از siteConfig می‌آیند */
export const SITE = {
  name: siteConfig.brand.name,
  nameFa: siteConfig.brand.nameFa,
  brandEn: siteConfig.brand.brandEn,
  tagline: siteConfig.brand.tagline,
  taglineFa: siteConfig.brand.taglineFa,
  description: siteConfig.brand.description,
  url: siteConfig.seo.url,
  email: siteConfig.contact.email,
  phone: siteConfig.contact.phone,
  address: {
    line1: siteConfig.contact.address.line1,
    line2: siteConfig.contact.address.line2,
    region: siteConfig.contact.address.region,
    city: siteConfig.contact.address.city,
    postal: siteConfig.contact.address.postal,
  },
  social: {
    linkedin: siteConfig.social.linkedin,
  },
  ogImage: siteConfig.seo.ogImage,
} as const;

export const NAV = siteConfig.nav;
