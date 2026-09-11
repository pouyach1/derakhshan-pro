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
    subtitle: "Off-Market Properties",
    description: "دسترسی به ملک‌های ویژه و معرفی‌نشده در بازار عمومی",
    image: "/images/landing/features/archive.jpg",
  },
  {
    id: "valuation",
    title: "کارشناسی و ارزش‌گذاری دقیق",
    subtitle: "Market Intelligence",
    description: "تحلیل سابقه قیمتی و ارزش‌گذاری هوشمند بر پایه داده‌های روز بازار",
    image: "/images/landing/categories/penthouse.jpg",
  },
  {
    id: "legal",
    title: "همراهی حقوقی صفر تا صد",
    subtitle: "Legal Escort",
    description: "تنظیم قراردادهای رسمی تحت نظر مستمر وکلای پایه یک دادگستری",
    image: "/images/landing/categories/commercial.jpg",
  },
  {
    id: "investment",
    title: "مشاوره سرمایه‌گذاری",
    subtitle: "Capital Strategy",
    description: "ارائه استراتژی‌های رشد سرمایه در پروژه‌های ملکی برتر",
    image: "/images/landing/categories/villa.jpg",
  },
] as const;

export const FEATURED_CATEGORIES = [
  {
    id: "penthouse",
    title: "پنت‌هاوس و برج‌های لوکس",
    locations: "نیاوران، زعفرانیه، فرشته",
    image: "/images/landing/categories/penthouse.jpg",
    href: "/done-deals",
  },
  {
    id: "villa",
    title: "ویلاهای مدرن و خاص",
    locations: "لواسان، کردان، شمال",
    image: "/images/landing/categories/villa.jpg",
    href: "/done-deals",
  },
  {
    id: "commercial",
    title: "مستغلات و پروژه‌های تجاری",
    locations: "منطقه ۱ و ۳",
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
    area: "نیاوران",
    size: "۴۵۰ متر",
    title: "برج لوکس دراک (کوچه چناران)",
    status: "Sold",
    image: "/images/landing/hero/banner.jpg",
  },
  {
    id: "lower-main",
    area: "لواسان",
    size: "۸۵۰ متر",
    title: "ویلای مدرن دوبلکس لواسان",
    status: "Sold",
    image: "/images/landing/categories/villa.jpg",
  },
  {
    id: "silo",
    area: "فرشته",
    size: "۲۲۰ متر",
    title: "آپارتمان مدرن فرشته",
    status: "Leased",
    image: "/images/landing/categories/penthouse.jpg",
  },
  {
    id: "buitengracht",
    area: "زعفرانیه",
    size: "۳۸۰ متر",
    title: "پنت‌هاوس پانوراما زعفرانیه",
    status: "Sold",
    image: "/images/landing/hero/side.jpg",
  },
  {
    id: "loop",
    area: "ونک",
    title: "دفتر کار میدان ونک",
    status: "Leased",
    image: "/images/landing/categories/commercial.jpg",
  },
  {
    id: "burg",
    area: "جردن",
    size: "۱۶۰ متر",
    title: "آپارتمان بازسازی‌شده جردن",
    status: "Leased",
    image: "/images/landing/features/archive.jpg",
  },
  {
    id: "wembley",
    area: "سعادت‌آباد",
    title: "واحد سعادت‌آباد فاز ۱",
    status: "Leased",
    image: "/assets/images/deal-wembley.webp",
  },
];

export const LAWS: Law[] = [
  {
    title: "معامله‌ای که ۹۹٪ جلو رفته، هنوز تمام نشده است.",
    text: "همان ۱٪ باقی‌مانده، همه چیز را می‌سازد.",
  },
  {
    title: "سرمایه‌گذار نیاوران با سرمایه‌گذار شهرری یکی نیست.",
    text: "استراتژی با محله عوض می‌شود.",
  },
  {
    title: "مشاور شما باید کاربری، بازده و مسیر خروج را بداند.",
    text: "نه فقط کافه و ویوی اطراف.",
  },
  {
    title: "اگر برای دیدن منظره باید از پنجره خم شوید، منظره نیست.",
    text: "دید خوب نباید به خیال نیاز داشته باشد.",
  },
  {
    title: "امور موکل، امور عمومی نیست.",
    text: "محرمانگی بخشی از خدمات است.",
  },
  {
    title: "اگر قرارداد را نفهمیده‌اید، ملک را نفهمیده‌اید.",
    text: "ارزش واقعی در جزئیات نوشته شده است.",
  },
  {
    title: "گران‌ترین اشتباه، عجله است.",
    text: "دومین اشتباه گران، تردید بیش از حد است.",
  },
  {
    title: "اعتماد معامله را می‌سازد.",
    text: "قرارداد از آن محافظت می‌کند.",
  },
  {
    title: "بیشتر معاملات روی قیمت نمی‌شکنند.",
    text: "روی انتظارهای ناهم‌خوان می‌شکنند.",
  },
  {
    title: "«عجله‌ای نیست» معمولاً یعنی «به آن قیمت نه.»",
    text: "زمان‌بندی اغلب عدد دارد.",
  },
  {
    title: "معاملهٔ هم‌تراز بدون زمینه، فقط شایعه است.",
    text: "عدد بدون محله معنا ندارد.",
  },
  {
    title: "هرگز بروشور را از خود ملک زیباتر نکنید.",
    text: "بازدید حضوری همیشه برنده است.",
  },
];

export const OFF_MARKET_CTA = {
  title: "هزاران فرصت را عمداً در پورتال‌ها منتشر نمی‌کنیم.",
  body: "همه چیز را در آگهی‌های عمومی نمی‌بینید؛ و این طراحی ماست. پورتال‌ها مفیدند و ما هم از آن‌ها استفاده می‌کنیم. اما بسیاری از فرصت‌های ما آف‌مارکت یا به‌صورت خصوصی معرفی می‌شوند. بگویید دنبال چه هستید تا بیشتر نشان‌تان دهیم.",
  cta: { href: "/contact", label: "درخواست دسترسی اختصاصی" },
  image: "/images/landing/hero/side.jpg",
};
