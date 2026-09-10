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

export const ADMIN_CONTACTS: Contact[] = [
  {
    id: "c1",
    name: "امیرحسین رضایی",
    role: "Realtor",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c2",
    name: "نگار محمدی",
    role: "Builder",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c3",
    name: "سینا کاظمی",
    role: "Client",
    city: "اصفهان",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c4",
    name: "مریم فرهادی",
    role: "Realtor",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c5",
    name: "بهنام اکبری",
    role: "Builder",
    city: "شیراز",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c6",
    name: "سارا نوری",
    role: "Client",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c7",
    name: "کاوه مرادی",
    role: "Realtor",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c8",
    name: "لیلا اکبری",
    role: "Realtor",
    city: "شیراز",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c9",
    name: "حمید رستمی",
    role: "Builder",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005bff4?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c10",
    name: "نازنین قاسمی",
    role: "Client",
    city: "کرج",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c11",
    name: "پویا شریفی",
    role: "Realtor",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c12",
    name: "هانیه موسوی",
    role: "Client",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=160&q=80",
  },
];

export const FEATURED_PROPERTIES: FeaturedProperty[] = [
  {
    id: "f1",
    title: "برج آسمان زعفرانیه",
    address: "زعفرانیه، خیابان آصف، بن‌بست نیکنام، پلاک ۱۸ — واحد ۱۲ شمالی",
    area: "۲۴۵ متر · ۳ خواب · ۲ پارکینگ",
    price: "۴۸ میلیارد تومان",
    badge: "فروش فوری · سند تک‌برگ",
    highlights: ["شمالی", "کلید نخورده", "لابی‌من"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    agent: {
      name: "امیرحسین رضایی",
      role: "Realtor",
      roleLabel: "مشاور منطقه یک",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    },
  },
  {
    id: "f2",
    title: "ویلای باغ‌شهر لواسان",
    address: "لواسان بزرگ، جاده افجه، کوچه باغ‌های شمالی، پلاک ۷",
    area: "۶۲۰ متر بنا · ۱۰۰۰ متر زمین",
    price: "۷۲ میلیارد تومان",
    badge: "ویلای شخصی‌ساز",
    highlights: ["استخر", "نگهبانی ۲۴ساعته", "سه خواب مستر"],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    agent: {
      name: "مریم فرهادی",
      role: "Realtor",
      roleLabel: "کارشناس ویلا شمال",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    },
  },
  {
    id: "f3",
    title: "پنت‌هاوس فرشته",
    address: "فرشته، خیابان فیاضی، برج نیلوفر — طبقه آخر با روف‌گاردن",
    area: "۱۸۰ متر · ویو ابدی",
    price: "۳۹ میلیارد تومان",
    badge: "پنت‌هاوس · بازدید با هماهنگی",
    highlights: ["روف‌گاردن", "آسانسور اختصاصی", "انباری"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    agent: {
      name: "امیرحسین رضایی",
      role: "Realtor",
      roleLabel: "مشاور منطقه یک",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    },
  },
  {
    id: "f4",
    title: "دفتر کار میدان ونک",
    address: "میدان ونک، برج آتریوم، طبقه ۱۴، واحد ۱۴۰۲ — سند اداری",
    area: "۳۱۰ متر · ۶ اتاق جلسه",
    price: "اجاره ۱۸۰ میلیون تومان / ماه",
    badge: "اجاره اداری · قابل رهن",
    highlights: ["پارکینگ مهمان", "فیبر نوری", "نما شیشه‌ای"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    agent: {
      name: "کاوه مرادی",
      role: "Realtor",
      roleLabel: "کارشناس ملک اداری",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    },
  },
];

/** @deprecated use FEATURED_PROPERTIES[0] */
export const FEATURED_PROPERTY = FEATURED_PROPERTIES[0];

export const MOST_VIEWED_PROPERTIES: ViewedProperty[] = [
  {
    id: "p1",
    title: "آپارتمان نوساز نیاوران",
    location: "نیاوران، باهنر، نزدیک جماران",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    rooms: "۳ خواب",
    size: "۱۴۵ متر",
    finish: "کلید نخورده",
    price: "۱۸٫۵ میلیارد تومان",
    pricePerMeter: "۱۲۷ میلیون",
    neighborhoodAvg: "۱۷٫۲ میلیارد",
    usage: "مسکونی",
    views: "۱۴٬۲۰۰ بازدید",
  },
  {
    id: "p2",
    title: "ویلای کردان فاز ۲",
    location: "کرج، کردان، شهرک باغ‌شهر",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    rooms: "۵ خواب",
    size: "۳۸۰ متر",
    finish: "مبله کامل",
    price: "۲۶ میلیارد تومان",
    pricePerMeter: "۶۸ میلیون",
    neighborhoodAvg: "۲۴ میلیارد",
    usage: "ویلایی",
    views: "۹٬۸۰۰ بازدید",
  },
  {
    id: "p3",
    title: "واحد سعادت‌آباد",
    location: "سعادت‌آباد، میدان کاج، فاز ۱",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    rooms: "۲ خواب",
    size: "۱۱۰ متر",
    finish: "نیمه‌مبله",
    price: "۱۴ میلیارد تومان",
    pricePerMeter: "۱۲۷ میلیون",
    neighborhoodAvg: "۱۳٫۴ میلیارد",
    usage: "مسکونی",
    views: "۷٬۴۰۰ بازدید",
  },
  {
    id: "p4",
    title: "پنت‌هاوس الهیه",
    location: "الهیه، فرشته، خیابان آقایی",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    rooms: "۴ خواب",
    size: "۲۲۰ متر",
    finish: "سوپرلوکس",
    price: "۵۵ میلیارد تومان",
    pricePerMeter: "۲۵۰ میلیون",
    neighborhoodAvg: "۵۱ میلیارد",
    usage: "پنت‌هاوس",
    views: "۱۸٬۶۰۰ بازدید",
  },
  {
    id: "p5",
    title: "آپارتمان بازسازی‌شده جردن",
    location: "جردن، گلستان، کوچه ششم",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
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
    title: "دفتر میرداماد",
    location: "میرداماد، نبش خیابان نفت",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
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
    title: "آپارتمان نوساز نیاوران",
    location: "تهران، نیاوران",
    price: "۱۸٫۵ میلیارد تومان",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    status: "published",
    views: "۱٫۲ هزار بازدید",
    category: "apartment",
    listingType: "sale",
  },
  {
    id: "mp2",
    code: "DRS-۱۴۰۳-۰۲",
    title: "ویلای کردان فاز ۲",
    location: "کرج، کردان",
    price: "۲۶ میلیارد تومان",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    status: "published",
    views: "۸۴۰ بازدید",
    category: "villa",
    listingType: "sale",
  },
  {
    id: "mp3",
    code: "DRS-۱۴۰۳-۰۳",
    title: "دفتر کار میدان ونک",
    location: "تهران، ونک",
    price: "۱۸۰ میلیون / ماه",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    status: "draft",
    views: "۱۲۰ بازدید",
    category: "commercial",
    listingType: "rent",
  },
  {
    id: "mp4",
    code: "DRS-۱۴۰۳-۰۴",
    title: "پنت‌هاوس الهیه",
    location: "تهران، الهیه",
    price: "۵۵ میلیارد تومان",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    status: "published",
    views: "۲٫۱ هزار بازدید",
    category: "apartment",
    listingType: "sale",
  },
  {
    id: "mp5",
    code: "DRS-۱۴۰۳-۰۵",
    title: "واحد سعادت‌آباد",
    location: "تهران، سعادت‌آباد",
    price: "رهن کامل · ۱۴ میلیارد",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    status: "archived",
    views: "۳۱۰ بازدید",
    category: "apartment",
    listingType: "rent",
  },
  {
    id: "mp6",
    code: "DRS-۱۴۰۳-۰۶",
    title: "آپارتمان بازسازی‌شده جردن",
    location: "تهران، جردن",
    price: "۲۱ میلیارد تومان",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
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
    propertyTitle: "آپارتمان نوساز نیاوران",
    date: "۱۴۰۳/۰۶/۱۸",
    status: "new",
  },
  {
    id: "l2",
    clientName: "سارا محمدی",
    phone: "۰۹۳۵۹۸۷۶۵۴۳",
    propertyTitle: "ویلای کردان فاز ۲",
    date: "۱۴۰۳/۰۶/۱۷",
    status: "new",
  },
  {
    id: "l3",
    clientName: "رضا کریمی",
    phone: "۰۹۱۹۱۱۱۲۲۳۳",
    propertyTitle: "پنت‌هاوس الهیه",
    date: "۱۴۰۳/۰۶/۱۵",
    status: "contacted",
  },
  {
    id: "l4",
    clientName: "نرگس احمدی",
    phone: "۰۹۰۱۴۴۴۵۵۶۶",
    propertyTitle: "آپارتمان بازسازی‌شده جردن",
    date: "۱۴۰۳/۰۶/۱۴",
    status: "contacted",
  },
  {
    id: "l5",
    clientName: "امیر حسینی",
    phone: "۰۹۱۲۷۷۷۸۸۹۹",
    propertyTitle: "برج آسمان زعفرانیه",
    date: "۱۴۰۳/۰۶/۱۲",
    status: "viewing",
  },
  {
    id: "l6",
    clientName: "مریم کاظمی",
    phone: "۰۹۳۶۲۲۲۳۳۴۴",
    propertyTitle: "دفتر کار میدان ونک",
    date: "۱۴۰۳/۰۶/۱۰",
    status: "viewing",
  },
  {
    id: "l7",
    clientName: "حسین نوری",
    phone: "۰۹۱۰۵۵۵۶۶۷۷",
    propertyTitle: "واحد سعادت‌آباد",
    date: "۱۴۰۳/۰۶/۰۱",
    status: "closed",
  },
];

export const ADMIN_AGENTS: AgentStats[] = [
  {
    id: "a1",
    name: "امیرحسین رضایی",
    role: "Realtor",
    city: "تهران · منطقه یک",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    listedProperties: 24,
    dealsClosed: 11,
    commission: "۱۸۶ میلیون تومان",
  },
  {
    id: "a2",
    name: "مریم فرهادی",
    role: "Realtor",
    city: "تهران · لواسان",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    listedProperties: 18,
    dealsClosed: 9,
    commission: "۱۴۲ میلیون تومان",
  },
  {
    id: "a3",
    name: "کاوه مرادی",
    role: "Realtor",
    city: "تهران · اداری",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    listedProperties: 15,
    dealsClosed: 7,
    commission: "۹۸ میلیون تومان",
  },
  {
    id: "a4",
    name: "لیلا اکبری",
    role: "Realtor",
    city: "شیراز",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
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
