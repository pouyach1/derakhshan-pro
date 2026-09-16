/**
 * Seed luxury demo data into the agency database.
 * Run: npm run db:seed
 */

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ensureSchema } from "../server/db/migrate";
import { clients, leads, properties, tours, users } from "../server/db/schema";
import { hashPassword } from "../server/auth/password";
import { siteConfig } from "../config/siteConfig";

async function main() {
  const db = await ensureSchema();
  const brand = siteConfig.brand.nameFa;
  const address = siteConfig.contact.address.line1;
  const city = siteConfig.contact.address.city;

  console.log("→ seeding users…");
  const adminHash = await hashPassword("123456");
  const agentHash = await hashPassword("123456");

  const seedUsers = [
    {
      id: "admin-1",
      phone: "09121111111",
      email: siteConfig.panels.demoAdminEmail,
      name: "مدیر سیستم",
      role: "admin" as const,
      passwordHash: adminHash,
      onboardingComplete: true,
    },
    {
      id: "agent-1",
      phone: "09122222222",
      email: siteConfig.panels.demoAgentEmail,
      name: "آرش شایگان",
      role: "agent" as const,
      passwordHash: agentHash,
      agentId: "a1",
      onboardingComplete: true,
    },
  ];

  for (const u of seedUsers) {
    const exists = await db.query.users.findFirst({ where: eq(users.id, u.id) });
    if (!exists) await db.insert(users).values(u);
  }

  console.log("→ seeding properties…");
  const existingProps = await db.select().from(properties);
  if (existingProps.length === 0) {
    const samples = [
      {
        code: "PR-1001",
        title: brand,
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
        title: brand,
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
        title: brand,
        price: 48_000_000_000,
        status: "published" as const,
        listingType: "sale" as const,
        bedrooms: 3,
        areaSqm: 220,
        imageUrl: "/images/landing/categories/penthouse.jpg",
      },
      {
        code: "PR-1004",
        title: brand,
        price: 180_000_000,
        status: "published" as const,
        listingType: "rent" as const,
        bedrooms: 0,
        areaSqm: 310,
        imageUrl: "/images/landing/categories/commercial.jpg",
      },
      {
        code: "PR-1005",
        title: brand,
        price: 32_000_000_000,
        status: "sold" as const,
        listingType: "sale" as const,
        bedrooms: 3,
        areaSqm: 180,
        imageUrl: "/images/landing/features/archive.jpg",
      },
    ];

    for (const sample of samples) {
      await db.insert(properties).values({
        id: nanoid(),
        code: sample.code,
        title: sample.title,
        location: address,
        neighborhood: city,
        description: `فایل اختصاصی ${brand} — ${address}`,
        price: sample.price,
        listingType: sample.listingType,
        category: sample.listingType === "rent" ? "commercial" : "residential",
        status: sample.status,
        bedrooms: sample.bedrooms,
        bathrooms: 3,
        areaSqm: sample.areaSqm,
        featuresJson: JSON.stringify(["لابی مجلل", "پارکینگ", "نگهبانی"]),
        imageUrl: sample.imageUrl,
        galleryJson: JSON.stringify([sample.imageUrl]),
        agentId: "a1",
        views: Math.floor(Math.random() * 4000) + 200,
        isFeatured: sample.isFeatured ?? false,
      });
    }
  }

  console.log("→ seeding leads / clients / tours…");
  const leadCount = await db.select().from(leads);
  if (leadCount.length === 0) {
    await db.insert(leads).values([
      {
        id: nanoid(),
        clientName: "سارا محمدی",
        phone: "09121234567",
        email: "sara@example.com",
        propertyTitle: brand,
        source: "website",
        status: "new",
        notes: "علاقه‌مند به بازدید آخر هفته",
        assignedAgentId: "a1",
      },
      {
        id: nanoid(),
        clientName: "علی رضایی",
        phone: "09129876543",
        propertyTitle: brand,
        source: "referral",
        status: "viewing",
        notes: "در حال مذاکره قیمت",
        assignedAgentId: "a1",
      },
    ]);
  }

  const clientCount = await db.select().from(clients);
  if (clientCount.length === 0) {
    await db.insert(clients).values({
      id: nanoid(),
      agentId: "a1",
      name: "مریم کریمی",
      phone: "09123334455",
      preferredNeighborhood: city,
      budgetMin: 20_000_000_000,
      budgetMax: 60_000_000_000,
      urgency: "high",
      intent: "buy",
      notesJson: JSON.stringify([
        { text: "اولویت ویوی عالی و پارکینگ مضاعف", at: new Date().toISOString() },
      ]),
    });
  }

  const tourCount = await db.select().from(tours);
  if (tourCount.length === 0) {
    const props = await db.select().from(properties);
    if (props[0]) {
      await db.insert(tours).values({
        id: nanoid(),
        agentId: "a1",
        propertyId: props[0].id,
        clientName: "سارا محمدی",
        clientPhone: "09121234567",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        dayLabel: "فردا",
        timeLabel: "۱۰:۳۰",
        status: "upcoming",
        notes: "بازدید خصوصی VIP",
      });
    }
  }

  console.log("✓ seed complete");
  console.log(`  admin: ${siteConfig.panels.demoAdminEmail} / 123456`);
  console.log(`  agent: ${siteConfig.panels.demoAgentEmail} / 123456`);
  console.log(`  client OTP: ${process.env.DEMO_OTP || "1234"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
