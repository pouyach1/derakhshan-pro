import { and, count, desc, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { bootDb } from "@/server/services/properties";
import {
  activityLog,
  clients,
  contactMessages,
  leads,
  properties,
  tours,
  users,
} from "@/server/db/schema";
import { ApiError } from "@/server/http/response";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import {
  normalizeIdentifier,
  normalizePhone,
  type AuthSession,
  type ClientProfile,
} from "@/lib/auth";
import { siteConfig } from "@/config/siteConfig";
import type { z } from "zod";
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
  const db = await bootDb();
  const identifier = normalizeIdentifier(input.identifier);
  const isEmail = identifier.includes("@");

  const user = await db.query.users.findFirst({
    where: isEmail ? eq(users.email, identifier) : eq(users.phone, identifier),
  });

  if (!user || !user.isActive) {
    // Guest client path with OTP (demo / VIP soft-onboard)
    if (input.secret.trim() !== DEMO_OTP) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "اطلاعات ورود نادرست است");
    }
    const phone = isEmail ? "09000000000" : identifier;
    const id = `client-${identifier}`;
    const existingGuest = await db.query.users.findFirst({ where: eq(users.id, id) });
    if (!existingGuest) {
      await db.insert(users).values({
        id,
        phone,
        email: isEmail ? identifier : null,
        name: "کاربر مهمان",
        role: "client",
        onboardingComplete: false,
      });
    }
    return {
      id,
      phone,
      name: existingGuest?.name || "کاربر مهمان",
      role: "client",
      onboardingComplete: existingGuest?.onboardingComplete ?? false,
      clientProfile: existingGuest?.clientProfileJson
        ? (JSON.parse(existingGuest.clientProfileJson) as ClientProfile)
        : undefined,
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
    clientProfile: user.clientProfileJson
      ? (JSON.parse(user.clientProfileJson) as ClientProfile)
      : undefined,
  };
}

export async function completeOnboarding(userId: string, profile: z.infer<typeof onboardingSchema>) {
  const db = await bootDb();
  await db
    .update(users)
    .set({
      name: profile.fullName,
      onboardingComplete: true,
      clientProfileJson: JSON.stringify(profile),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, userId));
  return profile;
}

export async function listLeads(opts?: { agentId?: string; status?: string }) {
  const db = await bootDb();
  const filters = [];
  if (opts?.agentId) filters.push(eq(leads.assignedAgentId, opts.agentId));
  if (opts?.status) filters.push(eq(leads.status, opts.status as typeof leads.$inferSelect.status));
  const rows = await db
    .select()
    .from(leads)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(leads.createdAt));
  return rows;
}

export async function createLead(input: z.infer<typeof leadCreateSchema>) {
  const db = await bootDb();
  const id = nanoid();
  await db.insert(leads).values({
    id,
    clientName: input.clientName,
    phone: normalizePhone(input.phone),
    email: input.email || null,
    propertyId: input.propertyId,
    propertyTitle: input.propertyTitle || "",
    source: input.source || "manual",
    notes: input.notes || "",
    assignedAgentId: input.assignedAgentId,
  });
  return (await db.query.leads.findFirst({ where: eq(leads.id, id) }))!;
}

export async function updateLead(id: string, input: z.infer<typeof leadUpdateSchema>) {
  const db = await bootDb();
  const existing = await db.query.leads.findFirst({ where: eq(leads.id, id) });
  if (!existing) throw new ApiError(404, "NOT_FOUND", "لید یافت نشد");
  await db
    .update(leads)
    .set({
      status: input.status ?? existing.status,
      notes: input.notes ?? existing.notes,
      assignedAgentId: input.assignedAgentId ?? existing.assignedAgentId,
      propertyTitle: input.propertyTitle ?? existing.propertyTitle,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(leads.id, id));
  return (await db.query.leads.findFirst({ where: eq(leads.id, id) }))!;
}

export async function listAgents() {
  const db = await bootDb();
  const agentUsers = await db.select().from(users).where(eq(users.role, "agent"));
  const result = [];
  for (const agent of agentUsers) {
    const listed = await db
      .select({ value: count() })
      .from(properties)
      .where(and(eq(properties.agentId, agent.agentId || agent.id), eq(properties.softDeleted, false)));
    const closed = await db
      .select({ value: count() })
      .from(properties)
      .where(and(eq(properties.agentId, agent.agentId || agent.id), eq(properties.status, "sold")));
    result.push({
      id: agent.agentId || agent.id,
      userId: agent.id,
      name: agent.name,
      phone: agent.phone,
      email: agent.email,
      avatarUrl: agent.avatarUrl,
      listedProperties: listed[0]?.value ?? 0,
      dealsClosed: closed[0]?.value ?? 0,
    });
  }
  return result;
}

export async function listClients(agentId: string) {
  const db = await bootDb();
  const rows = await db
    .select()
    .from(clients)
    .where(eq(clients.agentId, agentId))
    .orderBy(desc(clients.updatedAt));
  return rows.map((r) => ({
    ...r,
    notes: JSON.parse(r.notesJson || "[]") as Array<{ text: string; at?: string }>,
  }));
}

export async function createClient(agentId: string, input: z.infer<typeof clientCreateSchema>) {
  const db = await bootDb();
  const id = nanoid();
  await db.insert(clients).values({
    id,
    agentId,
    name: input.name,
    phone: normalizePhone(input.phone),
    email: input.email || null,
    preferredNeighborhood: input.preferredNeighborhood || "",
    budgetMin: input.budgetMin,
    budgetMax: input.budgetMax,
    urgency: input.urgency,
    intent: input.intent,
    notesJson: JSON.stringify(input.notes ?? []),
  });
  return (await listClients(agentId)).find((c) => c.id === id)!;
}

export async function listTours(agentId: string) {
  const db = await bootDb();
  return db
    .select()
    .from(tours)
    .where(eq(tours.agentId, agentId))
    .orderBy(desc(tours.scheduledAt));
}

export async function createTour(agentId: string, input: z.infer<typeof tourCreateSchema>) {
  const db = await bootDb();
  const id = nanoid();
  await db.insert(tours).values({
    id,
    agentId,
    propertyId: input.propertyId,
    clientName: input.clientName,
    clientPhone: input.clientPhone,
    scheduledAt: input.scheduledAt,
    dayLabel: input.dayLabel || "",
    timeLabel: input.timeLabel || "",
    notes: input.notes || "",
  });
  return (await db.query.tours.findFirst({ where: eq(tours.id, id) }))!;
}

export async function updateTour(id: string, agentId: string, input: z.infer<typeof tourUpdateSchema>) {
  const db = await bootDb();
  const existing = await db.query.tours.findFirst({
    where: and(eq(tours.id, id), eq(tours.agentId, agentId)),
  });
  if (!existing) throw new ApiError(404, "NOT_FOUND", "بازدید یافت نشد");
  await db
    .update(tours)
    .set({
      status: input.status ?? existing.status,
      notes: input.notes ?? existing.notes,
      scheduledAt: input.scheduledAt ?? existing.scheduledAt,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tours.id, id));
  return (await db.query.tours.findFirst({ where: eq(tours.id, id) }))!;
}

export async function createContactMessage(input: z.infer<typeof contactSchema>, ip?: string) {
  const db = await bootDb();
  const id = nanoid();
  await db.insert(contactMessages).values({
    id,
    name: input.name,
    email: input.email || "noreply@local",
    phone: input.phone,
    interest: input.interest || "",
    category: input.category || "general",
    message: input.message,
    budget: input.budget,
    tab: input.tab,
    metaJson: JSON.stringify({ ip, brand: siteConfig.brand.nameFa }),
  });
  await db.insert(activityLog).values({
    id: nanoid(),
    action: "contact.create",
    entityType: "contact_message",
    entityId: id,
    detailJson: JSON.stringify({ email: input.email, tab: input.tab }),
    ip,
  });
  // Also create a lead for CRM visibility
  await createLead({
    clientName: input.name,
    phone: input.phone || "09000000000",
    email: input.email || undefined,
    propertyTitle: input.interest || "درخواست تماس VIP",
    source: `contact:${input.tab}`,
    notes: input.message,
  });
  return { id, received: true };
}

export async function getPlatformStats() {
  const db = await bootDb();
  const [published, negotiation, leadsNew, messages, agentsCount] = await Promise.all([
    db
      .select({ value: count() })
      .from(properties)
      .where(and(eq(properties.status, "published"), eq(properties.softDeleted, false))),
    db
      .select({ value: count() })
      .from(properties)
      .where(and(eq(properties.status, "negotiation"), eq(properties.softDeleted, false))),
    db.select({ value: count() }).from(leads).where(eq(leads.status, "new")),
    db.select({ value: count() }).from(contactMessages).where(eq(contactMessages.status, "new")),
    db.select({ value: count() }).from(users).where(eq(users.role, "agent")),
  ]);

  const views = await db
    .select({ value: sql<number>`coalesce(sum(${properties.views}), 0)` })
    .from(properties)
    .where(eq(properties.softDeleted, false));

  return {
    publishedProperties: published[0]?.value ?? 0,
    negotiationProperties: negotiation[0]?.value ?? 0,
    newLeads: leadsNew[0]?.value ?? 0,
    unreadMessages: messages[0]?.value ?? 0,
    agents: agentsCount[0]?.value ?? 0,
    totalViews: Number(views[0]?.value ?? 0),
    brand: siteConfig.brand.nameFa,
  };
}

export async function ensureSeedUser(input: {
  id: string;
  phone: string;
  email?: string;
  name: string;
  role: "admin" | "agent" | "client";
  password?: string;
  agentId?: string;
}) {
  const db = await bootDb();
  const existing = await db.query.users.findFirst({ where: eq(users.id, input.id) });
  if (existing) return existing;
  await db.insert(users).values({
    id: input.id,
    phone: input.phone,
    email: input.email,
    name: input.name,
    role: input.role,
    passwordHash: input.password ? await hashPassword(input.password) : null,
    agentId: input.agentId,
    onboardingComplete: input.role !== "client",
  });
  return (await db.query.users.findFirst({ where: eq(users.id, input.id) }))!;
}
