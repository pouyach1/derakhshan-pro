export type ContactRole = "Realtor" | "Builder" | "Client";

export type Contact = {
  id: string;
  name: string;
  role: ContactRole;
  city: string;
  avatar: string;
};

export type FeaturedProperty = {
  title: string;
  address: string;
  area: string;
  image: string;
  agent: Pick<Contact, "name" | "role" | "avatar">;
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
    name: "جیسون روی",
    role: "Realtor",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c2",
    name: "آوا کالینز",
    role: "Builder",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c3",
    name: "نوآ بنت",
    role: "Client",
    city: "اصفهان",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c4",
    name: "میا تورس",
    role: "Realtor",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c5",
    name: "لیام پارک",
    role: "Builder",
    city: "شیراز",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "c6",
    name: "سوفیا چن",
    role: "Client",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
  },
];

export const FEATURED_PROPERTY: FeaturedProperty = {
  title: "نوا رزیدنس",
  address: "نوا رزیدنس، آپارتمان ۱۲ب، خیابان ویکتوریا، منچستر، بریتانیا",
  area: "۲۱ هزار فوت مربع",
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  agent: {
    name: "جیسون روی",
    role: "Realtor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  },
};

export const MOST_VIEWED_PROPERTIES: ViewedProperty[] = [
  {
    id: "p1",
    title: "آپارتمان ۵۲",
    location: "اسکله ویکتوریا، منچستر",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    rooms: "۴ اتاق",
    size: "۱۱۰ متر",
    finish: "مبله",
    price: "۳۲٬۰۰۰ دلار / فوت",
    pricePerSqft: "۲۹۰$",
    averageValue: "۱.۲M$",
    planning: "لوکس",
  },
  {
    id: "p2",
    title: "آرادیا هومز",
    location: "کانال استریت، منچستر",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    rooms: "۳ اتاق",
    size: "۹۵ متر",
    finish: "نیمه‌مبله",
    price: "۲۸٬۴۰۰ دلار / فوت",
    pricePerSqft: "۲۶۵$",
    averageValue: "۹۸۰K$",
    planning: "پریمیوم",
  },
  {
    id: "p3",
    title: "اسکای‌لاین لافت ۸",
    location: "دینزگیت، منچستر",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
    rooms: "۲ اتاق",
    size: "۷۸ متر",
    finish: "مبله",
    price: "۴۱٬۲۰۰ دلار / فوت",
    pricePerSqft: "۳۴۰$",
    averageValue: "۱.۵M$",
    planning: "لوکس",
  },
  {
    id: "p4",
    title: "هاربر ویو ۱۴",
    location: "سالفورد کوییز",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    rooms: "۵ اتاق",
    size: "۱۴۲ متر",
    finish: "مبله",
    price: "۳۶٬۸۰۰ دلار / فوت",
    pricePerSqft: "۳۱۰$",
    averageValue: "۱.۸M$",
    planning: "لوکس",
  },
  {
    id: "p5",
    title: "الم کورت",
    location: "نوردرن کوارتر",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    rooms: "۳ اتاق",
    size: "۱۰۲ متر",
    finish: "غیرمبله",
    price: "۲۴٬۹۰۰ دلار / فوت",
    pricePerSqft: "۲۴۰$",
    averageValue: "۸۶۰K$",
    planning: "استاندارد",
  },
];

export const MANAGED_PROPERTIES: ManagedProperty[] = [
  {
    id: "mp1",
    code: "RIO-2401",
    title: "آپارتمان ۵۲ اسکله",
    location: "منچستر",
    price: "۳۲٬۰۰۰ دلار",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    status: "published",
    views: "۱.۲ هزار بازدید",
    category: "apartment",
    listingType: "sale",
  },
  {
    id: "mp2",
    code: "RIO-2402",
    title: "ویلای آرادیا",
    location: "شمال منچستر",
    price: "۲۸٬۴۰۰ دلار",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    status: "published",
    views: "۸۴۰ بازدید",
    category: "villa",
    listingType: "sale",
  },
  {
    id: "mp3",
    code: "RIO-2403",
    title: "دفتر تجاری دینزگیت",
    location: "مرکز شهر",
    price: "۴۱٬۲۰۰ دلار",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    status: "draft",
    views: "۱۲۰ بازدید",
    category: "commercial",
    listingType: "rent",
  },
  {
    id: "mp4",
    code: "RIO-2404",
    title: "هاربر ویو ۱۴",
    location: "سالفورد",
    price: "۳۶٬۸۰۰ دلار",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    status: "published",
    views: "۲.۱ هزار بازدید",
    category: "apartment",
    listingType: "sale",
  },
  {
    id: "mp5",
    code: "RIO-2405",
    title: "الم کورت رزیدنس",
    location: "نوردرن کوارتر",
    price: "۲۴٬۹۰۰ دلار",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    status: "archived",
    views: "۳۱۰ بازدید",
    category: "apartment",
    listingType: "rent",
  },
  {
    id: "mp6",
    code: "RIO-2406",
    title: "اسکای‌لاین لافت ۸",
    location: "دینزگیت",
    price: "۴۱٬۲۰۰ دلار",
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
    propertyTitle: "آپارتمان ۵۲ اسکله",
    date: "۱۴۰۳/۰۶/۱۸",
    status: "new",
  },
  {
    id: "l2",
    clientName: "سارا محمدی",
    phone: "۰۹۳۵۹۸۷۶۵۴۳",
    propertyTitle: "ویلای آرادیا",
    date: "۱۴۰۳/۰۶/۱۷",
    status: "new",
  },
  {
    id: "l3",
    clientName: "رضا کریمی",
    phone: "۰۹۱۹۱۱۱۲۲۳۳",
    propertyTitle: "هاربر ویو ۱۴",
    date: "۱۴۰۳/۰۶/۱۵",
    status: "contacted",
  },
  {
    id: "l4",
    clientName: "نرگس احمدی",
    phone: "۰۹۰۱۴۴۴۵۵۶۶",
    propertyTitle: "اسکای‌لاین لافت ۸",
    date: "۱۴۰۳/۰۶/۱۴",
    status: "contacted",
  },
  {
    id: "l5",
    clientName: "امیر حسینی",
    phone: "۰۹۱۲۷۷۷۸۸۹۹",
    propertyTitle: "نوا رزیدنس",
    date: "۱۴۰۳/۰۶/۱۲",
    status: "viewing",
  },
  {
    id: "l6",
    clientName: "مریم کاظمی",
    phone: "۰۹۳۶۲۲۲۳۳۴۴",
    propertyTitle: "دفتر تجاری دینزگیت",
    date: "۱۴۰۳/۰۶/۱۰",
    status: "viewing",
  },
  {
    id: "l7",
    clientName: "حسین نوری",
    phone: "۰۹۱۰۵۵۵۶۶۷۷",
    propertyTitle: "الم کورت رزیدنس",
    date: "۱۴۰۳/۰۶/۰۱",
    status: "closed",
  },
];

export const ADMIN_AGENTS: AgentStats[] = [
  {
    id: "a1",
    name: "جیسون روی",
    role: "Realtor",
    city: "تهران",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    listedProperties: 24,
    dealsClosed: 11,
    commission: "۱۸۶ میلیون تومان",
  },
  {
    id: "a2",
    name: "میا تورس",
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
    name: "لیلا فرهادی",
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
