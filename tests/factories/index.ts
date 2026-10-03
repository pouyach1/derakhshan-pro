import type {
  BlogPostRecord,
  ChatMessageRecord,
  ChatThreadRecord,
  ClientRecord,
  DealRecord,
  LeadRecord,
  PropertyRecord,
  TourRecord,
  UserRecord,
} from "@/server/db/store";

export const TEST_PASSWORD = "test-staff-password";
export const TEST_OTP = "1234";

const stamp = () => new Date().toISOString();

let seq = 0;
function next(prefix: string) {
  seq += 1;
  return `${prefix}-${seq}-${Date.now().toString(36)}`;
}

export function createAdminUser(overrides: Partial<UserRecord> = {}): UserRecord {
  const now = stamp();
  const { role: _role, agentId: _agentId, ...safe } = overrides;
  return {
    id: "admin-test",
    phone: "09121111111",
    email: "admin@test.local",
    name: "مدیر تست",
    passwordHash: null,
    onboardingComplete: true,
    clientProfile: null,
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...safe,
    role: "admin",
    agentId: null,
  };
}

export function createAgentUser(overrides: Partial<UserRecord> = {}): UserRecord {
  const now = stamp();
  const { role: _role, ...safe } = overrides;
  const id = safe.id ?? next("agent");
  return {
    id,
    phone: "09122222222",
    email: `${id}@test.local`,
    name: "مشاور تست",
    passwordHash: null,
    agentId: id,
    onboardingComplete: true,
    clientProfile: null,
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...safe,
    role: "agent",
  };
}

export function createClientUser(overrides: Partial<UserRecord> = {}): UserRecord {
  const now = stamp();
  const { role: _role, agentId: _agentId, ...safe } = overrides;
  const name = safe.name ?? "موکل تست";
  return {
    id: next("client"),
    phone: "09123333333",
    email: null,
    name,
    passwordHash: null,
    onboardingComplete: true,
    clientProfile: {
      fullName: name,
      intent: "buy",
      neighborhoods: ["عظیمیه"],
      budgetMin: 10,
      budgetMax: 40,
      areaMin: 80,
      areaMax: 200,
      bedrooms: 2,
      hasElevator: true,
      hasParking: true,
    },
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...safe,
    role: "client",
    agentId: null,
  };
}

export function createProperty(overrides: Partial<PropertyRecord> = {}): PropertyRecord {
  const now = stamp();
  const id = overrides.id ?? next("prop");
  return {
    id,
    code: `T-${id.slice(-6)}`,
    title: "ملک تست",
    location: "کرج",
    neighborhood: "عظیمیه",
    description: "توضیح تست ملک برای پوشش تست.",
    price: 12_000_000_000,
    currency: "IRR",
    listingType: "sale",
    category: "apartment",
    status: "published",
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 140,
    features: ["پارکینگ"],
    imageUrl: "/images/landing/hero/banner.jpg",
    gallery: ["/images/landing/hero/banner.jpg"],
    videos: [],
    agentId: null,
    views: 0,
    isFeatured: false,
    softDeleted: false,
    version: 1,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createClientRecord(overrides: Partial<ClientRecord> = {}): ClientRecord {
  const now = stamp();
  return {
    id: next("crm-client"),
    agentId: "a-test-a",
    name: "موکل CRM",
    phone: "09124444444",
    email: null,
    preferredNeighborhood: "عظیمیه",
    budgetMin: 10,
    budgetMax: 30,
    urgency: "medium",
    intent: "buy",
    notes: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createLead(overrides: Partial<LeadRecord> = {}): LeadRecord {
  const now = stamp();
  return {
    id: next("lead"),
    clientName: "لید تست",
    phone: "09125555555",
    email: null,
    propertyId: null,
    propertyTitle: "بدون فایل",
    source: "website",
    status: "new",
    notes: "",
    assignedAgentId: "a-test-a",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createDeal(overrides: Partial<DealRecord> = {}): DealRecord {
  const now = stamp();
  return {
    id: next("deal"),
    propertyId: null,
    title: "معامله تست",
    dealType: "sale",
    status: "closed",
    price: 10_000_000_000,
    currency: "IRR",
    buyerName: "خریدار",
    sellerName: "فروشنده",
    agentId: "a-test-a",
    closedAt: now,
    notes: "",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createTour(overrides: Partial<TourRecord> = {}): TourRecord {
  const now = stamp();
  return {
    id: next("tour"),
    agentId: "a-test-a",
    propertyId: "prop-a",
    clientName: "بازدیدکننده تست",
    clientPhone: "09126666666",
    scheduledAt: now,
    dayLabel: "شنبه",
    timeLabel: "۱۰:۰۰",
    status: "upcoming",
    notes: "",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createBlogPost(overrides: Partial<BlogPostRecord> = {}): BlogPostRecord {
  const now = stamp();
  const id = overrides.id ?? next("blog");
  const status = overrides.status ?? "published";
  return {
    id,
    title: "مقاله تست",
    slug: `slug-${id}`,
    excerpt: "خلاصه مقاله تست",
    content: "متن مقاله تست",
    coverImage: "/images/landing/hero/banner.jpg",
    category: "بازار املاک",
    authorUserId: "agent-a",
    authorAgentId: "a-test-a",
    status,
    softDeleted: false,
    publishedAt: status === "draft" ? null : now,
    readingTime: 4,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createChatThread(overrides: Partial<ChatThreadRecord> = {}): ChatThreadRecord {
  const now = stamp();
  return {
    id: next("thread"),
    kind: "support",
    title: "پشتیبانی",
    ownerUserId: "client-a",
    ownerRole: "client",
    ownerName: "موکل الف",
    lastMessageAt: now,
    lastMessagePreview: "",
    unreadForAdmin: 0,
    unreadForOwner: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createChatMessage(overrides: Partial<ChatMessageRecord> = {}): ChatMessageRecord {
  const now = stamp();
  return {
    id: next("msg"),
    threadId: "thread-a",
    senderId: "client-a",
    senderRole: "client",
    senderName: "موکل الف",
    body: "پیام تست",
    createdAt: now,
    ...overrides,
  };
}
