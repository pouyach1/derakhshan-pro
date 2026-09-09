export const SITE = {
  name: "RIO Property",
  tagline: "Retail, Industrial, Office",
  description:
    "We specialise in commercial real estate within Cape Town and the surrounding suburbs. Across retail, industrial and office property we sell, lease and value assets for owners, developers, investors and banks.",
  url: "https://www.rioproperty.co.za",
  email: "hello@rioproperty.co.za",
  phone: "+27 72 227 1993",
  address: {
    line1: "Tarquin House",
    line2: "Loop Street",
    region: "Western Cape",
    city: "Cape Town",
    postal: "8001",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/rio-property",
  },
  ogImage: "/assets/images/og-image.jpg",
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/meet-the-team", label: "Meet the team" },
  { href: "/done-deals", label: "Done Deals" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Get in Touch" },
] as const;
