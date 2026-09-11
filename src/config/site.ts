export const SITE = {
  name: "Derakhshan Properties",
  nameFa: "درخشان پرو",
  brandEn: "Derakhshan Properties",
  tagline: "Luxury Residences & Investment",
  taglineFa: "مرجع تخصصی املاک و پنت‌هاوس‌های لوکس",
  description:
    "دسترسی اختصاصی به برترین آرشیو پنت‌هاوس‌ها، برج‌های مدرن و ویلاهای VIP همراه با مشاوره تخصصی حقوقی و سرمایه‌گذاری.",
  url: "https://www.derakhshan.pro",
  email: "hello@derakhshan.pro",
  phone: "۰۲۱-۹۱۰۰۰۰۰۰",
  address: {
    line1: "نیاوران، خیابان یاسر",
    line2: "تهران",
    region: "تهران",
    city: "تهران",
    postal: "۱۹۷۸۷",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/derakhshan-properties",
  },
  ogImage: "/images/landing/hero/banner.jpg",
} as const;

export const NAV = [
  { href: "/", label: "خانه" },
  { href: "/meet-the-team", label: "تیم مشاوران" },
  { href: "/done-deals", label: "معاملات موفق" },
  { href: "/services", label: "خدمات" },
  { href: "/contact", label: "مشاوره اختصاصی" },
] as const;
