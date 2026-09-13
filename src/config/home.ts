import type { Deal, Law, Persona } from "@/types";
import { siteConfig } from "@/config/siteConfig";

/** بازصادرات از siteConfig — نام‌های قبلی برای سازگاری حفظ شده‌اند */

export const HERO = siteConfig.hero;

export const INTRO_CTA = {
  title: siteConfig.about.title,
  cta: siteConfig.about.cta,
  body: siteConfig.about.body,
};

export const VALUE_PROPS = siteConfig.home.valueProps;

export const FEATURED_CATEGORIES = siteConfig.home.featuredCategories;

export const CLIENT_LOGOS = [...siteConfig.home.clientLogos];

export const PERSONAS: Persona[] = siteConfig.home.personas.map((p) => ({ ...p }));

export const DEALS: Deal[] = siteConfig.home.deals.map((d) => ({ ...d }));

export const LAWS: Law[] = siteConfig.home.laws.map((l) => ({ ...l }));

export const OFF_MARKET_CTA = siteConfig.home.offMarketCta;
