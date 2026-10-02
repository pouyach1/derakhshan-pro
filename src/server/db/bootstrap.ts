import { hashPassword } from "@/server/auth/password";
import { siteConfig } from "@/config/siteConfig";
import { BLOG_SEED_AUTHORS, BLOG_SEED_POSTS } from "@/server/db/blog-seed";
import {
  getStore,
  newId,
  nowIso,
  resetStore,
  saveStore,
  type AgencyStore,
  type PropertyRecord,
} from "@/server/db/store";

/**
 * Staff seed password — prefer private env, then optional public demo hint.
 * Production: no hardcoded fallback (must set SEED_ADMIN_PASSWORD).
 * Development only: falls back to 123456 for local demos.
 */
export function resolveSeedPassword(): string | null {
  for (const key of [
    "SEED_ADMIN_PASSWORD",
    "DEMO_STAFF_PASSWORD",
    "NEXT_PUBLIC_DEMO_STAFF_PASSWORD",
  ] as const) {
    const value = process.env[key]?.trim();
    if (value && value.length >= 6) return value;
  }
  if (process.env.NODE_ENV === "production") return null;
  return "123456";
}

function requireSeedPassword() {
  const password = resolveSeedPassword();
  if (!password) {
    throw new Error(
      "SEED_ADMIN_PASSWORD is required to seed staff accounts (min 8 characters in production).",
    );
  }
  return password;
}

/**
 * Keep staff hashes aligned with the resolved seed/demo password so login
 * matches the env after reseed / password rotation without a manual wipe.
 * Only fills missing hashes — never overwrites a password the user already set.
 */
async function syncStaffPasswordsFromEnv() {
  const password = resolveSeedPassword();
  if (!password) return;

  const store = getStore();
  const staff = store.users.filter((u) => u.role === "admin" || u.role === "agent");
  if (staff.length === 0) return;

  const missing = staff.filter((u) => !u.passwordHash);
  if (missing.length === 0) return;

  const hash = await hashPassword(password);
  const stamp = nowIso();
  for (const user of missing) {
    user.passwordHash = hash;
    user.updatedAt = stamp;
  }
  saveStore();
}

type SeedProperty = Partial<PropertyRecord> & {
  code: string;
  title: string;
  price: number;
  imageUrl: string;
  gallery: string[];
  location: string;
  neighborhood: string;
  description: string;
  features: string[];
  views: number;
};

export async function buildSeedStore(): Promise<AgencyStore> {
  const brand = siteConfig.brand.nameFa;
  const seedPassword = requireSeedPassword();
  const staffHash = await hashPassword(seedPassword);
  const stamp = nowIso();
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
  const daysAhead = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

  const store: AgencyStore = {
    users: [
      {
        id: "admin-1",
        phone: "09121111111",
        email: siteConfig.panels.demoAdminEmail,
        name: siteConfig.brand.managerNameFa,
        role: "admin",
        passwordHash: staffHash,
        agentId: null,
        onboardingComplete: true,
        clientProfile: null,
        avatarUrl: "/images/admin/avatars/arash-shayegan.jpg",
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
      },
      {
        id: "agent-1",
        phone: "09122113456",
        email: siteConfig.panels.demoAgentEmail,
        name: "آرش شایگان",
        role: "agent",
        passwordHash: staffHash,
        agentId: "a1",
        onboardingComplete: true,
        clientProfile: null,
        avatarUrl: "/images/admin/avatars/arash-shayegan.jpg",
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
      },
      {
        id: "agent-2",
        phone: "09123334567",
        email: "maryam@vorqen.ir",
        name: "مریم فرهادی",
        role: "agent",
        passwordHash: staffHash,
        agentId: "a2",
        onboardingComplete: true,
        clientProfile: null,
        avatarUrl: "/images/admin/avatars/maryam-farhadi.jpg",
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
      },
      {
        id: "agent-3",
        phone: "09124445678",
        email: "kaveh@vorqen.ir",
        name: "کاوه مرادی",
        role: "agent",
        passwordHash: staffHash,
        agentId: "a3",
        onboardingComplete: true,
        clientProfile: null,
        avatarUrl: "/images/admin/avatars/kaveh-moradi.jpg",
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
      },
    ],
    properties: [],
    leads: [],
    clients: [],
    tours: [],
    contacts: [],
    activity: [],
    propertyImages: [],
    deals: [],
    blogPosts: [],
    chatThreads: [],
    chatMessages: [],
  };

  const samples: SeedProperty[] = [
    {
      code: "DRX-2101",
      title: "دفتر کار پلان باز در مهرشهر، آماده‌ی استقرار",
      price: 60_000_000,
      status: "published",
      listingType: "rent",
      category: "commercial",
      bedrooms: 0,
      bathrooms: 2,
      areaSqm: 180,
      isFeatured: true,
      location: "کرج، مهرشهر، خیابان شهرداری",
      neighborhood: "مهرشهر",
      description:
        `دفتر کار پلان باز در مهرشهر با نمای مناسب، آبدارخانه مستقل و دو سرویس. مناسب استقرار تیم‌های کوچک و متوسط. اجاره ماهانه با قرارداد رسمی دفتر ${brand}.`,
      features: ["پلان باز", "۲ سرویس", "آسانسور", "پارکینگ مهمان", "فیبر نوری"],
      imageUrl: "/images/admin/properties/mirdamad-office.jpg",
      gallery: [
        "/images/admin/properties/mirdamad-office.jpg",
        "/images/admin/hero/vanak-office.jpg",
        "/images/landing/categories/commercial.jpg",
      ],
      views: 1280,
      agentId: "a1",
    },
    {
      code: "DRX-2102",
      title: "دوبلکس بازسازی‌شده گوهردشت، مناسب سکونت و پذیرایی",
      price: 14_500_000_000,
      status: "published",
      listingType: "sale",
      category: "residential",
      bedrooms: 4,
      bathrooms: 3,
      areaSqm: 260,
      isFeatured: true,
      location: "کرج، گوهردشت، فاز ۴",
      neighborhood: "گوهردشت",
      description:
        "دوبلکس کاملاً بازسازی‌شده در گوهردشت با طراحی معاصر، سقف بلند و فضای پذیرایی مناسب. چهار خواب، سه سرویس و دسترسی عالی به شریان‌های اصلی کرج.",
      features: ["بازسازی کامل", "۴ خواب", "۳ سرویس", "۲ پارکینگ", "آشپزخانه فرنیش"],
      imageUrl: "/images/admin/properties/jordan-renovated.jpg",
      gallery: [
        "/images/admin/properties/jordan-renovated.jpg",
        "/images/landing/features/archive.jpg",
        "/images/admin/hero/drake-chenaran.jpg",
      ],
      views: 960,
      agentId: "a1",
    },
    {
      code: "DRX-2103",
      title: "ویلای باغ مدرن با استخر و فضای سبز اختصاصی",
      price: 28_000_000_000,
      status: "published",
      listingType: "sale",
      category: "villa",
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 600,
      isFeatured: true,
      location: "کرج، ماهدشت، خیابان باغستان",
      neighborhood: "ماهدشت",
      description:
        "ویلای باغ مدرن در ماهدشت با استخر روباز، فضای سبز اختصاصی و چهار خواب مستر. مناسب سکونت ییلاقی و میزبانی خصوصی در بالاشهر کرج.",
      features: ["استخر روباز", "باغ اختصاصی", "۴ خواب", "۴ سرویس", "پارکینگ مسقف"],
      imageUrl: "/images/admin/properties/lavasan-duplex.jpg",
      gallery: [
        "/images/admin/properties/lavasan-duplex.jpg",
        "/images/admin/hero/lavasan-villa.jpg",
        "/images/landing/categories/villa.jpg",
      ],
      views: 740,
      agentId: "a2",
    },
    {
      code: "DRX-2104",
      title: "آپارتمان نوساز عظیمیه با نورگیر جنوبی",
      price: 8_900_000_000,
      status: "published",
      listingType: "sale",
      category: "residential",
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 165,
      isFeatured: true,
      location: "کرج، عظیمیه، بلوار اصلی",
      neighborhood: "عظیمیه",
      description:
        "واحد نوساز در عظیمیه با نورگیر جنوبی، کف‌پوش سنگ، کابینت مدرن و بالکن کاربردی. لابی مرتب، آسانسور و دو پارکینگ سندی. آماده سکونت فوری.",
      features: ["نورگیر جنوبی", "۳ خواب", "۲ سرویس", "۲ پارکینگ سندی", "بالکن"],
      imageUrl: "/images/admin/properties/fereshteh-apt.jpg",
      gallery: [
        "/images/admin/properties/fereshteh-apt.jpg",
        "/images/landing/hero/banner.jpg",
        "/images/landing/hero/side.jpg",
      ],
      views: 510,
      agentId: "a2",
    },
    {
      code: "DRX-2105",
      title: "باغ‌ویلای ۸۵۰ متری کمال‌شهر",
      price: 32_000_000_000,
      status: "published",
      listingType: "sale",
      category: "villa",
      bedrooms: 5,
      bathrooms: 4,
      areaSqm: 850,
      isFeatured: false,
      location: "کرج، کمال‌شهر، باغستان غربی",
      neighborhood: "کمال‌شهر",
      description:
        "باغ‌ویلای وسیع در کمال‌شهر با حیاط مشجر، پنج خواب و چهار سرویس. مناسب سکونت خانوادگی و سرمایه‌گذاری بلندمدت در بالاشهر کرج.",
      features: ["باغ مشجر", "۵ خواب", "۴ سرویس", "آلاچیق", "پارکینگ روباز"],
      imageUrl: "/images/admin/hero/lavasan-villa.jpg",
      gallery: [
        "/images/admin/hero/lavasan-villa.jpg",
        "/images/landing/categories/villa.jpg",
        "/images/landing/features/archive.jpg",
      ],
      views: 620,
      agentId: "a3",
    },
    {
      code: "DRX-2106",
      title: "آپارتمان ۳۸۰ متری گوهردشت",
      price: 18_500_000_000,
      status: "sold",
      listingType: "sale",
      category: "residential",
      bedrooms: 4,
      bathrooms: 3,
      areaSqm: 380,
      isFeatured: false,
      location: "کرج، گوهردشت، فاز ۲",
      neighborhood: "گوهردشت",
      description:
        "پرونده بسته‌شده: آپارتمان ۳۸۰ متری گوهردشت با نورگیر مناسب و دسترسی به مراکز خدماتی. معامله با کارشناسی سند و تحویل کلید در موعد توافق‌شده انجام شد.",
      features: ["۴ خواب", "۳ سرویس", "پارکینگ و انباری", "آسانسور", "نگهبانی"],
      imageUrl: "/images/admin/properties/saadatabad.jpg",
      gallery: [
        "/images/admin/properties/saadatabad.jpg",
        "/images/landing/features/archive.jpg",
      ],
      views: 890,
      agentId: "a1",
    },
    {
      code: "DRX-2107",
      title: "ویلای ۴۵۰ متری ماهدشت",
      price: 22_000_000_000,
      status: "sold",
      listingType: "sale",
      category: "villa",
      bedrooms: 4,
      bathrooms: 3,
      areaSqm: 450,
      isFeatured: false,
      location: "کرج، ماهدشت، خیابان باغستان",
      neighborhood: "ماهدشت",
      description:
        "پرونده بسته‌شده: ویلای ۴۵۰ متری ماهدشت با معامله محرمانه، ساختار حقوقی چندلایه و انتقال بدون حاشیه.",
      features: ["باغ", "۴ خواب", "۳ سرویس", "پارکینگ مسقف"],
      imageUrl: "/images/admin/properties/lavasan-duplex.jpg",
      gallery: [
        "/images/admin/properties/lavasan-duplex.jpg",
        "/images/landing/categories/villa.jpg",
      ],
      views: 1540,
      agentId: "a3",
    },
    {
      code: "DRX-2108",
      title: "ویلای مدرن فردیس مناسب سرمایه‌گذاری",
      price: 16_000_000_000,
      status: "draft",
      listingType: "sale",
      category: "villa",
      bedrooms: 4,
      bathrooms: 3,
      areaSqm: 520,
      isFeatured: false,
      location: "کرج، فردیس، شهرک وحدت",
      neighborhood: "فردیس",
      description:
        "پیش‌نویس فایل ویلای مدرن فردیس برای آماده‌سازی قبل از انتشار عمومی. پلان معاصر و حیاط وسیع. پس از تکمیل مدارک از پنل منتشر می‌شود.",
      features: ["حیاط وسیع", "طراحی مدرن", "پارکینگ روباز", "انشعابات مستقل"],
      imageUrl: "/images/admin/hero/lavasan-villa.jpg",
      gallery: ["/images/admin/hero/lavasan-villa.jpg", "/images/landing/categories/villa.jpg"],
      views: 120,
      agentId: "a2",
    },
  ];

  for (const sample of samples) {
    store.properties.push({
      id: newId(),
      code: sample.code,
      title: sample.title,
      location: sample.location,
      neighborhood: sample.neighborhood,
      description: sample.description,
      price: sample.price,
      currency: "IRR",
      listingType: sample.listingType || "sale",
      category: sample.category || "residential",
      status: sample.status || "published",
      bedrooms: sample.bedrooms || 0,
      bathrooms: sample.bathrooms || 0,
      areaSqm: sample.areaSqm || 0,
      features: sample.features,
      imageUrl: sample.imageUrl,
      gallery: sample.gallery,
      agentId: sample.agentId ?? "a1",
      views: sample.views,
      isFeatured: sample.isFeatured ?? false,
      softDeleted: false,
      version: 1,
      createdAt: daysAgo(14),
      updatedAt: stamp,
    });
  }

  const byCode = (code: string) => store.properties.find((p) => p.code === code);

  store.leads.push(
    {
      id: newId(),
      clientName: "سارا محمدی",
      phone: "09121234567",
      email: "sara.mohammadi@email.com",
      propertyId: byCode("DRX-2101")?.id ?? null,
      propertyTitle: byCode("DRX-2101")?.title || brand,
      source: "website",
      status: "new",
      notes: "درخواست بازدید آخر هفته از دفتر مهرشهر",
      assignedAgentId: "a1",
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
    {
      id: newId(),
      clientName: "علی رضایی",
      phone: "09129876543",
      email: null,
      propertyId: byCode("DRX-2102")?.id ?? null,
      propertyTitle: byCode("DRX-2102")?.title || brand,
      source: "referral",
      status: "viewing",
      notes: "بازدید دوبلکس گوهردشت هماهنگ شد",
      assignedAgentId: "a1",
      createdAt: daysAgo(3),
      updatedAt: stamp,
    },
    {
      id: newId(),
      clientName: "نیلوفر احمدی",
      phone: "09125556677",
      email: "niloofar@email.com",
      propertyId: byCode("DRX-2103")?.id ?? null,
      propertyTitle: byCode("DRX-2103")?.title || brand,
      source: "instagram",
      status: "contacted",
      notes: "بودجه تا ۳۰ میلیارد — تمرکز روی ماهدشت و کمال‌شهر",
      assignedAgentId: "a2",
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
    },
    {
      id: newId(),
      clientName: "شرکت آتیه‌سازان",
      phone: "02188776655",
      email: "office@atiyeh.co",
      propertyId: byCode("DRX-2104")?.id ?? null,
      propertyTitle: byCode("DRX-2104")?.title || brand,
      source: "website",
      status: "negotiation",
      notes: "اجاره دفتر مهرشهر — نیاز به پلان باز",
      assignedAgentId: "a2",
      createdAt: daysAgo(5),
      updatedAt: stamp,
    },
    {
      id: newId(),
      clientName: "رضا کریمی",
      phone: "09126667788",
      email: null,
      propertyId: byCode("DRX-2105")?.id ?? null,
      propertyTitle: byCode("DRX-2105")?.title || brand,
      source: "walk-in",
      status: "closed",
      notes: "پس از بازدید عظیمیه وارد مذاکره شد",
      assignedAgentId: "a3",
      createdAt: daysAgo(10),
      updatedAt: daysAgo(4),
    },
  );

  store.clients.push(
    {
      id: newId(),
      agentId: "a1",
      name: "مریم کریمی",
      phone: "09123334455",
      email: "maryam.karimi@email.com",
      preferredNeighborhood: "گوهردشت",
      budgetMin: 60_000_000_000,
      budgetMax: 110_000_000_000,
      urgency: "high",
      intent: "buy",
      notes: [{ id: newId(), text: "اولویت ویوی کوه و حداقل سه پارکینگ", at: stamp }],
      createdAt: daysAgo(12),
      updatedAt: stamp,
    },
    {
      id: newId(),
      agentId: "a2",
      name: "حسین نادری",
      phone: "09124445566",
      email: null,
      preferredNeighborhood: "عظیمیه",
      budgetMin: 25_000_000_000,
      budgetMax: 45_000_000_000,
      urgency: "medium",
      intent: "buy",
      notes: [{ id: newId(), text: "خانواده چهار نفره — مدرسه نزدیک مهم است", at: daysAgo(2) }],
      createdAt: daysAgo(8),
      updatedAt: daysAgo(2),
    },
    {
      id: newId(),
      agentId: "a3",
      name: "گروه سرمایه‌گذاری پارس",
      phone: "09127778899",
      email: "invest@pars-hold.com",
      preferredNeighborhood: "مهرشهر",
      budgetMin: 0,
      budgetMax: 500_000_000,
      urgency: "high",
      intent: "rent",
      notes: [{ id: newId(), text: "جستجوی دفتر ۱۵۰ تا ۲۰۰ متر در مهرشهر و هدایتکار", at: stamp }],
      createdAt: daysAgo(6),
      updatedAt: stamp,
    },
    {
      id: newId(),
      agentId: "a1",
      name: "الهام موسوی",
      phone: "09120001122",
      email: null,
      preferredNeighborhood: "ماهدشت",
      budgetMin: 50_000_000_000,
      budgetMax: 85_000_000_000,
      urgency: "low",
      intent: "buy",
      notes: [],
      createdAt: daysAgo(15),
      updatedAt: daysAgo(7),
    },
  );

  const tourTargets = [
    { code: "DRX-2101", clientName: "سارا محمدی", clientPhone: "09121234567", agentId: "a1", dayLabel: "فردا", timeLabel: "۱۰:۳۰", status: "upcoming" as const, notes: "بازدید خصوصی دفتر مهرشهر", offset: 1 },
    { code: "DRX-2102", clientName: "علی رضایی", clientPhone: "09129876543", agentId: "a1", dayLabel: "پس‌فردا", timeLabel: "۱۶:۰۰", status: "upcoming" as const, notes: "بازدید دوبلکس گوهردشت به‌همراه کارشناس", offset: 2 },
    { code: "DRX-2103", clientName: "نیلوفر احمدی", clientPhone: "09125556677", agentId: "a2", dayLabel: "دیروز", timeLabel: "۱۲:۰۰", status: "completed" as const, notes: "بازدید انجام شد — منتظر پیشنهاد کتبی", offset: -1 },
    { code: "DRX-2104", clientName: "نماینده آتیه‌سازان", clientPhone: "02688776655", agentId: "a2", dayLabel: "پنجشنبه", timeLabel: "۱۱:۰۰", status: "upcoming" as const, notes: "بازدید آپارتمان عظیمیه", offset: 3 },
  ];

  for (const tour of tourTargets) {
    const property = byCode(tour.code);
    if (!property) continue;
    store.tours.push({
      id: newId(),
      agentId: tour.agentId,
      propertyId: property.id,
      clientName: tour.clientName,
      clientPhone: tour.clientPhone,
      scheduledAt: tour.offset >= 0 ? daysAhead(tour.offset) : daysAgo(Math.abs(tour.offset)),
      dayLabel: tour.dayLabel,
      timeLabel: tour.timeLabel,
      status: tour.status,
      notes: tour.notes,
      createdAt: daysAgo(2),
      updatedAt: stamp,
    });
  }

  store.contacts.push(
    {
      id: newId(),
      name: "سارا محمدی",
      email: "sara.mohammadi@email.com",
      phone: "09121234567",
      interest: "اجاره دفتر مهرشهر",
      category: "buy",
      message: "لطفاً برای بازدید دفتر مهرشهر در آخر هفته هماهنگ کنید.",
      budget: "۵۰ تا ۷۰ میلیون ماهانه",
      tab: "consultation",
      status: "new",
      meta: { brand },
      createdAt: daysAgo(1),
    },
    {
      id: newId(),
      name: "عضویت خبرنامه",
      email: "vip@vorqen.ir",
      phone: null,
      interest: "",
      category: "general",
      message: "درخواست عضویت در خبرنامه فایل‌های منتخب دفتر",
      budget: null,
      tab: "newsletter",
      status: "read",
      meta: { brand },
      createdAt: daysAgo(4),
    },
  );

  for (const property of store.properties) {
    const urls = property.gallery?.length ? property.gallery : [property.imageUrl].filter(Boolean);
    urls.forEach((url, index) => {
      store.propertyImages!.push({
        id: newId(),
        propertyId: property.id,
        url,
        alt: property.title,
        sortOrder: index,
        isCover: index === 0,
        createdAt: stamp,
      });
    });
  }

  const closedDeals = [
    {
      code: "DRX-2106",
      buyerName: "خانواده موسوی",
      sellerName: "مالک قبلی",
      notes: "معامله فروش با کارشناسی سند و تحویل ۳۰ روزه",
      closedDaysAgo: 18,
    },
    {
      code: "DRX-2107",
      buyerName: "سرمایه‌گذار خصوصی",
      sellerName: "سازنده پروژه",
      notes: "معامله محرمانه ویلای ماهدشت",
      closedDaysAgo: 40,
    },
  ];

  for (const deal of closedDeals) {
    const property = byCode(deal.code);
    if (!property) continue;
    store.deals!.push({
      id: newId(),
      propertyId: property.id,
      title: property.title,
      dealType: property.listingType === "rent" ? "rent" : "sale",
      status: "closed",
      price: property.price,
      currency: "IRR",
      buyerName: deal.buyerName,
      sellerName: deal.sellerName,
      agentId: property.agentId,
      closedAt: daysAgo(deal.closedDaysAgo),
      notes: deal.notes,
      createdAt: daysAgo(deal.closedDaysAgo),
      updatedAt: daysAgo(deal.closedDaysAgo),
    });
  }

  store.activity.push(
    {
      id: newId(),
      actorId: "admin-1",
      actorRole: "admin",
      action: "property.create",
      entityType: "property",
      entityId: byCode("DRX-2101")?.id ?? null,
      detail: { title: byCode("DRX-2101")?.title },
      ip: null,
      requestId: null,
      createdAt: daysAgo(1),
    },
    {
      id: newId(),
      actorId: "a1",
      actorRole: "agent",
      action: "lead.create",
      entityType: "lead",
      entityId: store.leads[0]?.id ?? null,
      detail: { clientName: "سارا محمدی" },
      ip: null,
      requestId: null,
      createdAt: daysAgo(1),
    },
    {
      id: newId(),
      actorId: "a2",
      actorRole: "agent",
      action: "tour.create",
      entityType: "tour",
      entityId: store.tours[0]?.id ?? null,
      detail: { clientName: "سارا محمدی" },
      ip: null,
      requestId: null,
      createdAt: stamp,
    },
    {
      id: newId(),
      actorId: "a3",
      actorRole: "agent",
      action: "deal.close",
      entityType: "deal",
      entityId: store.deals?.[1]?.id ?? null,
      detail: { title: byCode("DRX-2107")?.title },
      ip: null,
      requestId: null,
      createdAt: daysAgo(40),
    },
  );

  // Editorial seed authors not already in staff list (e.g. سارا نوری).
  for (const author of Object.values(BLOG_SEED_AUTHORS)) {
    const exists = store.users.some((user) => user.id === author.userId);
    if (exists) continue;
    store.users.push({
      id: author.userId,
      phone: author.phone,
      email: author.email,
      name: author.name,
      role: "agent",
      passwordHash: staffHash,
      agentId: author.agentId,
      onboardingComplete: true,
      clientProfile: null,
      avatarUrl: author.avatarUrl,
      isActive: true,
      createdAt: stamp,
      updatedAt: stamp,
    });
  }

  store.blogPosts = BLOG_SEED_POSTS.map((seed) => {
    const author = BLOG_SEED_AUTHORS[seed.authorName];
    return {
      id: seed.id,
      title: seed.title,
      slug: seed.slug,
      excerpt: seed.excerpt,
      content: seed.content,
      coverImage: seed.coverImage,
      category: seed.category,
      authorUserId: author.userId,
      authorAgentId: author.agentId,
      status: seed.status,
      softDeleted: false,
      publishedAt: seed.publishedAt,
      readingTime: seed.readingTime,
      createdAt: seed.publishedAt || stamp,
      updatedAt: seed.publishedAt || stamp,
    };
  });

  return store;
}

function ensureBlogAuthorUsers() {
  const store = getStore();
  const stamp = nowIso();
  let changed = false;
  for (const author of Object.values(BLOG_SEED_AUTHORS)) {
    const existing = store.users.find(
      (user) =>
        user.id === author.userId ||
        user.phone === author.phone ||
        (author.email && user.email?.toLowerCase() === author.email.toLowerCase()),
    );
    if (existing) {
      if (!existing.avatarUrl && author.avatarUrl) {
        existing.avatarUrl = author.avatarUrl;
        changed = true;
      }
      continue;
    }
    store.users.push({
      id: author.userId,
      phone: author.phone,
      email: author.email,
      name: author.name,
      role: "agent",
      passwordHash: null,
      agentId: author.agentId,
      onboardingComplete: true,
      clientProfile: null,
      avatarUrl: author.avatarUrl,
      isActive: true,
      createdAt: stamp,
      updatedAt: stamp,
    });
    changed = true;
  }
  return changed;
}

function hydrateBlogPosts() {
  const store = getStore();
  if (!store.blogPosts) store.blogPosts = [];
  if (store.blogPosts.length > 0) return false;

  const authorsReady = ensureBlogAuthorUsers();
  const stamp = nowIso();
  for (const seed of BLOG_SEED_POSTS) {
    const author = BLOG_SEED_AUTHORS[seed.authorName];
    if (!author) continue;
    store.blogPosts.push({
      id: seed.id,
      title: seed.title,
      slug: seed.slug,
      excerpt: seed.excerpt,
      content: seed.content,
      coverImage: seed.coverImage,
      category: seed.category,
      authorUserId: author.userId,
      authorAgentId: author.agentId,
      status: seed.status,
      softDeleted: false,
      publishedAt: seed.publishedAt,
      readingTime: seed.readingTime,
      createdAt: seed.publishedAt || stamp,
      updatedAt: seed.publishedAt || stamp,
    });
  }
  return authorsReady || store.blogPosts.length > 0;
}

function hydrateDerivedCollections() {
  const store = getStore();
  let changed = false;
  if (!store.propertyImages) {
    store.propertyImages = [];
    changed = true;
  }
  if (!store.deals) {
    store.deals = [];
    changed = true;
  }
  if (!store.blogPosts) {
    store.blogPosts = [];
    changed = true;
  }
  if (store.propertyImages.length === 0 && store.properties.length > 0) {
    for (const property of store.properties) {
      const urls = property.gallery?.length ? property.gallery : [property.imageUrl].filter(Boolean);
      urls.forEach((url, index) => {
        store.propertyImages!.push({
          id: newId(),
          propertyId: property.id,
          url,
          alt: property.title,
          sortOrder: index,
          isCover: index === 0,
          createdAt: property.createdAt || nowIso(),
        });
      });
    }
    changed = true;
  }
  if (store.deals.length === 0) {
    for (const property of store.properties.filter((p) => p.status === "sold" && !p.softDeleted)) {
      store.deals.push({
        id: newId(),
        propertyId: property.id,
        title: property.title,
        dealType: property.listingType === "rent" ? "rent" : "sale",
        status: "closed",
        price: property.price,
        currency: property.currency || "IRR",
        buyerName: null,
        sellerName: null,
        agentId: property.agentId,
        closedAt: property.updatedAt,
        notes: "هم‌ترازی با وضعیت واگذار شده",
        createdAt: property.updatedAt,
        updatedAt: property.updatedAt,
      });
    }
    if (store.deals.length > 0) changed = true;
  }
  if (hydrateBlogPosts()) changed = true;
  if (changed) saveStore();
}

let booting: Promise<void> | null = null;

export async function ensureBootstrapped() {
  const current = getStore();

  const hasData = current.users.length > 0 && current.properties.length > 0;
  const hasUsableStaff = current.users.some(
    (u) =>
      (u.role === "admin" || u.role === "agent") &&
      Boolean(u.passwordHash) &&
      u.isActive !== false,
  );

  // Fast path for warm isolates — avoid any hashing work.
  if (hasData && hasUsableStaff) {
    hydrateDerivedCollections();
    return;
  }

  hydrateDerivedCollections();

  const needsData = !hasData;
  const seedPassword = resolveSeedPassword();

  // Repair: properties may exist while staff rows were wiped or never seeded.
  if (!hasUsableStaff && seedPassword) {
    await ensureStaffUsers(seedPassword);
  }

  if (needsData) {
    if (!seedPassword) {
      // Empty Workers isolate without seed env: do NOT block client self-login.
      // Staff demo data simply won't exist until a seed password is configured.
      return;
    }

    if (!booting) {
      booting = (async () => {
        const seeded = await buildSeedStore();
        const live = getStore();
        if (live.users.length > 0 && live.properties.length > 0) return;
        resetStore(seeded);
      })().finally(() => {
        booting = null;
      });
    }
    await booting;
  }

  await syncStaffPasswordsFromEnv();
}

/** Ensure admin + primary agents exist even when the store already has other data. */
async function ensureStaffUsers(seedPassword: string) {
  const store = getStore();
  const hash = await hashPassword(seedPassword);
  const stamp = nowIso();
  const staffSeed = [
    {
      id: "admin-1",
      phone: "09121111111",
      email: siteConfig.panels.demoAdminEmail,
      name: siteConfig.brand.managerNameFa,
      role: "admin" as const,
      agentId: null as string | null,
    },
    {
      id: "agent-1",
      phone: "09122113456",
      email: siteConfig.panels.demoAgentEmail,
      name: "آرش شایگان",
      role: "agent" as const,
      agentId: "a1",
    },
  ];

  let changed = false;
  for (const seed of staffSeed) {
    const existing = store.users.find(
      (u) =>
        u.id === seed.id ||
        u.phone === seed.phone ||
        (seed.email && u.email?.toLowerCase() === seed.email.toLowerCase()),
    );
    if (existing) {
      existing.role = seed.role;
      existing.passwordHash = hash;
      existing.isActive = true;
      existing.onboardingComplete = true;
      existing.agentId = seed.agentId;
      existing.email = seed.email;
      existing.phone = seed.phone;
      existing.name = seed.name;
      existing.updatedAt = stamp;
      changed = true;
      continue;
    }
    store.users.push({
      id: seed.id,
      phone: seed.phone,
      email: seed.email,
      name: seed.name,
      role: seed.role,
      passwordHash: hash,
      agentId: seed.agentId,
      onboardingComplete: true,
      clientProfile: null,
      avatarUrl: null,
      isActive: true,
      createdAt: stamp,
      updatedAt: stamp,
    });
    changed = true;
  }

  // Demote accidental guest-client rows that reused staff emails/phones.
  for (const user of store.users) {
    const staffHit = staffSeed.find(
      (s) =>
        user.phone === s.phone ||
        (s.email && user.email?.toLowerCase() === s.email.toLowerCase()),
    );
    if (staffHit && user.role === "client") {
      user.role = staffHit.role;
      user.passwordHash = hash;
      user.agentId = staffHit.agentId;
      user.onboardingComplete = true;
      user.isActive = true;
      user.updatedAt = stamp;
      changed = true;
    }
  }

  if (changed) saveStore();
}
