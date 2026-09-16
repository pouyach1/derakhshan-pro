/**
 * Seed luxury demo data into the Agency JSON store.
 * Run: npm run db:seed
 */

import { hashPassword } from "../server/auth/password";
import { siteConfig } from "../config/siteConfig";
import {
  getStore,
  newId,
  nowIso,
  resetStore,
  type AgencyStore,
} from "../server/db/store";

async function main() {
  const brand = siteConfig.brand.nameFa;
  const address = siteConfig.contact.address.line1;
  const city = siteConfig.contact.address.city;

  const existing = getStore();
  if (existing.users.length > 0 && existing.properties.length > 0) {
    console.log("→ store already seeded — refreshing auth hashes only");
  }

  console.log("→ seeding users…");
  const adminHash = await hashPassword("123456");
  const agentHash = await hashPassword("123456");

  const store: AgencyStore = {
    users: [
      {
        id: "admin-1",
        phone: "09121111111",
        email: siteConfig.panels.demoAdminEmail,
        name: "مدیر سیستم",
        role: "admin",
        passwordHash: adminHash,
        agentId: null,
        onboardingComplete: true,
        clientProfile: null,
        avatarUrl: null,
        isActive: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
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
        avatarUrl: null,
        isActive: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    properties: [],
    leads: [],
    clients: [],
    tours: [],
    contacts: [],
    activity: [],
  };

  console.log("→ seeding properties…");
  const samples = [
    {
      code: "PR-1001",
      price: 85_000_000_000,
      status: "published" as const,
      listingType: "sale" as const,
      bedrooms: 4,
      areaSqm: 450,
      isFeatured: true,
      imageUrl: "/images/landing/hero/banner.jpg",
    },
    {
      code: "PR-1002",
      price: 72_000_000_000,
      status: "negotiation" as const,
      listingType: "sale" as const,
      bedrooms: 5,
      areaSqm: 850,
      isFeatured: true,
      imageUrl: "/images/landing/categories/villa.jpg",
    },
    {
      code: "PR-1003",
      price: 48_000_000_000,
      status: "published" as const,
      listingType: "sale" as const,
      bedrooms: 3,
      areaSqm: 220,
      imageUrl: "/images/landing/categories/penthouse.jpg",
    },
    {
      code: "PR-1004",
      price: 180_000_000,
      status: "published" as const,
      listingType: "rent" as const,
      bedrooms: 0,
      areaSqm: 310,
      imageUrl: "/images/landing/categories/commercial.jpg",
    },
    {
      code: "PR-1005",
      price: 32_000_000_000,
      status: "sold" as const,
      listingType: "sale" as const,
      bedrooms: 3,
      areaSqm: 180,
      imageUrl: "/images/landing/features/archive.jpg",
    },
  ];

  for (const sample of samples) {
    store.properties.push({
      id: newId(),
      code: sample.code,
      title: brand,
      location: address,
      neighborhood: city,
      description: `فایل اختصاصی ${brand} — ${address}`,
      price: sample.price,
      currency: "IRR",
      listingType: sample.listingType,
      category: sample.listingType === "rent" ? "commercial" : "residential",
      status: sample.status,
      bedrooms: sample.bedrooms,
      bathrooms: 3,
      areaSqm: sample.areaSqm,
      features: ["لابی مجلل", "پارکینگ", "نگهبانی"],
      imageUrl: sample.imageUrl,
      gallery: [sample.imageUrl],
      agentId: "a1",
      views: Math.floor(Math.random() * 4000) + 200,
      isFeatured: sample.isFeatured ?? false,
      softDeleted: false,
      version: 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  }

  console.log("→ seeding leads / clients / tours…");
  store.leads.push(
    {
      id: newId(),
      clientName: "سارا محمدی",
      phone: "09121234567",
      email: "sara@example.com",
      propertyId: null,
      propertyTitle: brand,
      source: "website",
      status: "new",
      notes: "علاقه‌مند به بازدید آخر هفته",
      assignedAgentId: "a1",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: newId(),
      clientName: "علی رضایی",
      phone: "09129876543",
      email: null,
      propertyId: null,
      propertyTitle: brand,
      source: "referral",
      status: "viewing",
      notes: "در حال مذاکره قیمت",
      assignedAgentId: "a1",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  );

  store.clients.push({
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
    notes: [{ text: "اولویت ویوی عالی و پارکینگ مضاعف", at: nowIso() }],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

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
      notes: "بازدید خصوصی VIP",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  }

  resetStore(store);
  console.log("✓ seed complete → data/agency.json");
  console.log(`  admin: ${siteConfig.panels.demoAdminEmail} / 123456`);
  console.log(`  agent: ${siteConfig.panels.demoAgentEmail} / 123456`);
  console.log(`  client OTP: ${process.env.DEMO_OTP || "1234"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
