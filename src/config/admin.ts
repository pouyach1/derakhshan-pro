export type ContactRole = "Realtor" | "Builder" | "Client";

export type Contact = {
  id: string;
  name: string;
  role: ContactRole;
  city: string;
  avatar: string;
};

export type FeaturedProperty = {
  id: string;
  title: string;
  address: string;
  area: string;
  price: string;
  badge: string;
  image: string;
  highlights: string[];
  agent: Pick<Contact, "name" | "role" | "avatar"> & { roleLabel: string };
};

export type ViewedProperty = {
  id: string;
  title: string;
  location: string;
  image: string;
  rooms: string;
  size: string;
  finish: string;
  price: string;
  pricePerMeter: string;
  neighborhoodAvg: string;
  usage: string;
  views: string;
};

export type PropertyStatus = "published" | "draft" | "archived";

export type ManagedProperty = {
  id: string;
  code: string;
  title: string;
  location: string;
  price: string;
  image: string;
  status: PropertyStatus;
  views: string;
  category: "apartment" | "villa" | "commercial";
  listingType: "sale" | "rent";
};

export type LeadStatus = "new" | "contacted" | "viewing" | "closed";

export type Lead = {
  id: string;
  clientName: string;
  phone: string;
  propertyTitle: string;
  date: string;
  status: LeadStatus;
};

export type AgentStats = {
  id: string;
  name: string;
  role: "Realtor";
  city: string;
  avatar: string;
  listedProperties: number;
  dealsClosed: number;
  commission: string;
};

/** Local admin media pipeline under /public/images/admin */
const media = {
  hero: {
    drake: "/images/admin/hero/drake-chenaran.jpg",
    niavaran: "/images/admin/hero/niavaran-penthouse.jpg",
    lavasan: "/images/admin/hero/lavasan-villa.jpg",
    vanak: "/images/admin/hero/vanak-office.jpg",
  },
  property: {
    lavasan: "/images/admin/properties/lavasan-duplex.jpg",
    fereshteh: "/images/admin/properties/fereshteh-apt.jpg",
    zaferanieh: "/images/admin/properties/zaferanieh-penthouse.jpg",
    saadatabad: "/images/admin/properties/saadatabad.jpg",
    jordan: "/images/admin/properties/jordan-renovated.jpg",
    mirdamad: "/images/admin/properties/mirdamad-office.jpg",
  },
  avatar: {
    arash: "/images/admin/avatars/arash-shayegan.jpg",
    maryam: "/images/admin/avatars/maryam-farhadi.jpg",
    kaveh: "/images/admin/avatars/kaveh-moradi.jpg",
    negar: "/images/admin/avatars/negar-mohammadi.jpg",
    sina: "/images/admin/avatars/sina-kazemi.jpg",
    leila: "/images/admin/avatars/leila-akbari.jpg",
    sara: "/images/admin/avatars/sara-nouri.jpg",
    hamid: "/images/admin/avatars/hamid-rostami.jpg",
    nazanin: "/images/admin/avatars/nazanin-ghasemi.jpg",
    pouya: "/images/admin/avatars/pouya-sharifi.jpg",
    hanieh: "/images/admin/avatars/hanieh-mousavi.jpg",
    behnam: "/images/admin/avatars/behnam-akbari.jpg",
  },
} as const;

export const ADMIN_CONTACTS: Contact[] = [
  {
    id: "c1",
    name: "مهندس آرش شایگان",
    role: "Realtor",
    city: "تهران",
    avatar: media.avatar.arash,
  },
  {
    id: "c2",
    name: "نگار محمدی",
    role: "Builder",
    city: "تهران",
    avatar: media.avatar.negar,
  },
  {
    id: "c3",
    name: "سینا کاظمی",
    role: "Client",
    city: "اصفهان",
    avatar: media.avatar.sina,
  },
  {
    id: "c4",
    name: "مریم فرهادی",
    role: "Realtor",
    city: "تهران",
    avatar: media.avatar.maryam,
  },
  {
    id: "c5",
    name: "بهنام اکبری",
    role: "Builder",
    city: "شیراز",
    avatar: media.avatar.behnam,
  },
  {
    id: "c6",
    name: "سارا نوری",
    role: "Client",
    city: "تهران",
    avatar: media.avatar.sara,
  },
  {
    id: "c7",
    name: "کاوه مرادی",
    role: "Realtor",
    city: "تهران",
    avatar: media.avatar.kaveh,
  },
  {
    id: "c8",
    name: "لیلا اکبری",
    role: "Realtor",
    city: "شیراز",
    avatar: media.avatar.leila,
  },
  {
    id: "c9",
    name: "حمید رستمی",
    role: "Builder",
    city: "تهران",
    avatar: media.avatar.hamid,
  },
  {
    id: "c10",
    name: "نازنین قاسمی",
    role: "Client",
    city: "کرج",
    avatar: media.avatar.nazanin,
  },
  {
    id: "c11",
    name: "پویا شریفی",
    role: "Realtor",
    city: "تهران",
    avatar: media.avatar.pouya,
  },
  {
    id: "c12",
    name: "هانیه موسوی",
    role: "Client",
    city: "تهران",
    avatar: media.avatar.hanieh,
  },
];

export const FEATURED_PROPERTIES: FeaturedProperty[] = [
  {
    id: "f1",
    title: "دپارتمان درخشان",
    address: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    area: "۴۵۰ متر مربع | ۴ خوابه تک‌واحدی",
    price: "۸۵ میلیارد تومان",
    badge: "فروش ویژه · سند تک‌برگ",
    highlights: ["تک‌واحدی", "لابی مجلل", "پارکینگ مهمان"],
    image: media.hero.drake,
    agent: {
      name: "مهندس آرش شایگان",
      role: "Realtor",
      roleLabel: "مشاور ارشد",
      avatar: media.avatar.arash,
    },
  },
  {
    id: "f2",
    title: "دپارتمان درخشان",
    address: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    area: "۴۵۰ متر مربع | ۴ خوابه تک‌واحدی",
    price: "۹۲ میلیارد تومان",
    badge: "پنت‌هاوس VIP · بازدید با هماهنگی",
    highlights: ["روف‌گاردن", "آسانسور اختصاصی", "ویو ابدی"],
    image: media.hero.niavaran,
    agent: {
      name: "مهندس آرش شایگان",
      role: "Realtor",
      roleLabel: "مشاور ارشد",
      avatar: media.avatar.arash,
    },
  },
  {
    id: "f3",
    title: "دپارتمان درخشان",
    address: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    area: "۸۵۰ متر بنا | ۵ خوابه دوبلکس",
    price: "۷۲ میلیارد تومان",
    badge: "ویلای شخصی‌ساز · فول امکانات",
    highlights: ["استخر", "روف‌گاردن", "نگهبانی ۲۴ساعته"],
    image: media.hero.lavasan,
    agent: {
      name: "مریم فرهادی",
      role: "Realtor",
      roleLabel: "مشاور ارشد",
      avatar: media.avatar.maryam,
    },
  },
  {
    id: "f4",
    title: "دپارتمان درخشان",
    address: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    area: "۳۱۰ متر مربع | ۶ اتاق جلسه",
    price: "اجاره ۱۸۰ میلیون تومان / ماه",
    badge: "اجاره اداری · قابل رهن",
    highlights: ["پارکینگ مهمان", "فیبر نوری", "نما شیشه‌ای"],
    image: media.hero.vanak,
    agent: {
      name: "کاوه مرادی",
      role: "Realtor",
      roleLabel: "مشاور ارشد",
      avatar: media.avatar.kaveh,
    },
  },
];

/** @deprecated use FEATURED_PROPERTIES[0] */
export const FEATURED_PROPERTY = FEATURED_PROPERTIES[0];

export const MOST_VIEWED_PROPERTIES: ViewedProperty[] = [
  {
    id: "p1",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: media.property.lavasan,
    rooms: "۵ خواب",
    size: "۸۵۰ متر",
    finish: "فول امکانات (استخر، روف‌گاردن)",
    price: "۷۲ میلیارد تومان",
    pricePerMeter: "۸۵ میلیون",
    neighborhoodAvg: "۶۸ میلیارد",
    usage: "ویلایی",
    views: "۱۸٬۶۰۰ بازدید",
  },
  {
    id: "p2",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: media.property.fereshteh,
    rooms: "۳ خواب مستر",
    size: "۲۲۰ متر",
    finish: "۲ پارکینگ سندی",
    price: "۴۸ میلیارد تومان",
    pricePerMeter: "۲۱۸ میلیون",
    neighborhoodAvg: "۴۵ میلیارد",
    usage: "مسکونی",
    views: "۱۴٬۲۰۰ بازدید",
  },
  {
    id: "p3",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: media.property.zaferanieh,
    rooms: "۴ خواب",
    size: "۳۸۰ متر",
    finish: "دید ۳۶۰ درجه",
    price: "۹۵ میلیارد تومان",
    pricePerMeter: "۲۵۰ میلیون",
    neighborhoodAvg: "۸۸ میلیارد",
    usage: "پنت‌هاوس",
    views: "۲۱٬۴۰۰ بازدید",
  },
  {
    id: "p4",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: media.property.saadatabad,
    rooms: "۲ خواب",
    size: "۱۱۰ متر",
    finish: "نیمه‌مبله لوکس",
    price: "۱۴ میلیارد تومان",
    pricePerMeter: "۱۲۷ میلیون",
    neighborhoodAvg: "۱۳٫۴ میلیارد",
    usage: "مسکونی",
    views: "۷٬۴۰۰ بازدید",
  },
  {
    id: "p5",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: media.property.jordan,
    rooms: "۳ خواب",
    size: "۱۶۰ متر",
    finish: "بازسازی ۱۴۰۳",
    price: "۲۱ میلیارد تومان",
    pricePerMeter: "۱۳۱ میلیون",
    neighborhoodAvg: "۱۹٫۸ میلیارد",
    usage: "مسکونی",
    views: "۶٬۱۰۰ بازدید",
  },
  {
    id: "p6",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    image: media.property.mirdamad,
    rooms: "۶ اتاق",
    size: "۲۸۰ متر",
    finish: "سند اداری",
    price: "رهن و اجاره · ۹۵ م / ماه",
    pricePerMeter: "۳۳۹ هزار",
    neighborhoodAvg: "۸۵ م / ماه",
    usage: "اداری",
    views: "۴٬۹۰۰ بازدید",
  },
];

export const MANAGED_PROPERTIES: ManagedProperty[] = [
  {
    id: "mp1",
    code: "DRS-۱۴۰۳-۰۱",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    price: "۴۸ میلیارد تومان",
    image: media.property.fereshteh,
    status: "published",
    views: "۱٫۲ هزار بازدید",
    category: "apartment",
    listingType: "sale",
  },
  {
    id: "mp2",
    code: "DRS-۱۴۰۳-۰۲",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    price: "۷۲ میلیارد تومان",
    image: media.property.lavasan,
    status: "published",
    views: "۸۴۰ بازدید",
    category: "villa",
    listingType: "sale",
  },
  {
    id: "mp3",
    code: "DRS-۱۴۰۳-۰۳",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    price: "۱۸۰ میلیون / ماه",
    image: media.hero.vanak,
    status: "draft",
    views: "۱۲۰ بازدید",
    category: "commercial",
    listingType: "rent",
  },
  {
    id: "mp4",
    code: "DRS-۱۴۰۳-۰۴",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    price: "۹۵ میلیارد تومان",
    image: media.property.zaferanieh,
    status: "published",
    views: "۲٫۱ هزار بازدید",
    category: "apartment",
    listingType: "sale",
  },
  {
    id: "mp5",
    code: "DRS-۱۴۰۳-۰۵",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    price: "رهن کامل · ۱۴ میلیارد",
    image: media.property.saadatabad,
    status: "archived",
    views: "۳۱۰ بازدید",
    category: "apartment",
    listingType: "rent",
  },
  {
    id: "mp6",
    code: "DRS-۱۴۰۳-۰۶",
    title: "دپارتمان درخشان",
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    price: "۲۱ میلیارد تومان",
    image: media.property.jordan,
    status: "draft",
    views: "۹۵ بازدید",
    category: "apartment",
    listingType: "sale",
  },
];

export const ADMIN_LEADS: Lead[] = [
  {
    id: "l1",
    clientName: "علی رضایی",
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    propertyTitle: "دپارتمان درخشان",
    date: "۱۴۰۳/۰۶/۱۸",
    status: "new",
  },
  {
    id: "l2",
    clientName: "سارا محمدی",
    phone: "۰۹۳۵۹۸۷۶۵۴۳",
    propertyTitle: "دپارتمان درخشان",
    date: "۱۴۰۳/۰۶/۱۷",
    status: "new",
  },
  {
    id: "l3",
    clientName: "رضا کریمی",
    phone: "۰۹۱۹۱۱۱۲۲۳۳",
    propertyTitle: "دپارتمان درخشان",
    date: "۱۴۰۳/۰۶/۱۵",
    status: "contacted",
  },
  {
    id: "l4",
    clientName: "نرگس احمدی",
    phone: "۰۹۰۱۴۴۴۵۵۶۶",
    propertyTitle: "دپارتمان درخشان",
    date: "۱۴۰۳/۰۶/۱۴",
    status: "contacted",
  },
  {
    id: "l5",
    clientName: "امیر حسینی",
    phone: "۰۹۱۲۷۷۷۸۸۹۹",
    propertyTitle: "دپارتمان درخشان",
    date: "۱۴۰۳/۰۶/۱۲",
    status: "viewing",
  },
  {
    id: "l6",
    clientName: "مریم کاظمی",
    phone: "۰۹۳۶۲۲۲۳۳۴۴",
    propertyTitle: "دپارتمان درخشان",
    date: "۱۴۰۳/۰۶/۱۰",
    status: "viewing",
  },
  {
    id: "l7",
    clientName: "حسین نوری",
    phone: "۰۹۱۰۵۵۵۶۶۷۷",
    propertyTitle: "دپارتمان درخشان",
    date: "۱۴۰۳/۰۶/۰۱",
    status: "closed",
  },
];

export const ADMIN_AGENTS: AgentStats[] = [
  {
    id: "a1",
    name: "مهندس آرش شایگان",
    role: "Realtor",
    city: "مشکین دشت",
    avatar: media.avatar.arash,
    listedProperties: 24,
    dealsClosed: 11,
    commission: "۱۸۶ میلیون تومان",
  },
  {
    id: "a2",
    name: "مریم فرهادی",
    role: "Realtor",
    city: "مشکین دشت",
    avatar: media.avatar.maryam,
    listedProperties: 18,
    dealsClosed: 9,
    commission: "۱۴۲ میلیون تومان",
  },
  {
    id: "a3",
    name: "کاوه مرادی",
    role: "Realtor",
    city: "مشکین دشت",
    avatar: media.avatar.kaveh,
    listedProperties: 15,
    dealsClosed: 7,
    commission: "۹۸ میلیون تومان",
  },
  {
    id: "a4",
    name: "لیلا اکبری",
    role: "Realtor",
    city: "شیراز",
    avatar: media.avatar.leila,
    listedProperties: 21,
    dealsClosed: 10,
    commission: "۱۶۵ میلیون تومان",
  },
];

export const PROPERTY_AMENITIES = [
  "پارکینگ",
  "آسانسور",
  "انباری",
  "بالکن",
  "استخر",
  "سالن ورزشی",
  "نگهبانی ۲۴ساعته",
  "لابی‌من",
  "سیستم هوشمند",
  "روف‌گاردن",
] as const;
