/**
 * ============================================================================
 * siteConfig.ts — ساختار کامل سایت
 * ============================================================================
 *
 * صاحب سایت: فقط فایل زیر را ویرایش کنید (نه این فایل):
 *   →  src/config/SITE_INFO.ts
 *
 * این فایل بقیهٔ متن‌ها و ساختار صفحات را نگه می‌دارد و هویت برند را
 * از SITE_INFO می‌خواند. املاک و CRM از پنل ادمین می‌آیند.
 * ============================================================================
 */

import { SITE_INFO } from "@/config/SITE_INFO";

/** کلیدهای آیکون (کامپوننت‌ها این نام‌ها را به Lucide نگاشت می‌کنند) */
export type SiteIconKey =
  | "building"
  | "phone"
  | "instagram"
  | "send"
  | "message-circle"
  | "linkedin"
  | "calendar-clock"
  | "file-search"
  | "scale"
  | "navigation"
  | "clock"
  | "key"
  | "briefcase"
  | "paintbrush"
  | "sparkles"
  | "calendar-check"
  | "shield"
  | "shield-check"
  | "badge-check"
  | "file-check"
  | "trophy";

/* از SITE_INFO خوانده می‌شوند — برای ویرایش به آن فایل بروید */
const PHONE = SITE_INFO.phone;
const EMAIL = SITE_INFO.email;
const ADDRESS_LINE1 = SITE_INFO.addressLine1;
const CITY = SITE_INFO.city;
const REGION = SITE_INFO.region;
const NAME_FA = SITE_INFO.nameFa;
const WHATSAPP_DIGITS = SITE_INFO.whatsapp;

export const siteConfig = {
  /* ======================================================================== */
  /* brand — هویت برند (نام، شعار، توضیحات کوتاه)                               */
  /* ======================================================================== */
  brand: {
    /** نام انگلیسی برند (برای SEO و متادیتا) */
    name: SITE_INFO.nameEn,
    /** نام فارسی برند — در هدر، فوتر و عناوین صفحات دیده می‌شود */
    nameFa: NAME_FA,
    /** نام انگلیسی جایگزین / برندینگ لاتین */
    brandEn: SITE_INFO.nameEn,
    /** شعار انگلیسی کوتاه */
    tagline: SITE_INFO.taglineEn,
    /** شعار فارسی کوتاه */
    taglineFa: SITE_INFO.taglineFa,
    /** توضیح کوتاه برند برای صفحهٔ اصلی و SEO */
    description: SITE_INFO.description,
    /** نام کوتاه فارسی برای فوتر و بج‌ها (مثلاً «املاک درخشان») */
    shortNameFa: SITE_INFO.shortNameFa,
    /** واترمارک بزرگ لاتین در فوتر (مثل DERAKHSHAN) */
    watermark: SITE_INFO.watermark,
    /** نام محصول/پنل کوتاه (مثلاً «درخشان پرو») — در لاگین و شل پنل‌ها */
    productNameFa: SITE_INFO.productNameFa,
    /** نام مدیر دفتر پیش‌فرض برای فرم تنظیمات ادمین */
    managerNameFa: SITE_INFO.managerNameFa,
  },

  /* ======================================================================== */
  /* hero — هیرو صفحهٔ اصلی                                                     */
  /* ======================================================================== */
  hero: {
    /** بج کوچک بالای عنوان */
    badge: "کارگزاری خصوصی املاک فاخر کرج",
    /** عنوان اصلی هیرو */
    title: "بهترین فایل‌های کرج، هیچ‌وقت آگهی نمی‌شوند.",
    /** زیر‌عنوان / توضیح کوتاه زیر عنوان */
    subtitle:
      "ویلا، آپارتمان لوکس و دفاتر اداری منتخب بالاشهر کرج، مستقیم از آرشیو خصوصی ما. با مشاوران باتجربه، پیگیری منظم و معامله‌ای کاملاً محرمانه؛ از اولین تماس تا امضای سند.",
    /** دکمهٔ اصلی */
    primaryCta: { href: "/listings", label: "مشاهده آرشیو املاک" },
    /** دکمهٔ ثانویه */
    secondaryCta: { href: "/contact", label: "درخواست مشاوره اختصاصی" },
    /** نوار اعتماد زیر دکمه‌ها */
    trustItems: [
      "پرونده‌های محرمانه",
      "همراهی حقوقی کامل",
      "قیمت‌گذاری بر پایه‌ی معاملات واقعی",
    ],
    /** کارت شناور کنار هیرو */
    floatingCta: { href: "/listings", label: "مرور فایل‌های فعال ↗" },
    /** مسیر تصویر هیرو (نسبت به پوشه public) */
    image: "/images/landing/hero/banner.jpg",
  },

  /* ======================================================================== */
  /* about — سیگنال اعتماد زیر هیرو                                             */
  /* ======================================================================== */
  about: {
    eyebrow: "دفتر خصوصی املاک کرج",
    title: "معامله‌های بزرگ، بی‌سروصدا بسته می‌شوند.",
    body: "از بالاشهر تا مهرشهر — مسیر فایل‌های خصوصی از اولین بازدید تا امضای سند، محرمانه، دقیق و بدون هیاهو پیش می‌رود.",
    cta: { href: "/listings", label: "ورود به آرشیو خصوصی" },
  },

  /* ======================================================================== */
  /* nav — منوی بالای سایت                                                      */
  /* ======================================================================== */
  nav: [
    { href: "/listings", label: "آرشیو املاک" },
    { href: "/done-deals", label: "معاملات انجام‌شده" },
    { href: "/meet-the-team", label: "تیم مشاوران" },
    { href: "/services", label: "خدمات" },
    { href: "/contact", label: "تماس" },
  ],

  /* ======================================================================== */
  /* contact — اطلاعات تماس و آدرس دفتر                                         */
  /* ======================================================================== */
  contact: {
    /** ایمیل رسمی */
    email: EMAIL,
    /** تلفن نمایشی (فارسی) */
    phone: PHONE,
    /** ساعات کاری برای نمایش در صفحه تماس */
    hours: SITE_INFO.hours,
    /** هندل تلگرام بدون @ */
    telegramHandle: SITE_INFO.telegramHandle,
    address: {
      /** آدرس کامل خط اول */
      line1: ADDRESS_LINE1,
      /** خط دوم آدرس / محله */
      line2: SITE_INFO.addressLine2,
      /** استان / منطقه */
      region: REGION,
      /** شهر */
      city: CITY,
      /** کد پستی */
      postal: SITE_INFO.postal,
    },
    /** لینک‌های مسیریابی */
    maps: {
      google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS_LINE1} ${CITY}`)}`,
      waze: `https://waze.com/ul?q=${encodeURIComponent(`${ADDRESS_LINE1} ${CITY}`)}&navigate=yes`,
      neshan: SITE_INFO.mapsNeshan,
    },
  },

  /* ======================================================================== */
  /* social — شبکه‌های اجتماعی (واتس‌اپ بدون +؛ فقط ارقام بین‌المللی)            */
  /* ======================================================================== */
  social: {
    linkedin: SITE_INFO.linkedin,
    instagram: SITE_INFO.instagram,
    telegram: SITE_INFO.telegram,
    /** فقط ارقام، بدون + — کامپوننت‌ها لینک wa.me را می‌سازند */
    whatsapp: WHATSAPP_DIGITS,
  },

  /* ======================================================================== */
  /* seo — تنظیمات سئو و تصویر اشتراک‌گذاری                                     */
  /* ======================================================================== */
  seo: {
    /** آدرس کامل سایت */
    url: SITE_INFO.siteUrl,
    /** تصویر پیش‌فرض Open Graph */
    ogImage: "/images/landing/hero/banner.jpg",
    /** عنوان پیش‌فرض صفحات عمومی */
    title: SITE_INFO.seoTitle,
    /** توضیح متای پیش‌فرض */
    description: SITE_INFO.seoDescription,
  },

  /* ======================================================================== */
  /* stats — آمارهای کلی (صفحه تماس و مشابه)                                    */
  /* ======================================================================== */
  stats: [
    {
      value: 1.5,
      decimals: 1,
      suffix: "",
      label: "میلیارد دلار ارزش سبد گردانی",
      display: "۱.۵",
    },
    {
      value: 100,
      decimals: 0,
      suffix: "٪",
      label: "محرمانه بودن معاملات",
      display: "۱۰۰٪",
    },
    {
      value: 50,
      decimals: 0,
      suffix: "+",
      label: "مشاور تراز اول کشوری",
      display: "۵۰+",
    },
    {
      value: 24,
      decimals: 0,
      suffix: "/۷",
      label: "پاسخگویی اختصاصی",
      display: "۲۴/۷",
    },
  ],

  /* ======================================================================== */
  /* services — فهرست شش خدمت اصلی (کلید آیکون متنی است)                         */
  /* ======================================================================== */
  services: [
    {
      id: "sales",
      title: "خرید و فروش پنت‌هاوس و برج‌های ساختمانی",
      summary:
        "معاملات فاخر در بالاشهر کرج با دسترسی خصوصی به فایل‌های محدود و مذاکره سطح مدیریتی.",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      icon: "building" as SiteIconKey,
      features: [
        "بانک فایل اختصاصی پنت‌هاوس و اسکای‌ویو",
        "تحلیل مقایسه‌ای قیمت و نقدشوندگی",
        "هماهنگی بازدید خصوصی خارج از ساعات عمومی",
      ],
    },
    {
      id: "lease",
      title: "رهن و اجاره اختصاصی دیپلماتیک و VIP",
      summary:
        "اجاره و رهن برای سفارت‌ها، مدیران ارشد و خانواده‌های خاص با بررسی اعتبار و قرارداد امن.",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      icon: "key" as SiteIconKey,
      features: [
        "غربالگری مستأجر و تضمین اعتبار",
        "قرارداد دو زبانه برای پرونده‌های بین‌المللی",
        "مدیریت تحویل و صورت‌جلسه دارایی‌ها",
      ],
    },
    {
      id: "invest",
      title: "مدیریت سرمایه‌گذاری و تهاتر املاک کلان",
      summary:
        "طراحی پرتفوی ملکی، تهاتر دارایی‌های بزرگ و سناریوهای خروج با نگاه سرمایه‌گذاری نهادی.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      icon: "briefcase" as SiteIconKey,
      features: [
        "مدل‌سازی بازده و ریسک نقدینگی",
        "تهاتر ملک با ملک / ملک با پروژه",
        "گزارش تصمیم‌گیری برای هیئت سرمایه‌گذاری",
      ],
    },
    {
      id: "legal",
      title: "مشاوره حقوقی تخصصی و استعلامات ثبتی",
      summary:
        "بررسی سند، بازداشت، رهن و تعارضات ثبتی پیش از هر تعهد مالی برای حذف ریسک حقوقی پنهان.",
      image:
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      icon: "scale" as SiteIconKey,
      features: [
        "استعلام ثبت و وضعیت مالکیت",
        "بازبینی بندهای قرارداد پیش از امضا",
        "همراهی تا تنظیم سند رسمی",
      ],
    },
    {
      id: "appraisal",
      title: "ارزیابی و کارشناسی دقیق قیمت (هوشمند)",
      summary:
        "قیمت‌گذاری مبتنی بر معاملات اخیر، کیفیت ساخت، موقعیت و ظرفیت سرمایه‌ای ملک.",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      icon: "file-search" as SiteIconKey,
      features: [
        "گزارش کارشناسی ۴۸ ساعته",
        "تحلیل حساسیت قیمت و زمان فروش",
        "پیشنهاد استراتژی مذاکره",
      ],
    },
    {
      id: "design",
      title: "بازسازی لوکس و دیزاین اختصاصی ملک",
      summary:
        "ارتقای ارزش ملک با طراحی داخلی سطح بالا، مدیریت پیمان و نظارت زیبایی‌شناختی.",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      icon: "paintbrush" as SiteIconKey,
      features: [
        "کانسپت معماری داخلی اختصاصی",
        "بودجه‌بندی شفاف و کنترل هزینه",
        "تحویل کلیدآماده با استاندارد VIP",
      ],
    },
  ],

  /* ======================================================================== */
  /* properties — آرشیو محتوایی قدیمی (صفحه معاملات موفق از /api/deals می‌خواند) */
  /* ======================================================================== */
  properties: [
    {
      id: "fershteh-duplex",
      category: "penthouse" as const,
      title: NAME_FA,
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      details: ["۶ خواب", "استخر اختصاصی", "معامله‌شده در ۱۴۰۲"],
      location: ADDRESS_LINE1,
      valueLabel: "Luxury Penthouse",
    },
    {
      id: "niavaran-tower",
      category: "penthouse" as const,
      title: NAME_FA,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      details: ["۳۵۰ متر", "تراس گاردن", "معامله‌شده در ۱۴۰۲"],
      location: ADDRESS_LINE1,
      valueLabel: "Modern Glass Tower",
    },
    {
      id: "lavasan-villa",
      category: "villa" as const,
      title: NAME_FA,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      details: ["فرنیش کامل", "دید ۳۶۰ درجه", "معامله‌شده در ۱۴۰۳"],
      location: ADDRESS_LINE1,
      valueLabel: "Forest Villa Architecture",
    },
    {
      id: "elahieh-commercial",
      category: "commercial" as const,
      title: NAME_FA,
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      details: ["۲۰ واحد تجاری", "معامله یکجا", "معامله‌شده در ۱۴۰۳"],
      location: ADDRESS_LINE1,
      valueLabel: "Executive Commercial Complex",
    },
    {
      id: "zaferanieh-minimal",
      category: "penthouse" as const,
      title: NAME_FA,
      image:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
      details: ["پاگرد اختصاصی", "۴ پارکینگ", "معامله‌شده در ۱۴۰۳"],
      location: ADDRESS_LINE1,
      valueLabel: "Minimalist Interior Lounge",
    },
    {
      id: "mahmoudieh-mansion",
      category: "diplomatic" as const,
      title: NAME_FA,
      image:
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80",
      details: ["معماری اصیل", "حیاط مشجر", "معامله‌شده در ۱۴۰۳"],
      location: ADDRESS_LINE1,
      valueLabel: "Classical Estate",
    },
  ],

  /* ======================================================================== */
  /* agents — اعضای تیم مشاوران                                                 */
  /* ======================================================================== */
  agents: [
    {
      id: "arsham",
      name: SITE_INFO.managerNameFa,
      role: "مدیریت ارشد و استراتژیست کلان املاک",
      department: "leadership" as const,
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
      badge: "۲ میلیارد دلار حجم مدیریت سرمایه • ۱۵ سال سابقه",
      bio: "معمار استراتژی معاملات فوق‌سنگین در بالاشهر کرج؛ با تمرکز بر ساختاردهی پورتفوی‌های خصوصی و مذاکرات سطح مدیریتی.",
      philosophy:
        "هر معامله باید مثل یک اثر معماری دقیق باشد: شفاف در سازه حقوقی، محرمانه در هویت، و بی‌نقص در اجرا.",
      stats: [
        { label: "حجم معاملات هدایت‌شده", value: "$۲B+" },
        { label: "میانگین زمان جمع‌بندی", value: "۱۲ روز" },
        { label: "رضایت موکلان VIP", value: "۹۹٪" },
      ],
      phone: PHONE,
      whatsapp: WHATSAPP_DIGITS,
    },
    {
      id: "sara",
      name: "مهندس سارا رادمن",
      role: "سرپرست مشاوران آپارتمان و برج‌های گوهردشت",
      department: "penthouse" as const,
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      badge: "مشاور برتر سال ۱۴۰۲ • متخصص منطقه گوهردشت",
      bio: "متخصص آپارتمان‌های لوکس گوهردشت و عظیمیه؛ از کشف فایل‌های آف‌مارکت تا بستن واحدهای دوبلکس با استاندارد بازدید خصوصی.",
      philosophy:
        "پنت‌هاوس فقط متراژ نیست؛ ترکیب نور، حریم و نقدشوندگی است که باید دقیق قیمت‌گذاری شود.",
      stats: [
        { label: "پنت‌هاوس بسته‌شده", value: "۱۲۰+" },
        { label: "میانگین کلوزینگ", value: "۱۰ روز" },
        { label: "فایل‌های آف‌مارکت", value: "۶۵٪" },
      ],
      phone: PHONE,
      whatsapp: "989121000001",
    },
    {
      id: "kamran",
      name: "کامران شریفی",
      role: "متخصص ویلاهای فاخر ماهدشت و کمال‌شهر",
      department: "villa" as const,
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
      badge: "رکورددار فروش ۵ ویلای سوپرلوکس",
      bio: "کارشناس ویلا و باغ‌ویلا در ماهدشت، کمال‌شهر و فردیس؛ با شبکه مالکین خصوصی و مسیر فروش محرمانه.",
      philosophy:
        "ویلای فاخر را باید با داستان مکان فروخت؛ نه فقط با لیست امکانات.",
      stats: [
        { label: "ویلای سوپرلوکس", value: "۵ رکورد" },
        { label: "میانگین بازدید تا پیشنهاد", value: "۴۸ ساعت" },
        { label: "نرخ بستن معامله", value: "۹۲٪" },
      ],
      phone: PHONE,
      whatsapp: "989121000002",
    },
    {
      id: "niloufar",
      name: "دکتر نیلوفر سپهری",
      role: "رئیس دپارتمان حقوقی و استعلامات ثبتی",
      department: "legal" as const,
      image:
        "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=80",
      badge: "وکیل پایه یک دادگستری • ۰٪ ریسک حقوقی",
      bio: "مسئول پالایش حقوقی پرونده‌ها پیش از هر تعهد مالی؛ از استعلام ثبت تا بازبینی بندهای قرارداد و همراهی تا سند رسمی.",
      philosophy:
        "زیباترین معامله، معامله‌ای است که هیچ سایه حقوقی باقی نگذارد.",
      stats: [
        { label: "پرونده بدون مناقشه", value: "۰٪ ریسک" },
        { label: "استعلام تا تأیید", value: "۲۴ ساعت" },
        { label: "قراردادهای دوزبانه", value: "۸۰+" },
      ],
      phone: PHONE,
      whatsapp: "989121000003",
    },
    {
      id: "reza",
      name: "رضا محمدی",
      role: "مشاور ارشد آپارتمان‌های VIP عظیمیه",
      department: "penthouse" as const,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      badge: "نرخ رضایت ۹۹٪ مشتریان",
      bio: "تمرکز روی واحدهای VIP عظیمیه و مهرشهر با رویکرد خدمات پس از معامله و هماهنگی کامل تحویل.",
      philosophy:
        "اعتماد مشتری در جزئیات ساخته می‌شود؛ از اولین تماس تا کلیدسپاری.",
      stats: [
        { label: "رضایت مشتری", value: "۹۹٪" },
        { label: "معاملات سال جاری", value: "۴۵+" },
        { label: "میانگین کلوزینگ", value: "۹ روز" },
      ],
      phone: PHONE,
      whatsapp: "989121000004",
    },
    {
      id: "maryam",
      name: "مریم کاظمی",
      role: "استراتژیست تهاتر و معاملات دیپلماتیک",
      department: "leadership" as const,
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
      badge: "متخصص مذاکرات بین‌المللی",
      bio: "طراح ساختار تهاتر و معاملات چندطرفه برای موکلان دیپلماتیک و سرمایه‌گذاران بین‌المللی با پروتکل محرمانگی سخت.",
      philosophy:
        "در معاملات پیچیده، زبان مشترک همان شفافیت حقوقی و احترام به حریم طرفین است.",
      stats: [
        { label: "معاملات دیپلماتیک", value: "۳۰+" },
        { label: "تهاترهای ساختاریافته", value: "۱۸" },
        { label: "محرمانگی پرونده", value: "۱۰۰٪" },
      ],
      phone: PHONE,
      whatsapp: "989121000005",
    },
  ],

  /* ======================================================================== */
  /* testimonials — نظرات مشتریان (نسخهٔ صفحه معاملات موفق)                      */
  /* ======================================================================== */
  testimonials: [
    {
      quote:
        "سرعت بستن معامله شگفت‌انگیز بود؛ بدون افشای هویت و با دقت حقوقی کامل.",
      name: `مالک ${NAME_FA}`,
      role: "فروشنده · پرونده ۱۴۰۲",
    },
    {
      quote: `برای خرید ${NAME_FA} همه چیز محرمانه و حرفه‌ای پیش رفت؛ از کارشناسی تا انتقال سند.`,
      name: "خریدار بین‌المللی",
      role: "خریدار · پرونده ۱۴۰۳",
    },
    {
      quote:
        "معامله یکجای مجتمع اداری را در زمانی بستیم که بازار هنوز در حال مذاکره بود.",
      name: "مدیر سرمایه‌گذاری",
      role: `خریدار نهادی · ${CITY}`,
    },
  ],

  /* ======================================================================== */
  /* home — محتوای اختصاصی صفحهٔ اصلی                                           */
  /* ======================================================================== */
  home: {
    /** عناوین بخش «چرا ما» / ارزش‌های پیشنهادی */
    valuePropsSection: {
      eyebrow: `چرا ${NAME_FA}`,
      title: "چهار دلیل که موکلان ما را انتخاب می‌کنند",
      subtitle: "ملک خوب پیدا می‌شود. معامله‌ی درست، ساخته می‌شود.",
    },
    /** نشان‌های اعتماد زیر هیرو */
    trustStats: [
      { value: "۱۸۰+", label: "معامله بسته‌شده", hint: "از ویلا تا دفتر اداری" },
      { value: "۲۵۰ میلیارد", label: "حجم هدایت‌شده", hint: "به تومان، در کرج" },
      { value: "۸ سال", label: "حضور پیوسته", hint: "در بازار املاک کرج" },
      { value: "۱۰۰٪", label: "محرمانگی پرونده", hint: "بدون انتشار عمومی" },
    ],
    /** محله‌هایی که در پس‌زمینهٔ سیگنال شناورند */
    signalNeighborhoods: [
      "گوهردشت",
      "مهرشهر",
      "عظیمیه",
      "جهانشهر",
      "باغستان",
      "فردیس",
      "شاهین‌ویلا",
      "حصارک",
    ],
    valueProps: [
      {
        id: "off-market",
        title: "دسترسی آف‌مارکت",
        subtitle: "فایل‌هایی که جای دیگری نمی‌بینید.",
        description:
          "بخش بزرگی از ملک‌های خوب کرج قبل از رسیدن به پورتال‌ها و سایت‌های آگهی معامله می‌شوند. مالکان ترجیح می‌دهند اسمشان و ملکشان دیده نشود. آن فایل‌ها از مسیر ما می‌گذرند.",
        image: "/images/landing/features/archive.jpg",
      },
      {
        id: "valuation",
        title: "قیمت‌گذاری واقعی",
        subtitle: "عدد باید از دل معامله بیاید، نه از دل آگهی.",
        description:
          "قیمت‌های درخواستی آگهی‌ها معیار نیستند. ما با سابقه‌ی معاملات واقعی هر محله و داده‌ی روز بازار، ارزش دقیق ملک را مشخص می‌کنیم. نه گران‌فروشی که فایل بسوزد، نه ارزان‌فروشی که سرمایه‌تان هدر برود.",
        image: "/images/landing/categories/penthouse.jpg",
      },
      {
        id: "legal",
        title: "پشتیبانی حقوقی",
        subtitle: "از مبایعه‌نامه تا انتقال سند، بدون نگرانی.",
        description:
          "قراردادها زیر نظر وکلای پایه‌یک دادگستری تنظیم می‌شوند. استعلامات، بررسی سند و شرایط مالکیت پیش از هر تعهدی بررسی می‌شود؛ تا معامله فقط روی کاغذ محکم نباشد، در عمل هم محکم باشد.",
        image: "/images/landing/categories/commercial.jpg",
      },
      {
        id: "investment",
        title: "استراتژی سرمایه",
        subtitle: "ملک فقط خرید نیست، تصمیم مالی است.",
        description:
          "کاربری، بازده، نقدشوندگی و مسیر خروج را قبل از خرید بررسی می‌کنیم. اگر هدف شما رشد سرمایه است، ملک را با همان نگاه انتخاب می‌کنیم.",
        image: "/images/landing/categories/villa.jpg",
      },
    ],
    featuredCategories: [
      {
        id: "penthouse",
        title: "آپارتمان‌ها و برج‌های لوکس",
        description: "ارتفاع، ویوی باز و امکانات در سطح هتل. برای کسانی که کرج را از بالا دوست دارند.",
        locations: "کرج · خیابان هدایتکار",
        image: "/images/landing/categories/penthouse.jpg",
        href: "/listings",
      },
      {
        id: "villa",
        title: "ویلاهای مدرن و باغ‌ویلاها",
        description: "باغ، حریم و آرامش؛ در ماهدشت، کمال‌شهر و فردیس. برای زندگی، نه فقط سرمایه‌گذاری.",
        locations: "کرج · خیابان هدایتکار",
        image: "/images/landing/categories/villa.jpg",
        href: "/listings",
      },
      {
        id: "commercial",
        title: "مستغلات و پروژه‌های تجاری",
        description: "دفاتر، مجتمع‌های اداری و املاک درآمدزا با بازده مشخص و مسیر خروج روشن.",
        locations: "کرج · خیابان هدایتکار",
        image: "/images/landing/categories/commercial.jpg",
        href: "/listings",
      },
    ],
    clientLogos: [
      "/assets/logos/client-1.svg",
      "/assets/logos/client-2.svg",
      "/assets/logos/client-3.svg",
      "/assets/logos/client-4.svg",
      "/assets/logos/client-5.svg",
      "/assets/logos/client-6.svg",
    ],
    personas: [
      {
        id: "buyers",
        title: "خریداران VIP",
        description:
          "گزینه‌های گزیده، اعداد شفاف و معامله‌ای که تا انتها پایدار بماند.",
        image: "/assets/images/persona-buyers.webp",
      },
      {
        id: "sellers",
        title: "مالکان و فروشندگان",
        description:
          "قیمت درست، خریدار جدی و پرونده‌ای که واقعاً به قرارداد برسد.",
        image: "/assets/images/persona-sellers.webp",
      },
      {
        id: "tenants",
        title: "مستأجران حرفه‌ای",
        description:
          "فضایی هم‌تراز کسب‌وکار شما و شروطی که شفاف و قابل اتکا باشد.",
        image: "/assets/images/persona-tenants.webp",
      },
      {
        id: "landlords",
        title: "سرمایه‌گذاران ملکی",
        description:
          "جریان اجاره پایدار و مستأجرانی که اعتبارشان قابل اتکا باشد.",
        image: "/assets/images/persona-landlords.webp",
      },
    ],
    /** معاملات کوتاه صفحهٔ اصلی */
    deals: [
      {
        id: "church",
        area: "ماهدشت",
        size: "۴۵۰ متر",
        title: "ویلای ۴۵۰ متری، ماهدشت",
        status: "فروخته‌شد" as const,
        image: "/images/landing/hero/banner.jpg",
      },
      {
        id: "lower-main",
        area: "کمال‌شهر",
        size: "۸۵۰ متر",
        title: "باغ‌ویلای ۸۵۰ متری، کمال‌شهر",
        status: "فروخته‌شد" as const,
        image: "/images/landing/categories/villa.jpg",
      },
      {
        id: "silo",
        area: "هدایتکار",
        size: "۲۲۰ متر",
        title: "دفتر اداری ۲۲۰ متری، هدایتکار",
        status: "اجاره داده شد" as const,
        image: "/images/landing/categories/penthouse.jpg",
      },
      {
        id: "buitengracht",
        area: "گوهردشت",
        size: "۳۸۰ متر",
        title: "آپارتمان ۳۸۰ متری، گوهردشت",
        status: "فروخته‌شد" as const,
        image: "/images/landing/hero/side.jpg",
      },
      {
        id: "loop",
        area: "مرکز کرج",
        title: "مجتمع تجاری، مرکز کرج",
        status: "اجاره داده شد" as const,
        image: "/images/landing/categories/commercial.jpg",
      },
      {
        id: "burg",
        area: "مهرشهر",
        size: "۱۶۰ متر",
        title: "واحد اداری ۱۶۰ متری، مهرشهر",
        status: "اجاره داده شد" as const,
        image: "/images/landing/features/archive.jpg",
      },
    ],
    laws: [
      {
        statement:
          "معامله‌ای که ۹۹٪ پیش رفته، هنوز تمام نشده. همان ۱٪ آخر، همه‌چیز را تعیین می‌کند.",
      },
      {
        statement:
          "سرمایه‌گذاری در گوهردشت با سرمایه‌گذاری در حاشیه‌ی شهر یکی نیست. استراتژی با محله عوض می‌شود.",
      },
      {
        statement:
          "مشاور خوب فقط ویو و اطراف را نمی‌گوید؛ کاربری، بازده و مسیر خروج را هم می‌داند.",
      },
      {
        statement:
          "اگر برای دیدن منظره باید از پنجره خم شوید، آن منظره نیست. ویوی خوب به تخیل نیاز ندارد.",
      },
      {
        statement: "کار موکل، کار عمومی نیست. محرمانگی بخشی از خدمت است، نه امتیاز اضافه.",
      },
      {
        statement:
          "قراردادی که نفهمیده‌اید، ملکی است که نخریده‌اید. ارزش واقعی در ریزنویس است.",
      },
      {
        statement: "گران‌ترین اشتباه عجله است، و بعد از آن تردید بیش از حد.",
      },
      {
        statement: "اعتماد معامله را می‌سازد؛ قرارداد از آن محافظت می‌کند.",
      },
      {
        statement:
          "بیشتر معاملات سر قیمت به هم نمی‌خورند؛ سر انتظارهای ناهماهنگ به هم می‌خورند.",
      },
      {
        statement:
          "«عجله‌ای ندارم» معمولاً یعنی «با این قیمت نه». زمان هم قیمت دارد.",
      },
      {
        statement:
          "قیمت بدون محله فقط یک عدد است. مقایسه بدون زمینه، شایعه است.",
      },
      {
        statement:
          "هیچ‌وقت بروشور را از خود ملک قشنگ‌تر نکنید. بازدید حضوری همیشه برنده است.",
      },
    ],
    offMarketCta: {
      title: "خیلی از فرصت‌ها را عمداً منتشر نمی‌کنیم.",
      body: "همه‌چیز در آگهی‌های عمومی نیست، و این عمدی است. پورتال‌ها مفیدند و ما هم از آن‌ها استفاده می‌کنیم؛ اما بهترین فرصت‌ها معمولاً آف‌مارکت و خصوصی معرفی می‌شوند. بگویید دنبال چه هستید؛ ما فایل مناسب را پیش از انتشار عمومی نشانتان می‌دهیم.",
      cta: { href: "/contact", label: "درخواست دسترسی اختصاصی ↗" },
      image: "/images/landing/hero/side.jpg",
    },
    dealsFootnote: "هر عدد، یک امضای واقعی پای قرارداد است.",
    brandsEyebrow: "برندها و مجموعه‌هایی که به ما اعتماد کرده‌اند",
  },

  /* ======================================================================== */
  /* footer — متن‌ها و لینک‌های فوتر                                              */
  /* ======================================================================== */
  footer: {
    /** عنوان CTA بزرگ */
    ctaTitle: "آماده‌اید معامله‌ی بعدی‌تان را متفاوت تجربه کنید؟",
    /** دکمهٔ اول CTA */
    ctaPrimary: { href: "/contact", label: "درخواست مشاوره اختصاصی" },
    /** دکمهٔ دوم CTA */
    ctaSecondaryLabel: "ارتباط مستقیم با مدیریت",
    /** متن وضعیت دفتر */
    statusBadge: `دفتر مرکزی ${CITY} · پاسخگوی متقاضیان VIP`,
    /** عنوان خبرنامه */
    newsletterEyebrow: "خبرنامه",
    newsletterTitle: "فایل‌های محرمانه، قبل از همه",
    newsletterBody:
      "فقط برای موکلان تأییدشده: اعلان پروژه‌های آف‌مارکت، ویلاها و آپارتمان‌های محدود و فرصت‌های سرمایه‌گذاری خصوصی.",
    newsletterPlaceholder: "ایمیل یا شماره موبایل",
    newsletterSuccess:
      "درخواست شما ثبت شد. فایل‌های محرمانه به‌زودی ارسال می‌شود.",
    newsletterLabel: "ایمیل یا شماره موبایل",
    /** ستون‌های لینک */
    columns: {
      brand: {
        title: "دسترسی سریع",
        links: [
          { href: "/", label: "صفحه اصلی" },
          { href: "/contact", label: "درباره ما" },
          { href: "/meet-the-team", label: "تیم مشاوران" },
          { href: "/listings", label: "آرشیو املاک فعال" },
          { href: "/done-deals", label: "معاملات انجام‌شده" },
        ],
      },
      services: {
        title: "خدمات",
        links: [
          { href: "/services", label: "خرید و فروش ویلا و آپارتمان لوکس" },
          { href: "/services", label: "رهن و اجاره‌ی ویژه" },
          { href: "/services", label: "مشاوره حقوقی" },
          { href: "/services", label: "ارزیابی و قیمت‌گذاری" },
        ],
      },
      panels: {
        title: "پنل‌ها",
        links: [
          { href: "/login", label: "ورود مشاوران" },
          { href: "/admin/dashboard", label: "ورود مدیر" },
          { href: "/admin/properties/new", label: "ثبت ملک جدید" },
        ],
      },
      legal: {
        title: "حقوقی",
        links: [
          { href: "/privacy", label: "قوانین محرمانگی" },
          { href: "/terms", label: "شرایط استفاده" },
        ],
      },
      socialTitle: "شبکه‌ها و ارتباطات",
    },
    /** لینک‌های شبکه — icon کلید متنی است */
    socialLinks: [
      {
        href: SITE_INFO.instagram,
        label: "اینستاگرام لوکس",
        icon: "instagram" as SiteIconKey,
      },
      {
        href: SITE_INFO.telegram,
        label: "تلگرام فایل‌های VIP",
        icon: "send" as SiteIconKey,
      },
      {
        href: `https://wa.me/${WHATSAPP_DIGITS}`,
        label: "واتس‌اپ",
        icon: "message-circle" as SiteIconKey,
      },
      {
        href: SITE_INFO.linkedin,
        label: "لینکدین",
        icon: "linkedin" as SiteIconKey,
      },
    ],
    /** متن کپی‌رایت — سال را در صورت نیاز عوض کنید */
    copyright: `© ۲۰۲۶ تمامی حقوق برای ${NAME_FA} محفوظ است.`,
    privacyNote: "پروتکل محرمانگی VIP برای تمام پرونده‌ها فعال است",
    backToTop: "بازگشت به بالا",
    clockLabel: "ساعت ایران",
  },

  /* ======================================================================== */
  /* videoTour — بخش تور ویدیویی صفحهٔ اصلی                                     */
  /* ======================================================================== */
  videoTour: {
    badge: "تور سینمایی املاک درخشان",
    title: "تجربه بصری ملک، هم‌زمان با حرکت شما",
    liveBadge: "پخش زنده تور اختصاصی",
    caption: "از نقطه کوچک تا قاب کامل — فقط با اسکرول.",
    videoSrc: "/videos/hero-video.mp4",
    poster: "/assets/images/hero-mobile.webp",
  },

  /* ======================================================================== */
  /* contactPage — محتوای صفحهٔ تماس                                            */
  /* ======================================================================== */
  contactPage: {
    seoTitle: "ارتباط VIP",
    seoDescription:
      "صفحه ارتباط لوکس — پشتیبانی VIP، جلسه حضوری، کارشناسی ملک و مشاوره حقوقی با زیبایی‌شناسی آیس‌اسکای.",
    hero: {
      badge: "تیم پشتیبانی VIP - فعال و پاسخگوی آنلاین",
      title: `ارتباط با سرآغاز معمارانه‌ای نو در ${SITE_INFO.shortNameFa}`,
      subtitle:
        "تجربه‌ای سینمایی از ارتباط با دپارتمان لوکس؛ از مشاوره معماری و سرمایه‌گذاری تا هماهنگی جلسات VIP و پشتیبانی حقوقی اختصاصی.",
      primaryCta: "شروع ارتباط VIP",
    },
    gallerySection: {
      eyebrow: "گالری معماری",
      title: "فضاهایی که برای ملاقات‌های خاص طراحی شده‌اند",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
        alt: "معماری پنت‌هاوس مدرن",
        tag: `دفتر مرکزی ${CITY}`,
        className: "md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[520px]",
      },
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        alt: "طراحی داخلی مینیمال",
        tag: "سالن کنفرانس VIP",
        className: "min-h-[220px] md:min-h-[250px]",
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        alt: "فضای مشاوره اجرایی",
        tag: "لانژ مشاوره اختصاصی",
        className: "min-h-[220px] md:min-h-[250px]",
      },
    ],
    formTabs: [
      { id: "vip" as const, label: "جلسه حضوری VIP", icon: "calendar-clock" as SiteIconKey },
      {
        id: "appraisal" as const,
        label: "کارشناسی برج و ملک",
        icon: "file-search" as SiteIconKey,
      },
      { id: "legal" as const, label: "مشاوره حقوقی", icon: "scale" as SiteIconKey },
    ],
    budgetOptions: [
      "کمتر از ۲۰ میلیارد تومان",
      "۲۰ تا ۵۰ میلیارد تومان",
      "۵۰ تا ۱۰۰ میلیارد تومان",
      "بیش از ۱۰۰ میلیارد تومان",
      "پورتفوی سرمایه‌گذاری بدون سقف",
    ],
    hubCards: [
      {
        id: "phone",
        title: "خط مستقیم VIP",
        detail: PHONE,
        href: `tel:${PHONE.replace(/\s/g, "")}`,
        icon: "phone" as SiteIconKey,
        meta: "پاسخگویی فوری در ساعات کاری",
      },
      {
        id: "maps",
        title: "مسیریابی دفتر مرکزی",
        detail: `${ADDRESS_LINE1} · ${CITY}`,
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS_LINE1} ${CITY}`)}`,
        icon: "navigation" as SiteIconKey,
        meta: "Google Maps · Waze · نشان",
      },
      {
        id: "telegram",
        title: "ارتباط تلگرام",
        detail: `@${SITE_INFO.telegramHandle}`,
        href: SITE_INFO.telegram,
        icon: "message-circle" as SiteIconKey,
        meta: "پیام‌رسانی امن برای مشتریان خاص",
      },
      {
        id: "hours",
        title: "ساعات پذیرش",
        detail: SITE_INFO.hours,
        href: "#branch",
        icon: "clock" as SiteIconKey,
        meta: "جلسات مدیریتی با هماهنگی قبلی",
      },
    ],
    navLinks: [
      {
        label: "Waze",
        href: `https://waze.com/ul?q=${encodeURIComponent(`${ADDRESS_LINE1} ${CITY}`)}&navigate=yes`,
      },
      {
        label: "Google Maps",
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS_LINE1} ${CITY}`)}`,
      },
      {
        label: "نشان",
        href: SITE_INFO.mapsNeshan,
      },
      { label: "تماس", href: `tel:${PHONE.replace(/\s/g, "")}` },
      { label: "تلگرام", href: SITE_INFO.telegram },
    ],
    routeSteps: [
      "ورود از خیابان هدایتکار، جنب فروشگاه افق کوروش",
      "استفاده از پارکینگ VIP در طبقه منفی یک",
      "ورود به لابی و اعلام نام به پذیرش اختصاصی",
      "هدایت به سالن کنفرانس یا اتاق مشاوره",
    ],
    faqs: [
      {
        q: "فرآیند خریدهای غیرحضوری چگونه است؟",
        a: "پس از احراز هویت دیجیتال، تور مجازی اختصاصی، بررسی حقوقی آنلاین و امضای قرارداد در بستر امن انجام می‌شود. نماینده حقوقی شما در تمام مراحل حضور دارد.",
      },
      {
        q: "شرایط رزرو جلسه با مدیریت ارشد چیست؟",
        a: "جلسات مدیریت ارشد برای پرتفوی‌های خاص و معاملات استراتژیک رزرو می‌شود. از طریق تب «جلسه حضوری VIP» درخواست دهید تا هماهنگ‌کننده زمان را تأیید کند.",
      },
      {
        q: "آیا کارشناسی برج و ملک شامل گزارش رسمی است؟",
        a: "بله. گزارش کارشناسی شامل تحلیل مقایسه‌ای منطقه، کیفیت ساخت، نقدشوندگی و بازه قیمت پیشنهادی است و ظرف ۴۸ ساعت کاری ارائه می‌شود.",
      },
      {
        q: "محرمانگی اطلاعات مشتریان چگونه تضمین می‌شود؟",
        a: "تمام پرونده‌ها در فضای امن داخلی نگه‌داری می‌شوند؛ دسترسی فقط برای تیم اختصاصی معامله فعال است و هیچ اطلاعات هویتی بدون مجوز شما منتشر نمی‌شود.",
      },
    ],
  },

  /* ======================================================================== */
  /* servicesPage — محتوای صفحهٔ خدمات                                          */
  /* ======================================================================== */
  servicesPage: {
    seoTitle: "خدمات VIP",
    seoDescription:
      `خدمات جامع ${SITE_INFO.productNameFa} — خرید و فروش پنت‌هاوس، اجاره VIP، سرمایه‌گذاری، حقوقی، کارشناسی و بازسازی لوکس.`,
    hero: {
      badge: "ارائه‌دهنده خدمات سطح الف (Class-A Standards)",
      title: "خدمات جامع و متمایز در والاترین سطح املاک کشور",
      subtitle:
        "مدیریت VIP املاک، ایمنی سرمایه‌گذاری و تعالی معماری — از اولین مشاوره تا انتقال سند، در یک مسیر یکپارچه و محرمانه.",
      primaryCta: "مشاهده خدمات",
      secondaryCta: "درخواست مشاوره VIP",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80",
    },
    gridSection: {
      eyebrow: "شش ستون خدمات",
      title: "خدمات تخصصی برای معاملات و دارایی‌های خاص",
    },
    /** عناوین جدول مقایسه بازار / VIP */
    comparisonSection: {
      eyebrow: "مقایسه خدمات",
      title: `استاندارد بازار در برابر خدمات VIP ${NAME_FA}`,
      standardColumn: "بازار استاندارد",
      vipColumn: `${NAME_FA} VIP`,
    },
    /** alt تصویر هیرو خدمات */
    heroImageAlt: `معماری لوکس خدمات ${NAME_FA}`,
    steps: [
      {
        title: "مشاوره و نیازسنجی اولیه",
        body: "جلسه کشف اهداف، بودجه، افق زمانی و ترجیحات سبک زندگی یا سرمایه‌گذاری.",
        icon: "sparkles" as SiteIconKey,
      },
      {
        title: "کارشناسی فنی و حقوقی",
        body: "بازدید تخصصی، ارزیابی قیمت و استعلامات ثبتی پیش از هر پیشنهاد جدی.",
        icon: "file-search" as SiteIconKey,
      },
      {
        title: "برگزاری نشست VIP",
        body: "نشست خصوصی مذاکره، تطبیق پیشنهادات و تصمیم‌گیری در فضای اختصاصی دفتر.",
        icon: "calendar-check" as SiteIconKey,
      },
      {
        title: "پشتیبانی و انتقال سند",
        body: "هماهنگی محضر، انتقال امن مالکیت و پیگیری پس از معامله تا تحویل نهایی.",
        icon: "shield" as SiteIconKey,
      },
    ],
    comparison: [
      {
        feature: "دسترسی به فایل‌های محدود و آف‌مارکت",
        standard: false as const,
        vip: true as const,
      },
      {
        feature: "پشتیبانی حقوقی ۲۴/۷ در معاملات فعال",
        standard: false as const,
        vip: true as const,
      },
      {
        feature: "تضمین قرارداد بدون ریسک بندهای مبهم",
        standard: false as const,
        vip: true as const,
      },
      {
        feature: "لانژ خصوصی برای امضا و انتقال",
        standard: false as const,
        vip: true as const,
      },
      {
        feature: "گزارش کارشناسی ظرف ۴۸ ساعت",
        standard: "محدود" as const,
        vip: true as const,
      },
      {
        feature: "مدیر اختصاصی پرونده تا پایان معامله",
        standard: false as const,
        vip: true as const,
      },
      {
        feature: "بازدید عمومی در ساعات اداری",
        standard: true as const,
        vip: true as const,
      },
    ],
    calculatorServices: [
      { id: "sales", label: "خرید / فروش", rate: 0.015 },
      { id: "lease", label: "رهن و اجاره VIP", rate: 0.01 },
      { id: "appraisal", label: "کارشناسی قیمت", rate: 0.004 },
      { id: "legal", label: "مشاوره حقوقی", rate: 0.006 },
      { id: "invest", label: "سرمایه‌گذاری / تهاتر", rate: 0.012 },
      { id: "design", label: "بازسازی لوکس", rate: 0.08 },
    ],
    testimonials: [
      {
        quote:
          "از نیازسنجی تا انتقال سند، همه چیز مثل یک پروتکل خصوصی پیش رفت؛ بدون هیاهوی بازار و با دقت حقوقی کامل.",
        name: "آریا ک.",
        role: `سرمایه‌گذار · ${CITY}`,
      },
      {
        quote:
          "برای اجاره دیپلماتیک به قرارداد دو زبانه و غربالگری اعتبار نیاز داشتیم. تیم درخشان دقیق و محرمانه عمل کرد.",
        name: "سارا م.",
        role: "مدیر روابط بین‌الملل",
      },
      {
        quote:
          "گزارش کارشناسی‌شان مبنای مذاکره ما شد؛ اختلاف قیمت را با داده بستیم، نه حدس.",
        name: "نیما ر.",
        role: `خانواده مالک · ${CITY}`,
      },
    ],
    faqs: [
      {
        q: "ضمانت خدمات و پیگیری پس از معامله چگونه است؟",
        a: "تا تحویل نهایی و رفع نواقص قراردادی همراه شما می‌مانیم. برای پرونده‌های VIP پشتیبانی حقوقی پس از امضا نیز فعال می‌ماند.",
      },
      {
        q: "مسئولیت حقوقی قراردادها با چه کسی است؟",
        a: "تیم حقوقی داخلی پیش‌نویس و بندها را بررسی می‌کند؛ مسئولیت امضا با طرفین است، اما هیچ بندی بدون تأیید شفافیت حقوقی پیش نمی‌رود.",
      },
      {
        q: "پروتکل محرمانگی اطلاعات چگونه اجرا می‌شود؟",
        a: "پرونده‌ها فقط در دسترس تیم اختصاصی معامله است. هویت، آدرس و جزئیات مالی بدون مجوز کتبی شما منتشر نمی‌شود.",
      },
      {
        q: "آیا امکان دریافت چند خدمت به‌صورت یکپارچه وجود دارد؟",
        a: "بله. خرید، کارشناسی، حقوقی و بازسازی می‌توانند در یک پرونده واحد با مدیر اختصاصی هماهنگ شوند.",
      },
    ],
  },

  /* ======================================================================== */
  /* doneDealsPage — محتوای صفحهٔ معاملات موفق                                   */
  /* ======================================================================== */
  doneDealsPage: {
    seoTitle: `معاملات موفق | ${NAME_FA}`,
    seoDescription:
      `کارنامه معاملات موفق ${NAME_FA} — ویلا، آپارتمان و واحدهای منتخب بالاشهر کرج با پیگیری تا تحویل.`,
    hero: {
      badge: "ثبت رکورد گران‌ترین پنت‌هاوس معامله‌شده سال",
      title: `کارنامه ${SITE_INFO.shortNameFa}؛ گزیده‌ای از برترین معاملات انجام‌شده`,
      subtitle:
        "تجربه‌ای سینمایی از پرونده‌های بسته‌شده؛ با عمق بصری پارالاکس، محرمانگی کامل و استاندارد حقوقی سخت‌گیرانه.",
      primaryCta: "مشاهده پرونده‌ها",
      secondaryCta: "مشاوره فروش محرمانه",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=80",
    },
    filters: [
      { id: "all" as const, label: "همه معاملات" },
      { id: "penthouse" as const, label: "پنت‌هاوس و برج‌ها" },
      { id: "villa" as const, label: "ویلایی و مستغلات" },
      { id: "commercial" as const, label: "املاک اداری/تجاری" },
      { id: "diplomatic" as const, label: "معاملات دیپلماتیک" },
    ],
    timeline: [
      {
        year: "۱۴۰۱",
        title: "افتتاح مسیر معاملات محرمانه VIP",
        body: "راه‌اندازی پروتکل انتقال خصوصی برای پرونده‌های بالای سقف عمومی بازار.",
      },
      {
        year: "۱۴۰۲",
        title: NAME_FA,
        body: "بستن معامله دوبلکس ۸۰۰ متری با کارشناسی کامل سند و تحویل بدون حاشیه.",
      },
      {
        year: "۱۴۰۲",
        title: NAME_FA,
        body: "انتقال مالکیت واحدهای منتخب برج‌باغ با ساختار حقوقی چندلایه.",
      },
      {
        year: "۱۴۰۳",
        title: NAME_FA,
        body: "خرید یکجای ۲۰ واحد تجاری برای سرمایه‌گذار نهادی در کمتر از سه هفته.",
      },
      {
        year: "۱۴۰۳",
        title: NAME_FA,
        body: "تکمیل عمارت کلاسیک با قرارداد دوزبانه و محرمانگی کامل هویت طرفین.",
      },
    ],
    metrics: [
      { icon: "clock" as SiteIconKey, value: "۱۴ روز", label: "میانگین زمان فروش" },
      {
        icon: "file-check" as SiteIconKey,
        value: "۱۰۰٪",
        label: "اصالت سند و کارشناسی",
      },
      { icon: "trophy" as SiteIconKey, value: "۸۵۰+", label: "معامله موفق" },
      {
        icon: "scale" as SiteIconKey,
        value: "۰٪",
        label: "پرونده حقوقی / مناقشه",
      },
    ],
  },

  /* ======================================================================== */
  /* teamPage — محتوای صفحهٔ تیم مشاوران                                         */
  /* ======================================================================== */
  teamPage: {
    seoTitle: "تیم مشاوران",
    seoDescription:
      `آشنایی با نخبگان ${SITE_INFO.productNameFa} — مدیریت ارشد، مشاوران پنت‌هاوس، کارشناسان ویلا و دپارتمان حقوقی با استاندارد VIP.`,
    hero: {
      badge: "اعضای تاییدشده انجمن بین‌المللی مشاوران VIP",
      title: "معماران اعتماد؛ زبده‌ترین نخبگان صنعت املاک کشور",
      subtitle:
        "تیمی از استراتژیست‌ها، مشاوران پنت‌هاوس و حقوقدانان ثبتی که مذاکره سخت، حریم خصوصی و تسلط معماری را در یک استاندارد واحد جمع کرده‌اند.",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=80",
    },
    filtersSection: {
      eyebrow: "دپارتمان‌ها",
      title: "فیلتر اعضای تیم",
    },
    filters: [
      { id: "all" as const, label: "همه اعضا" },
      { id: "leadership" as const, label: "مدیریت ارشد" },
      { id: "penthouse" as const, label: "مشاوران پنت‌هاوس و برج" },
      { id: "villa" as const, label: "کارشناسان ویلا و مستغلات" },
      { id: "legal" as const, label: "امور حقوقی و ثبتی" },
    ],
    standards: [
      {
        icon: "badge-check" as SiteIconKey,
        title: "۱۰۰٪ اصالت و احراز هویت مشاوران",
        body: "هر عضو تیم با مدارک حرفه‌ای و سابقه قابل‌استعلام وارد پرونده موکل می‌شود.",
      },
      {
        icon: "shield-check" as SiteIconKey,
        title: "تعهد به محرمانگی خریدار و فروشنده",
        body: "هویت، بودجه و جزئیات مذاکره فقط در حلقه اختصاصی پرونده در گردش است.",
      },
      {
        icon: "briefcase" as SiteIconKey,
        title: "داده‌های هوشمند بازار",
        body: "تصمیم‌ها بر پایه معاملات اخیر، نقدشوندگی محله و ظرفیت سرمایه‌ای ملک گرفته می‌شود.",
      },
    ],
    /** alt تصویر هیرو تیم */
    heroImageAlt: `تیم نخبگان ${NAME_FA}`,
    /** دعوت به همکاری */
    career: {
      badge: "دعوت به همکاری از نخبگان",
      title: `آیا شما هم یک مشاور تراز اول هستید؟ به تیم نخبگان ${NAME_FA} بپیوندید.`,
      body: "اگر در مذاکره، تحلیل بازار یا ساختار حقوقی معاملات لوکس تراز اول هستید، پرونده همکاری خود را ارسال کنید.",
      primaryCta: "ارسال درخواست همکاری",
      secondaryCtaPrefix: "ایمیل جذب استعداد:",
    },
  },

  /* ======================================================================== */
  /* panels — عناوین پنل ادمین / مشاور / ورود (محیط دمو)                        */
  /* ======================================================================== */
  panels: {
    /** عنوان متادیتای صفحه ورود */
    loginTitle: "ورود",
    /** توضیح متادیتای صفحه ورود */
    loginDescription:
      "ورود به پنل دفتر برای مدیریت املاک، مشتریان، بازدیدها و معاملات.",
    /** عنوان پنل مشاور */
    agentTitle: "پنل مشاور",
    /** عنوان پنل مدیریت */
    adminTitle: "پنل مدیریت",
    /** عنوان تکمیل پروفایل مشتری */
    clientTitle: "تکمیل پروفایل مشتری",
    /** برچسب کنار نام در شل مشاور وقتی سشن نیست */
    agentShellFallback: "CRM اختصاصی",
    /** alt تصویر هیرو لاگین */
    loginHeroAlt: "نمای معماری لوکس املاک",
    /** دامنهٔ عمومی پیش‌فرض فرم تنظیمات */
    publicDomain: SITE_INFO.siteUrl,
    /** ایمیل‌های دمو ورود (فقط آزمایشی) */
    demoAdminEmail: SITE_INFO.adminEmail,
    demoAgentEmail: SITE_INFO.agentEmail,
    /** محله‌های پیشنهادی فرم آنبوردینگ مشتری */
    neighborhoods: [
      "گوهردشت",
      "مهرشهر",
      "عظیمیه",
      "کمال‌شهر",
      "ماهدشت",
      "فردیس",
      "هدایتکار",
      "مرکز کرج",
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** ساخت لینک واتس‌اپ از ارقام بدون + */
export function whatsappUrl(digits: string = siteConfig.social.whatsapp) {
  return `https://wa.me/${digits}`;
}
