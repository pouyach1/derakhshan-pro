import type { Deal, Law, Persona } from "@/types";

export const HERO = {
  eyebrow: ["Retail", "Industrial", "Office"],
  support: "We broker, value and track commercial property across Cape Town.",
  title: "Rio Property knows Cape Town",
  image: "/assets/images/hero-mobile.webp",
};

export const INTRO_CTA = {
  title: "You’re probably here to see what we actually do.",
  cta: { href: "/done-deals", label: "See our track record" },
  body: "We specialise in commercial real estate within Cape Town and the surrounding suburbs. Across retail, industrial and office property we sell, lease and value assets for owners, developers, investors and banks.",
};

export const CLIENT_LOGOS = [
  "/assets/logos/client-1.svg",
  "/assets/logos/client-2.svg",
  "/assets/logos/client-3.svg",
  "/assets/logos/client-4.svg",
  "/assets/logos/client-5.svg",
  "/assets/logos/client-6.svg",
];

export const PERSONAS: Persona[] = [
  {
    id: "buyers",
    title: "Buyers",
    description: "You need good options, clear numbers and a deal that holds together.",
    image: "/assets/images/persona-buyers.webp",
  },
  {
    id: "sellers",
    title: "Sellers",
    description: "You need the right price and a deal that actually completes.",
    image: "/assets/images/persona-sellers.webp",
  },
  {
    id: "tenants",
    title: "Tenants",
    description: "You need options that fit your business and lease terms you understand.",
    image: "/assets/images/persona-tenants.webp",
  },
  {
    id: "landlords",
    title: "Landlords",
    description: "You need steady rental income and tenants you can rely on.",
    image: "/assets/images/persona-landlords.webp",
  },
];

export const DEALS: Deal[] = [
  {
    id: "church",
    area: "CBD",
    size: "24000 m² Bulk",
    title: "Church Street Development Site",
    status: "Sold",
    image: "/assets/images/deal-church-street.webp",
  },
  {
    id: "lower-main",
    area: "Observatory",
    size: "573 m²",
    title: "Lower Main Road Restaurant & Bar",
    status: "Sold",
    image: "/assets/images/deal-lower-main.webp",
  },
  {
    id: "silo",
    area: "V&A Waterfront",
    size: "1120 m²",
    title: "The Silo Office",
    status: "Leased",
    image: "/assets/images/deal-the-silo.webp",
  },
  {
    id: "buitengracht",
    area: "CBD",
    size: "4864 m²",
    title: "Buitengracht Street Mixed Use",
    status: "Sold",
    image: "/assets/images/deal-buitengracht.webp",
  },
  {
    id: "loop",
    area: "CBD",
    title: "Loop Street Retail",
    status: "Leased",
    image: "/assets/images/deal-loop-street.webp",
  },
  {
    id: "burg",
    area: "CBD",
    size: "1078 m²",
    title: "Burg Street Residential",
    status: "Leased",
    image: "/assets/images/deal-burg-street.webp",
  },
  {
    id: "wembley",
    area: "Gardens",
    title: "Wembley Square Retail",
    status: "Leased",
    image: "/assets/images/deal-wembley.webp",
  },
];

export const LAWS: Law[] = [
  {
    title: "A deal that is 99% done is not done.",
    text: "That 1% is everything.",
  },
  {
    title: "The Sea Point investor and Salt River Investor are not the same person.",
    text: "Strategy changes with the street.",
  },
  {
    title: "Your broker should know the zoning, the yield and the exit.",
    text: "Not just the coffee shops nearby.",
  },
  {
    title: "If you have to lean out the window to see the mountain, it’s not a mountain view.",
    text: "A good view should not require imagination.",
  },
  {
    title: "Client matters are not public matters.",
    text: "Discretion is part of the service.",
  },
  {
    title: "If the lease is not understood, the asset is not understood.",
    text: "The real value is written in the fine print.",
  },
  {
    title: "The most expensive mistake is rushing.",
    text: "The second most expensive is hesitating.",
  },
  {
    title: "Trust makes the deal.",
    text: "The contract protects it.",
  },
  {
    title: "Most deals don’t fail on price.",
    text: "They fail on expectations.",
  },
  {
    title: "“Not in a rush” usually means “Not at that price.”",
    text: "Timing often has a number attached.",
  },
  {
    title: "A comp without context is just gossip.",
    text: "Numbers need neighbourhoods.",
  },
  {
    title: "Never make the brochure prettier than the building.",
    text: "Reality always wins the inspection.",
  },
];

export const OFF_MARKET_CTA = {
  title: "We don’t list our (thousands of) properties on purpose.",
  body: "You won’t see them all on Property24, and that’s by design. Portals are useful. We use them too. But many of our opportunities are off-market or privately shared. Tell us what you’re looking for and we’ll show you more.",
  cta: { href: "/contact", label: "Get in touch" },
  image: "/assets/images/full-bleed.webp",
};
