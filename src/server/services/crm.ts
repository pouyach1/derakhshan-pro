import type { z } from "zod";
import { ApiError } from "@/server/http/response";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import {
  normalizeIdentifier,
  normalizePhone,
  type AuthSession,
  type ClientProfile,
  type UserRole,
} from "@/lib/auth";
import { siteConfig } from "@/config/siteConfig";
import {
  getStore,
  newId,
  nowIso,
  saveStore,
  type ContactRecord,
  type LeadRecord,
  type TourRecord,
  type UserRecord,
} from "@/server/db/store";
import type {
  clientCreateSchema,
  contactSchema,
  leadCreateSchema,
  leadUpdateSchema,
  loginSchema,
  onboardingSchema,
  tourCreateSchema,
  tourUpdateSchema,
} from "@/server/validation/schemas";

const DEMO_OTP = process.env.DEMO_OTP || "1234";

export async function authenticate(input: z.infer<typeof loginSchema>): Promise<AuthSession> {
  const store = getStore();
  if (store.users.length === 0) {
    // Cold start bootstrap (Workers / fresh env)
    const adminHash = await hashPassword("123456");
    const agentHash = await hashPassword("123456");
    store.users.push(
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
    );
    saveStore();
  }

  const identifier = normalizeIdentifier(input.identifier);
  const isEmail = identifier.includes("@");

  const user = store.users.find((u) =>
    isEmail ? u.email?.toLowerCase() === identifier : u.phone === identifier,
  );

  if (!user || !user.isActive) {
    if (input.secret.trim() !== DEMO_OTP) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "اطلاعات ورود نادرست است");
    }
    const phone = isEmail ? "09000000000" : identifier;
    const id = `client-${identifier}`;
    let guest = store.users.find((u) => u.id === id);
    if (!guest) {
      guest = {
        id,
        phone,
        email: isEmail ? identifier : null,
        name: "کاربر مهمان",
        role: "client",
        passwordHash: null,
        agentId: null,
        onboardingComplete: false,
        clientProfile: null,
        avatarUrl: null,
        isActive: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      store.users.push(guest);
      saveStore();
    }
    return {
      id: guest.id,
      phone: guest.phone,
      name: guest.name,
      role: "client",
      onboardingComplete: guest.onboardingComplete,
      clientProfile: guest.clientProfile ?? undefined,
    };
  }

  if (user.role === "client") {
    if (input.secret.trim() !== DEMO_OTP) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "کد تأیید نادرست است");
    }
  } else {
    const ok = await verifyPassword(input.secret, user.passwordHash);
    if (!ok) throw new ApiError(401, "INVALID_CREDENTIALS", "رمز عبور نادرست است");
  }

  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
    agentId: user.agentId ?? undefined,
    onboardingComplete: user.onboardingComplete,
    clientProfile: user.clientProfile ?? undefined,
  };
}

export async function completeOnboarding(userId: string, profile: z.infer<typeof onboardingSchema>) {
  const store = getStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) throw new ApiError(404, "NOT_FOUND", "کاربر یافت نشد");
  user.name = profile.fullName;
  user.onboardingComplete = true;
  user.clientProfile = profile as ClientProfile;
  user.updatedAt = nowIso();
  saveStore();
  return profile;
}

export async function listLeads(opts?: { agentId?: string; status?: string }) {
  const store = getStore();
  let rows = [...store.leads];
  if (opts?.agentId) rows = rows.filter((l) => l.assignedAgentId === opts.agentId);
  if (opts?.status) rows = rows.filter((l) => l.status === opts.status);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createLead(input: z.infer<typeof leadCreateSchema>) {
  const store = getStore();
  const row: LeadRecord = {
    id: newId(),
    clientName: input.clientName,
    phone: normalizePhone(input.phone),
    email: input.email || null,
    propertyId: input.propertyId ?? null,
    propertyTitle: input.propertyTitle || "",
    source: input.source || "manual",
    status: "new",
    notes: input.notes || "",
    assignedAgentId: input.assignedAgentId ?? null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.leads.unshift(row);
  saveStore();
  return row;
}

export async function updateLead(id: string, input: z.infer<typeof leadUpdateSchema>) {
  const store = getStore();
  const existing = store.leads.find((l) => l.id === id);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "لید یافت نشد");
  Object.assign(existing, {
    status: input.status ?? existing.status,
    notes: input.notes ?? existing.notes,
    assignedAgentId: input.assignedAgentId ?? existing.assignedAgentId,
    propertyTitle: input.propertyTitle ?? existing.propertyTitle,
    updatedAt: nowIso(),
  });
  saveStore();
  return existing;
}

export async function listAgents() {
  const store = getStore();
  return store.users
    .filter((u) => u.role === "agent")
    .map((agent) => {
      const agentKey = agent.agentId || agent.id;
      const listed = store.properties.filter(
        (p) => p.agentId === agentKey && !p.softDeleted,
      ).length;
      const closed = store.properties.filter(
        (p) => p.agentId === agentKey && p.status === "sold",
      ).length;
      return {
        id: agentKey,
        userId: agent.id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        avatarUrl: agent.avatarUrl,
        listedProperties: listed,
        dealsClosed: closed,
      };
    });
}

export async function listClients(agentId: string) {
  const store = getStore();
  return store.clients
    .filter((c) => c.agentId === agentId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function createClient(agentId: string, input: z.infer<typeof clientCreateSchema>) {
  const store = getStore();
  const row = {
    id: newId(),
    agentId,
    name: input.name,
    phone: normalizePhone(input.phone),
    email: input.email || null,
    preferredNeighborhood: input.preferredNeighborhood || "",
    budgetMin: input.budgetMin,
    budgetMax: input.budgetMax,
    urgency: input.urgency,
    intent: input.intent,
    notes: input.notes ?? [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.clients.unshift(row);
  saveStore();
  return row;
}

export async function listTours(agentId: string) {
  const store = getStore();
  return store.tours
    .filter((t) => t.agentId === agentId)
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
}

export async function createTour(agentId: string, input: z.infer<typeof tourCreateSchema>) {
  const store = getStore();
  const row: TourRecord = {
    id: newId(),
    agentId,
    propertyId: input.propertyId,
    clientName: input.clientName,
    clientPhone: input.clientPhone ?? null,
    scheduledAt: input.scheduledAt,
    dayLabel: input.dayLabel || "",
    timeLabel: input.timeLabel || "",
    status: "upcoming",
    notes: input.notes || "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.tours.unshift(row);
  saveStore();
  return row;
}

export async function updateTour(
  id: string,
  agentId: string,
  input: z.infer<typeof tourUpdateSchema>,
) {
  const store = getStore();
  const existing = store.tours.find((t) => t.id === id && t.agentId === agentId);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "بازدید یافت نشد");
  Object.assign(existing, {
    status: input.status ?? existing.status,
    notes: input.notes ?? existing.notes,
    scheduledAt: input.scheduledAt ?? existing.scheduledAt,
    updatedAt: nowIso(),
  });
  saveStore();
  return existing;
}

export async function createContactMessage(input: z.infer<typeof contactSchema>, ip?: string) {
  const store = getStore();
  const row: ContactRecord = {
    id: newId(),
    name: input.name,
    email: input.email || "noreply@local",
    phone: input.phone ?? null,
    interest: input.interest || "",
    category: input.category || "general",
    message: input.message,
    budget: input.budget ?? null,
    tab: input.tab,
    status: "new",
    meta: { ip, brand: siteConfig.brand.nameFa },
    createdAt: nowIso(),
  };
  store.contacts.unshift(row);
  store.activity.unshift({
    id: newId(),
    actorId: null,
    actorRole: null,
    action: "contact.create",
    entityType: "contact_message",
    entityId: row.id,
    detail: { email: input.email, tab: input.tab },
    ip: ip ?? null,
    requestId: null,
    createdAt: nowIso(),
  });
  saveStore();
  await createLead({
    clientName: input.name,
    phone: input.phone || "09000000000",
    email: input.email || undefined,
    propertyTitle: input.interest || "درخواست تماس VIP",
    source: `contact:${input.tab}`,
    notes: input.message,
  });
  return { id: row.id, received: true };
}

export async function getPlatformStats() {
  const store = getStore();
  const live = store.properties.filter((p) => !p.softDeleted);
  return {
    publishedProperties: live.filter((p) => p.status === "published").length,
    negotiationProperties: live.filter((p) => p.status === "negotiation").length,
    newLeads: store.leads.filter((l) => l.status === "new").length,
    unreadMessages: store.contacts.filter((c) => c.status === "new").length,
    agents: store.users.filter((u) => u.role === "agent").length,
    totalViews: live.reduce((sum, p) => sum + p.views, 0),
    brand: siteConfig.brand.nameFa,
  };
}

export async function ensureSeedUser(input: {
  id: string;
  phone: string;
  email?: string;
  name: string;
  role: UserRole;
  password?: string;
  agentId?: string;
}) {
  const store = getStore();
  const existing = store.users.find((u) => u.id === input.id);
  if (existing) return existing;
  const row: UserRecord = {
    id: input.id,
    phone: input.phone,
    email: input.email ?? null,
    name: input.name,
    role: input.role,
    passwordHash: input.password ? await hashPassword(input.password) : null,
    agentId: input.agentId ?? null,
    onboardingComplete: input.role !== "client",
    clientProfile: null,
    avatarUrl: null,
    isActive: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.users.push(row);
  saveStore();
  return row;
}
