import type { z } from "zod";
import { ApiError } from "@/server/http/response";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { findAuthUser, normalizeIdentifier, normalizePhone, normalizeSecret, type AuthSession, type ClientProfile, type UserRole } from "@/lib/auth";
import type {
  clientCreateSchema,
  clientUpdateSchema,
  contactSchema,
  inquirySchema,
  leadCreateSchema,
  leadUpdateSchema,
  loginSchema,
  onboardingSchema,
  settingsUpdateSchema,
  tourCreateSchema,
  tourUpdateSchema,
} from "@/server/validation/schemas";
import { ensureBootstrapped, resolveSeedPassword } from "@/server/db/bootstrap";
import { siteConfig } from "@/config/siteConfig";
import {
  getStore,
  newId,
  nowIso,
  saveStore,
  type AgencySettings,
  type ContactRecord,
  type LeadRecord,
  type TourRecord,
  type UserRecord,
} from "@/server/db/store";

function configuredClientOtp(): string | null {
  for (const key of ["DEMO_OTP", "NEXT_PUBLIC_DEMO_OTP"] as const) {
    const otp = process.env[key]?.trim();
    if (otp) return otp;
  }
  // Demo showcase fallback — Workers often lack runtime secrets.
  return "1234";
}

function clientOtpMatches(secret: string) {
  const otp = configuredClientOtp();
  return Boolean(otp && secret === otp);
}

async function verifyClientSecret(user: UserRecord, secret: string) {
  // Demo OTP wins even if the account already has a password hash.
  if (clientOtpMatches(secret)) return;

  if (user.passwordHash) {
    const ok = await verifyPassword(secret, user.passwordHash);
    if (ok) return;
    throw new ApiError(401, "INVALID_CREDENTIALS", "رمز عبور یا کد تأیید نادرست است");
  }

  // First password login for an OTP-only guest: bind the password to the account.
  if (secret.length >= 6) {
    user.passwordHash = await hashPassword(secret);
    user.updatedAt = nowIso();
    saveStore();
    return;
  }

  if (!configuredClientOtp()) {
    throw new ApiError(
      401,
      "INVALID_CREDENTIALS",
      "رمز عبور حداقل ۶ کاراکتر وارد کنید یا کد یک‌بارمصرف را وارد کنید.",
    );
  }
  throw new ApiError(401, "INVALID_CREDENTIALS", "کد تأیید نادرست است");
}

export async function authenticate(input: z.infer<typeof loginSchema>): Promise<AuthSession> {
  try {
    await ensureBootstrapped();
  } catch (error) {
    const raw = error instanceof Error ? error.message : "";
    const message = raw.includes("SEED_ADMIN_PASSWORD")
      ? "پیکربندی ورود ناقص است. در محیط سرور SEED_ADMIN_PASSWORD یا NEXT_PUBLIC_DEMO_STAFF_PASSWORD (حداقل ۸ کاراکتر) را تنظیم کنید."
      : "سرویس ورود موقتاً در دسترس نیست";
    throw new ApiError(503, "AUTH_BOOTSTRAP_FAILED", message);
  }
  const store = getStore();

  const identifier = normalizeIdentifier(input.identifier);
  const secret = normalizeSecret(input.secret);
  const isEmail = identifier.includes("@");
  const knownHint = findAuthUser(identifier);

  let user = store.users.find((u) =>
    isEmail ? u.email?.toLowerCase() === identifier : u.phone === identifier,
  );

  // Staff emails/phones must never silently become guest clients.
  if ((!user || !user.isActive) && knownHint && knownHint.role !== "client") {
    await ensureBootstrapped();
    user = getStore().users.find((u) =>
      isEmail ? u.email?.toLowerCase() === identifier : u.phone === identifier,
    );

    if ((!user || !user.isActive || user.role === "client") && secret.length >= 6) {
      const hash = await hashPassword(secret);
      const stamp = nowIso();
      const live = getStore();
      if (user && user.role === "client") {
        user.role = knownHint.role;
        user.passwordHash = hash;
        user.name = knownHint.name;
        user.phone = knownHint.phone;
        user.email = knownHint.email ?? user.email;
        user.agentId = knownHint.agentId ?? null;
        user.onboardingComplete = true;
        user.isActive = true;
        user.updatedAt = stamp;
      } else {
        user = {
          id: knownHint.id,
          phone: knownHint.phone,
          email: knownHint.email ?? null,
          name: knownHint.name,
          role: knownHint.role,
          passwordHash: hash,
          agentId: knownHint.agentId ?? null,
          onboardingComplete: true,
          clientProfile: null,
          avatarUrl: null,
          isActive: true,
          createdAt: stamp,
          updatedAt: stamp,
        };
        live.users.push(user);
      }
      saveStore();
    }

    if (!user || !user.isActive || user.role === "client") {
      throw new ApiError(
        503,
        "STAFF_NOT_READY",
        "حساب مدیر/مشاور آماده نشد. رمز حداقل ۶ کاراکتر وارد کنید و دوباره تلاش کنید.",
      );
    }
  }

  if (!user || !user.isActive) {
    const phone = isEmail ? "09000000000" : identifier;
    const id = `client-${identifier}`;
    let guest = store.users.find((u) => u.id === id);

    const otpOk = clientOtpMatches(secret);
    const passwordOk = secret.length >= 6;

    if (!otpOk && !passwordOk) {
      if (!configuredClientOtp()) {
        throw new ApiError(
          401,
          "INVALID_CREDENTIALS",
          "رمز عبور حداقل ۶ کاراکتر وارد کنید.",
        );
      }
      throw new ApiError(401, "INVALID_CREDENTIALS", "کد تأیید نادرست است");
    }

    if (!guest) {
      guest = {
        id,
        phone,
        email: isEmail ? identifier : null,
        name: isEmail ? identifier.split("@")[0] || "کاربر" : "کاربر مهمان",
        role: "client",
        passwordHash: otpOk ? null : await hashPassword(secret),
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
    } else {
      await verifyClientSecret(guest, secret);
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
    await verifyClientSecret(user, secret);
  } else {
    if (!user.passwordHash) {
      if (secret.length < 6) {
        throw new ApiError(401, "INVALID_CREDENTIALS", "رمز عبور برای این حساب تنظیم نشده است");
      }
      user.passwordHash = await hashPassword(secret);
      user.updatedAt = nowIso();
      saveStore();
    } else {
      const ok = await verifyPassword(secret, user.passwordHash);
      if (!ok) {
        // Showcase heal: accept demo staff fallbacks and update hash.
        const demo = resolveSeedPassword() || "123456";
        const allowed = new Set([demo, "123456"].filter((v) => v.length >= 6));
        if (!allowed.has(secret)) {
          throw new ApiError(401, "INVALID_CREDENTIALS", "رمز عبور نادرست است");
        }
        user.passwordHash = await hashPassword(secret);
        user.updatedAt = nowIso();
        saveStore();
      }
    }
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
  await ensureBootstrapped();
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
  await ensureBootstrapped();
  const store = getStore();
  let rows = [...store.leads];
  if (opts?.agentId) rows = rows.filter((l) => l.assignedAgentId === opts.agentId);
  if (opts?.status) rows = rows.filter((l) => l.status === opts.status);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function pushActivity(input: {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  detail?: Record<string, unknown>;
}) {
  const store = getStore();
  store.activity.unshift({
    id: newId(),
    actorId: input.actorId ?? null,
    actorRole: input.actorRole ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    detail: input.detail ?? {},
    ip: null,
    requestId: null,
    createdAt: nowIso(),
  });
  store.activity = store.activity.slice(0, 500);
}

export async function createLead(input: z.infer<typeof leadCreateSchema>) {
  await ensureBootstrapped();
  const store = getStore();
  const phone = normalizePhone(input.phone);
  const row: LeadRecord = {
    id: newId(),
    clientName: input.clientName,
    phone,
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

  // Keep CRM client roster in sync so leads stay followable as clients.
  const agentKey = input.assignedAgentId || "a1";
  const existingClient = store.clients.find((c) => c.phone === phone);
  if (!existingClient) {
    store.clients.unshift({
      id: newId(),
      agentId: agentKey,
      name: input.clientName,
      phone,
      email: input.email || null,
      preferredNeighborhood: "",
      budgetMin: 0,
      budgetMax: 0,
      urgency: "medium",
      intent: "buy",
      notes: input.notes
        ? [{ id: newId(), text: input.notes, at: nowIso() }]
        : [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  } else if (input.notes) {
    existingClient.notes.unshift({ id: newId(), text: input.notes, at: nowIso() });
    existingClient.updatedAt = nowIso();
  }

  pushActivity({
    action: "lead.create",
    entityType: "lead",
    entityId: row.id,
    detail: { phone, source: row.source },
  });
  saveStore();
  return row;
}

export async function updateLead(
  id: string,
  input: z.infer<typeof leadUpdateSchema>,
  scope?: { agentId?: string | null },
) {
  await ensureBootstrapped();
  const store = getStore();
  const existing = store.leads.find((l) => l.id === id);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "لید یافت نشد");
  if (scope?.agentId) {
    if (existing.assignedAgentId && existing.assignedAgentId !== scope.agentId) {
      throw new ApiError(403, "FORBIDDEN", "این لید متعلق به مشاور دیگری است");
    }
  }
  Object.assign(existing, {
    status: input.status ?? existing.status,
    notes: input.notes ?? existing.notes,
    assignedAgentId:
      scope?.agentId != null
        ? existing.assignedAgentId ?? scope.agentId
        : (input.assignedAgentId ?? existing.assignedAgentId),
    propertyTitle: input.propertyTitle ?? existing.propertyTitle,
    updatedAt: nowIso(),
  });
  pushActivity({
    action: "lead.update",
    entityType: "lead",
    entityId: id,
    detail: { status: existing.status },
  });
  saveStore();
  return existing;
}

export async function listActivity(limit = 50) {
  await ensureBootstrapped();
  const store = getStore();
  return store.activity.slice(0, Math.min(Math.max(limit, 1), 200));
}

export async function listAgents() {
  await ensureBootstrapped();
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
        isActive: agent.isActive,
        status: agent.isActive ? ("active" as const) : ("inactive" as const),
      };
    });
}

export async function listClients(agentId?: string) {
  await ensureBootstrapped();
  const store = getStore();
  const rows = agentId
    ? store.clients.filter((c) => c.agentId === agentId)
    : [...store.clients];
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function createClient(agentId: string, input: z.infer<typeof clientCreateSchema>) {
  await ensureBootstrapped();
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
    notes: (input.notes ?? []).map((note) => ({
      id: newId(),
      text: note.text,
      at: note.at || nowIso(),
    })),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.clients.unshift(row);
  saveStore();
  return row;
}

export async function listTours(agentId?: string) {
  await ensureBootstrapped();
  const store = getStore();
  const rows = agentId ? store.tours.filter((t) => t.agentId === agentId) : [...store.tours];
  return rows.sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
}

export async function createTour(agentId: string, input: z.infer<typeof tourCreateSchema>) {
  await ensureBootstrapped();
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
  agentId: string | null,
  input: z.infer<typeof tourUpdateSchema>,
) {
  await ensureBootstrapped();
  const store = getStore();
  const existing = store.tours.find(
    (t) => t.id === id && (agentId == null || t.agentId === agentId),
  );
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
  await ensureBootstrapped();
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
  if (input.tab !== "newsletter") {
    await createLead({
      clientName: input.name,
      phone: input.phone || "09000000000",
      email: input.email || undefined,
      propertyTitle: input.interest || "درخواست تماس VIP",
      source: `contact:${input.tab}`,
      notes: input.message,
    });
  }
  return { id: row.id, received: true };
}

export async function getPlatformStats() {
  await ensureBootstrapped();
  const store = getStore();
  const live = store.properties.filter((p) => !p.softDeleted);
  return {
    totalProperties: live.length,
    publishedProperties: live.filter((p) => p.status === "published").length,
    negotiationProperties: live.filter((p) => p.status === "negotiation").length,
    soldProperties: live.filter((p) => p.status === "sold").length,
    newLeads: store.leads.filter((l) => l.status === "new").length,
    unreadMessages: store.contacts.filter((c) => c.status === "new").length,
    agents: store.users.filter((u) => u.role === "agent").length,
    registeredClients: store.clients.length + store.users.filter((u) => u.role === "client").length,
    monthlyDeals:
      (store.deals ?? []).filter((d) => d.status === "closed").length ||
      live.filter((p) => p.status === "sold").length,
    totalViews: live.reduce((sum, p) => sum + p.views, 0),
    brand: siteConfig.brand.nameFa,
  };
}

export async function createInquiry(input: z.infer<typeof inquirySchema>, ip?: string) {
  await ensureBootstrapped();
  const store = getStore();
  const property = store.properties.find((p) => p.id === input.propertyId && !p.softDeleted);
  if (!property) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");

  const lead = await createLead({
    clientName: input.name,
    phone: input.phone,
    email: input.email || undefined,
    propertyId: property.id,
    propertyTitle: property.title,
    source: "listing-inquiry",
    notes: input.message,
    assignedAgentId: property.agentId || undefined,
  });

  store.activity.unshift({
    id: newId(),
    actorId: null,
    actorRole: "client",
    action: "inquiry.create",
    entityType: "property",
    entityId: property.id,
    detail: { leadId: lead.id, ip },
    ip: ip ?? null,
    requestId: null,
    createdAt: nowIso(),
  });
  saveStore();
  return { id: lead.id, received: true, propertyTitle: property.title };
}

export async function updateClient(
  id: string,
  input: z.infer<typeof clientUpdateSchema>,
  scope?: { agentId?: string | null },
) {
  await ensureBootstrapped();
  const store = getStore();
  const existing = store.clients.find((c) => c.id === id);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "مشتری یافت نشد");
  if (scope?.agentId && existing.agentId !== scope.agentId) {
    throw new ApiError(403, "FORBIDDEN", "این مشتری متعلق به مشاور دیگری است");
  }
  if (input.urgency) existing.urgency = input.urgency;
  if (input.preferredNeighborhood != null) existing.preferredNeighborhood = input.preferredNeighborhood;
  if (input.notes) {
    existing.notes = input.notes.map((note) => ({
      id: note.id || newId(),
      text: note.text,
      at: note.at || nowIso(),
    }));
  }
  existing.updatedAt = nowIso();
  saveStore();
  return existing;
}

function defaultSettings(): AgencySettings {
  return {
    managerNameFa: siteConfig.brand.managerNameFa,
    notifyEmail: siteConfig.contact.email,
    emailAlerts: true,
    smsAlerts: false,
    phone: siteConfig.contact.phone,
    address: siteConfig.contact.address.line1,
    publicDomain: siteConfig.panels.publicDomain,
  };
}

export async function getSettings() {
  await ensureBootstrapped();
  const store = getStore();
  return { ...defaultSettings(), ...(store.settings ?? {}) };
}

export async function updateSettings(input: z.infer<typeof settingsUpdateSchema>) {
  await ensureBootstrapped();
  const store = getStore();
  store.settings = { ...defaultSettings(), ...(store.settings ?? {}), ...input };
  saveStore();
  return store.settings;
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
