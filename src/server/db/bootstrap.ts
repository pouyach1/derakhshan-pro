import { hashPassword } from "@/server/auth/password";
import { siteConfig } from "@/config/siteConfig";
import {
  getStore,
  newId,
  nowIso,
  resetStore,
  type AgencyStore,
  type PropertyRecord,
} from "@/server/db/store";

const SAMPLE_FEATURES = ["لابی مجلل", "پارکینگ", "نگهبانی", "آسانسور"];

export async function buildSeedStore(): Promise<AgencyStore> {
  const brand = siteConfig.brand.nameFa;
  const address = siteConfig.contact.address.line1;
  const city = siteConfig.contact.address.city;
  const adminHash = await hashPassword("123456");
  const agentHash = await hashPassword("123456");
  const stamp = nowIso();

  const store: AgencyStore = {
    users: [
      {
        id: "admin-1",
        phone: "09121111111",
        email: siteConfig.panels.demoAdminEmail,
        name: siteConfig.brand.managerNameFa,
        role: "admin",
        passwordHash: adminHash,
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
        phone: "09122222222",
        email: siteConfig.panels.demoAgentEmail,
        name: "آرش شایگان",
        role: "agent",
        passwordHash: agentHash,
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
        phone: "09123333333",
        email: "maryam@derakhshan.pro",
        name: "مریم فرهادی",
        role: "agent",
        passwordHash: agentHash,
        agentId: "a2",
        onboardingComplete: true,
        clientProfile: null,
        avatarUrl: "/images/admin/avatars/maryam-farhadi.jpg",
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
  };

  const samples: Array<Partial<PropertyRecord> & { imageUrl: string; price: number; code: string }> = [
    {
      code: "PR-1001",
      title: "فایل نمونه پنت‌هاوس",
      price: 85_000_000_000,
      status: "published",
      listingType: "sale",
      category: "penthouse",
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 450,
      isFeatured: true,
      imageUrl: "/images/landing/hero/banner.jpg",
      agentId: "a1",
    },
    {
      code: "PR-1002",
      title: "فایل نمونه ویلا",
      price: 72_000_000_000,
      status: "negotiation",
      listingType: "sale",
      category: "villa",
      bedrooms: 5,
      bathrooms: 5,
      areaSqm: 850,
      isFeatured: true,
      imageUrl: "/images/landing/categories/villa.jpg",
      agentId: "a1",
    },
    {
      code: "PR-1003",
      title: "فایل نمونه آپارتمان",
      price: 48_000_000_000,
      status: "published",
      listingType: "sale",
      category: "residential",
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 220,
      imageUrl: "/images/landing/categories/penthouse.jpg",
      agentId: "a2",
    },
    {
      code: "PR-1004",
      title: "فایل نمونه اداری",
      price: 180_000_000,
      status: "published",
      listingType: "rent",
      category: "commercial",
      bedrooms: 0,
      bathrooms: 2,
      areaSqm: 310,
      imageUrl: "/images/landing/categories/commercial.jpg",
      agentId: "a2",
    },
    {
      code: "PR-1005",
      title: "فایل نمونه واگذارشده",
      price: 32_000_000_000,
      status: "sold",
      listingType: "sale",
      category: "residential",
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 180,
      imageUrl: "/images/landing/features/archive.jpg",
      agentId: "a1",
    },
  ];

  for (const sample of samples) {
    store.properties.push({
      id: newId(),
      code: sample.code,
      title: sample.title || brand,
      location: address,
      neighborhood: city,
      description: `نمونه قابل جایگزینی از پنل مدیریت — ${brand}. این فایل فقط برای نمایش محصول است.`,
      price: sample.price,
      currency: "IRR",
      listingType: sample.listingType || "sale",
      category: sample.category || "residential",
      status: sample.status || "published",
      bedrooms: sample.bedrooms || 0,
      bathrooms: sample.bathrooms || 0,
      areaSqm: sample.areaSqm || 0,
      features: SAMPLE_FEATURES,
      imageUrl: sample.imageUrl,
      gallery: [sample.imageUrl],
      agentId: sample.agentId ?? "a1",
      views: 240,
      isFeatured: sample.isFeatured ?? false,
      softDeleted: false,
      version: 1,
      createdAt: stamp,
      updatedAt: stamp,
    });
  }

  store.leads.push(
    {
      id: newId(),
      clientName: "سارا محمدی",
      phone: "09121234567",
      email: "sara@example.com",
      propertyId: store.properties[0]?.id ?? null,
      propertyTitle: store.properties[0]?.title || brand,
      source: "website",
      status: "new",
      notes: "علاقه‌مند به بازدید آخر هفته",
      assignedAgentId: "a1",
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      clientName: "علی رضایی",
      phone: "09129876543",
      email: null,
      propertyId: store.properties[1]?.id ?? null,
      propertyTitle: store.properties[1]?.title || brand,
      source: "referral",
      status: "viewing",
      notes: "در حال هماهنگی بازدید",
      assignedAgentId: "a1",
      createdAt: stamp,
      updatedAt: stamp,
    },
  );

  store.clients.push(
    {
      id: newId(),
      agentId: "a1",
      name: "مریم کریمی",
      phone: "09123334455",
      email: null,
      preferredNeighborhood: city,
      budgetMin: 20_000_000_000,
      budgetMax: 60_000_000_000,
      urgency: "high",
      intent: "buy",
      notes: [{ id: newId(), text: "اولویت ویوی عالی و پارکینگ مضاعف", at: stamp }],
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      agentId: "a2",
      name: "حسین نادری",
      phone: "09124445566",
      email: null,
      preferredNeighborhood: city,
      budgetMin: 8_000_000_000,
      budgetMax: 25_000_000_000,
      urgency: "medium",
      intent: "rent",
      notes: [],
      createdAt: stamp,
      updatedAt: stamp,
    },
  );

  if (store.properties[0]) {
    store.tours.push({
      id: newId(),
      agentId: "a1",
      propertyId: store.properties[0].id,
      clientName: "سارا محمدی",
      clientPhone: "09121234567",
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      dayLabel: "فردا",
      timeLabel: "۱۰:۳۰",
      status: "upcoming",
      notes: "بازدید خصوصی",
      createdAt: stamp,
      updatedAt: stamp,
    });
  }

  return store;
}

let booting: Promise<void> | null = null;

export async function ensureBootstrapped() {
  const current = getStore();
  if (current.users.length > 0 && current.properties.length > 0) return;
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
