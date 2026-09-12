import type { Deal, Law, Persona } from "@/types";

export const HERO = {
  badge: "✦ مرجع تخصصی املاک و پنت‌هاوس‌های لوکس",
  title: "تجربه‌ای متفاوت از خرید و سرمایه‌گذاری در فاخرترین املاک کشور",
  subtitle:
    "دسترسی اختصاصی به برترین آرشیو پنت‌هاوس‌ها، برج‌های مدرن و ویلاهای VIP همراه با مشاوره تخصصی حقوقی.",
  primaryCta: { href: "/done-deals", label: "مشاهده آرشیو املاک VIP" },
  secondaryCta: { href: "/contact", label: "درخواست مشاوره اختصاصی" },
  image: "/images/landing/hero/banner.jpg",
};

export const INTRO_CTA = {
  title: "اینجا برای دیدن عمق واقعی خدمات ما هستید.",
  cta: { href: "/done-deals", label: "مرور معاملات شاخص" },
  body: "درخشان پرو روی املاک فاخر تهران و حومه متمرکز است؛ از پنت‌هاوس و برج‌های لوکس تا ویلاهای VIP و مستغلات تجاری. فروش، اجاره و ارزش‌گذاری را با نگاه سرمایه‌گذاری و انضباط حقوقی پیش می‌بریم.",
};

export const VALUE_PROPS = [
  {
    id: "off-market",
    title: "آرشیو اختصاصی",
    subtitle: "آرشیو آف‌مارکت",
    description: "دسترسی به ملک‌های ویژه و معرفی‌نشده در بازار عمومی",
    image: "/images/landing/features/archive.jpg",
  },
  {
    id: "valuation",
    title: "کارشناسی و ارزش‌گذاری دقیق",
    subtitle: "هوش بازار",
    description: "تحلیل سابقه قیمتی و ارزش‌گذاری هوشمند بر پایه داده‌های روز بازار",
    image: "/images/landing/categories/penthouse.jpg",
  },
  {
    id: "legal",
    title: "همراهی حقوقی صفر تا صد",
    subtitle: "حمایت حقوقی",
    description: "تنظیم قراردادهای رسمی تحت نظر مستمر وکلای پایه یک دادگستری",
    image: "/images/landing/categories/commercial.jpg",
  },
  {
    id: "investment",
    title: "مشاوره سرمایه‌گذاری",
    subtitle: "استراتژی سرمایه",
    description: "ارائه استراتژی‌های رشد سرمایه در پروژه‌های ملکی برتر",
    image: "/images/landing/categories/villa.jpg",
  },
] as const;

export const FEATURED_CATEGORIES = [
  {
    id: "penthouse",
    title: "پنت‌هاوس و برج‌های لوکس",
    locations: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: "/images/landing/categories/penthouse.jpg",
    href: "/done-deals",
  },
  {
    id: "villa",
    title: "ویلاهای مدرن و خاص",
    locations: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: "/images/landing/categories/villa.jpg",
    href: "/done-deals",
  },
  {
    id: "commercial",
    title: "مستغلات و پروژه‌های تجاری",
    locations: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: "/images/landing/categories/commercial.jpg",
    href: "/services",
  },
] as const;

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
    title: "خریداران VIP",
    description: "گزینه‌های گزیده، اعداد شفاف و معامله‌ای که تا انتها پایدار بماند.",
    image: "/assets/images/persona-buyers.webp",
  },
  {
    id: "sellers",
    title: "مالکان و فروشندگان",
    description: "قیمت درست، خریدار جدی و پرونده‌ای که واقعاً به قرارداد برسد.",
    image: "/assets/images/persona-sellers.webp",
  },
  {
    id: "tenants",
    title: "مستأجران حرفه‌ای",
    description: "فضایی هم‌تراز کسب‌وکار شما و شروطی که شفاف و قابل اتکا باشد.",
    image: "/assets/images/persona-tenants.webp",
  },
  {
    id: "landlords",
    title: "سرمایه‌گذاران ملکی",
    description: "جریان اجاره پایدار و مستأجرانی که اعتبارشان قابل اتکا باشد.",
    image: "/assets/images/persona-landlords.webp",
  },
];

export const DEALS: Deal[] = [
  {
    id: "church",
    area: "مشکین دشت",
    size: "۴۵۰ متر",
    title: "دپارتمان درخشان",
    status: "فروخته‌شده",
    image: "/images/landing/hero/banner.jpg",
  },
  {
    id: "lower-main",
    area: "مشکین دشت",
    size: "۸۵۰ متر",
    title: "دپارتمان درخشان",
    status: "فروخته‌شده",
    image: "/images/landing/categories/villa.jpg",
  },
  {
    id: "silo",
    area: "مشکین دشت",
    size: "۲۲۰ متر",
    title: "دپارتمان درخشان",
    status: "اجاره‌داده‌شده",
    image: "/images/landing/categories/penthouse.jpg",
  },
  {
    id: "buitengracht",
    area: "مشکین دشت",
    size: "۳۸۰ متر",
    title: "دپارتمان درخشان",
    status: "فروخته‌شده",
    image: "/images/landing/hero/side.jpg",
  },
  {
    id: "loop",
    area: "مشکین دشت",
    title: "دپارتمان درخشان",
    status: "اجاره‌داده‌شده",
    image: "/images/landing/categories/commercial.jpg",
  },
  {
    id: "burg",
    area: "مشکین دشت",
    size: "۱۶۰ متر",
    title: "دپارتمان درخشان",
    status: "اجاره‌داده‌شده",
    image: "/images/landing/features/archive.jpg",
  },
  {
    id: "wembley",
    area: "مشکین دشت",
    title: "دپارتمان درخشان",
    status: "اجاره‌داده‌شده",
    image: "/assets/images/deal-wembley.webp",
  },
];

export const LAWS: Law[] = [
  {
    statement:
      "معامله‌ای که ۹۹٪ جلو رفته، هنوز تمام نشده است. همان ۱٪ باقی‌مانده، همه چیز را می‌سازد.",
  },
  {
    statement:
      "سرمایه‌گذار نیاوران با سرمایه‌گذار شهرری یکی نیست. استراتژی با محله عوض می‌شود.",
  },
  {
    statement:
      "مشاور شما باید کاربری، بازده و مسیر خروج را بداند. نه فقط کافه و ویوی اطراف.",
  },
  {
    statement:
      "اگر برای دیدن منظره باید از پنجره خم شوید، منظره نیست. دید خوب نباید به خیال نیاز داشته باشد.",
  },
  {
    statement: "امور موکل، امور عمومی نیست. محرمانگی بخشی از خدمات است.",
  },
  {
    statement:
      "اگر قرارداد را نفهمیده‌اید، ملک را نفهمیده‌اید. ارزش واقعی در جزئیات نوشته شده است.",
  },
  {
    statement:
      "گران‌ترین اشتباه، عجله است. دومین اشتباه گران، تردید بیش از حد است.",
  },
  {
    statement: "اعتماد معامله را می‌سازد. قرارداد از آن محافظت می‌کند.",
  },
  {
    statement:
      "بیشتر معاملات روی قیمت نمی‌شکنند. روی انتظارهای ناهم‌خوان می‌شکنند.",
  },
  {
    statement:
      "«عجله‌ای نیست» معمولاً یعنی «به آن قیمت نه.» زمان‌بندی اغلب عدد دارد.",
  },
  {
    statement:
      "معاملهٔ هم‌تراز بدون زمینه، فقط شایعه است. عدد بدون محله معنا ندارد.",
  },
  {
    statement:
      "هرگز بروشور را از خود ملک زیباتر نکنید. بازدید حضوری همیشه برنده است.",
  },
];

export const OFF_MARKET_CTA = {
  title: "هزاران فرصت را عمداً در پورتال‌ها منتشر نمی‌کنیم.",
  body: "همه چیز را در آگهی‌های عمومی نمی‌بینید؛ و این طراحی ماست. پورتال‌ها مفیدند و ما هم از آن‌ها استفاده می‌کنیم. اما بسیاری از فرصت‌های ما آف‌مارکت یا به‌صورت خصوصی معرفی می‌شوند. بگویید دنبال چه هستید تا بیشتر نشان‌تان دهیم.",
  cta: { href: "/contact", label: "درخواست دسترسی اختصاصی" },
  image: "/images/landing/hero/side.jpg",
};
