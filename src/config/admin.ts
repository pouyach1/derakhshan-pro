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
  pricePerSqft: string;
  averageValue: string;
  planning: string;
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
];

export const FEATURED_PROPERTIES: FeaturedProperty[] = [
  {
    id: "f1",
    title: "برج آسمان زعفرانیه",
    address: "تهران، زعفرانیه، خیابان آصف، پلاک ۱۸، واحد ۱۲ شمالی",
    area: "۲۴۵ متر مربع",
    price: "۴۸ میلیارد تومان",
    badge: "فروش ویژه",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    agent: {
      name: "امیرحسین رضایی",
      role: "Realtor",
      roleLabel: "مشاور ارشد",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    },
  },
  {
    id: "f2",
    title: "ویلای باغ‌شهر لواسان",
    address: "لواسان، جاده افجه، کوچه باغ‌های شمالی، پلاک ۷",
    area: "۶۲۰ متر مربع",
    price: "۷۲ میلیارد تومان",
    badge: "ویلای لوکس",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    agent: {
      name: "مریم فرهادی",
      role: "Realtor",
      roleLabel: "مشاور ویلا",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    },
  },
  {
    id: "f3",
    title: "پنت‌هاوس فرشته",
    address: "تهران، فرشته، خیابان فیاضی، برج نیلوفر، طبقه آخر",
    area: "۱۸۰ متر مربع",
    price: "۳۹ میلیارد تومان",
    badge: "پنت‌هاوس",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    agent: {
      name: "امیرحسین رضایی",
      role: "Realtor",
      roleLabel: "مشاور ارشد",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    },
  },
  {
    id: "f4",
    title: "دفتر اداری ونک",
    address: "تهران، میدان ونک، برج آتریوم، طبقه ۱۴، واحد ۱۴۰۲",
    area: "۳۱۰ متر مربع",
    price: "ماهانه ۱۸۰ میلیون تومان",
    badge: "اجاره تجاری",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    agent: {
      name: "کاوه مرادی",
      role: "Realtor",
      roleLabel: "مشاور تجاری",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    },
  },
];

/** @deprecated use FEATURED_PROPERTIES[0] */
export const FEATURED_PROPERTY = FEATURED_PROPERTIES[0];

export const MOST_VIEWED_PROPERTIES: ViewedProperty[] = [
  {
    id: "p1",
    title: "آپارتمان نیاوران",
    location: "تهران، نیاوران، خیابان باهنر",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    rooms: "۳ خواب",
    size: "۱۴۵ متر",
    finish: "کلید نخورده",
    price: "۱۸٫۵ میلیارد تومان",
    pricePerSqft: "۱۲۷ م/م",
    averageValue: "۱۷٫۲ میلیارد",
    planning: "لوکس",
  },
  {
    id: "p2",
    title: "ویلای کردان",
    location: "کرج، کردان، فاز ۲",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    rooms: "۵ خواب",
    size: "۳۸۰ متر",
    finish: "مبله کامل",
    price: "۲۶ میلیارد تومان",
    pricePerSqft: "۶۸ م/م",
    averageValue: "۲۴ میلیارد",
    planning: "ویلایی",
  },
  {
    id: "p3",
    title: "واحد سعادت‌آباد",
    location: "تهران، سعادت‌آباد، میدان کاج",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    rooms: "۲ خواب",
    size: "۱۱۰ متر",
    finish: "نیمه‌مبله",
    price: "۱۴ میلیارد تومان",
    pricePerSqft: "۱۲۷ م/م",
    averageValue: "۱۳٫۴ میلیارد",
    planning: "مسکونی",
  },
  {
    id: "p4",
    title: "پنت‌هاوس الهیه",
    location: "تهران، الهیه، خیابان فرشته",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    rooms: "۴ خواب",
    size: "۲۲۰ متر",
    finish: "سوپرلوکس",
    price: "۵۵ میلیارد تومان",
    pricePerSqft: "۲۵۰ م/م",
    averageValue: "۵۱ میلیارد",
    planning: "پنت‌هاوس",
  },
  {
    id: "p5",
    title: "آپارتمان جردن",
    location: "تهران، جردن، خیابان گلستان",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
    rooms: "۳ خواب",
    size: "۱۶۰ متر",
    finish: "بازسازی‌شده",
    price: "۲۱ میلیارد تومان",
    pricePerSqft: "۱۳۱ م/م",
    averageValue: "۱۹٫۸ میلیارد",
    planning: "پریمیوم",
  },
  {
    id: "p6",
    title: "دفتر اداری میرداماد",
    location: "تهران، میرداماد، نبش نفت",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    rooms: "۶ اتاق",
    size: "۲۸۰ متر",
    finish: "اداری",
    price: "اجاره ۹۵ م/ماه",
    pricePerSqft: "۳۳۹ هزار",
    averageValue: "۸۵ م/ماه",
    planning: "تجاری",
  },
];

export const MANAGED_PROPERTIES: ManagedProperty[] = [
  {
    id: "mp1",
    code: "RIO-۱۴۰۳-۰۱",
    title: "آپارتمان نیاوران",
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
    code: "RIO-۱۴۰۳-۰۲",
    title: "ویلای کردان",
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
    code: "RIO-۱۴۰۳-۰۳",
    title: "دفتر اداری ونک",
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
    code: "RIO-۱۴۰۳-۰۴",
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
    code: "RIO-۱۴۰۳-۰۵",
    title: "واحد سعادت‌آباد",
    location: "تهران، سعادت‌آباد",
    price: "۱۴ میلیارد تومان",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    status: "archived",
    views: "۳۱۰ بازدید",
    category: "apartment",
    listingType: "rent",
  },
  {
    id: "mp6",
    code: "RIO-۱۴۰۳-۰۶",
    title: "آپارتمان جردن",
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
    propertyTitle: "آپارتمان نیاوران",
    date: "۱۴۰۳/۰۶/۱۸",
    status: "new",
  },
  {
    id: "l2",
    clientName: "سارا محمدی",
    phone: "۰۹۳۵۹۸۷۶۵۴۳",
    propertyTitle: "ویلای کردان",
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
    propertyTitle: "آپارتمان جردن",
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
    propertyTitle: "دفتر اداری ونک",
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
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    listedProperties: 24,
    dealsClosed: 11,
    commission: "۱۸۶ میلیون تومان",
  },
  {
    id: "a2",
    name: "مریم فرهادی",
    role: "Realtor",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    listedProperties: 18,
    dealsClosed: 9,
    commission: "۱۴۲ میلیون تومان",
  },
  {
    id: "a3",
    name: "کاوه مرادی",
    role: "Realtor",
    city: "اصفهان",
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
  "نگهبانی",
  "سیستم هوشمند",
] as const;
