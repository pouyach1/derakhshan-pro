import { ApiError } from "@/server/http/response";
import { ensureBootstrapped } from "@/server/db/bootstrap";
import { getStore, type PropertyRecord } from "@/server/db/store";
import { publicAgentTemplate, type PublicAgentProfile } from "@/lib/agents-public";
import { siteConfig } from "@/config/siteConfig";

export type PropertyAgentSummary = {
  id: string;
  name: string;
  avatarUrl: string | null;
  title: string;
};

export type PropertyWithAgent = Omit<PropertyRecord, "price"> & {
  /** Null when the viewer has no role and prices are gated. */
  price: number | null;
  /** True only for authenticated users with admin/agent/client roles. */
  priceVisible: boolean;
  agent: PropertyAgentSummary | null;
};

function agentUserByKey(agentId: string | null | undefined) {
  if (!agentId) return null;
  const store = getStore();
  return (
    store.users.find(
      (u) =>
        u.role === "agent" &&
        u.isActive &&
        (u.agentId === agentId || u.id === agentId),
    ) ?? null
  );
}

export function summarizeAgent(agentId: string | null | undefined): PropertyAgentSummary | null {
  const user = agentUserByKey(agentId);
  if (!user) return null;
  const key = user.agentId || user.id;
  const template = publicAgentTemplate(key);
  return {
    id: key,
    name: user.name,
    avatarUrl: user.avatarUrl,
    title: template?.title || "مشاور دفتر",
  };
}

export function attachAgent<T extends PropertyRecord>(row: T): T & { agent: PropertyAgentSummary | null } {
  return { ...row, agent: summarizeAgent(row.agentId) };
}

/** Attach agent summary and optionally redact price for guests. */
export function presentProperty(row: PropertyRecord, canSeePrice: boolean): PropertyWithAgent {
  const withAgent = attachAgent(row);
  if (canSeePrice) {
    return { ...withAgent, priceVisible: true };
  }
  return { ...withAgent, price: null, priceVisible: false };
}

export function presentProperties(
  rows: PropertyRecord[],
  canSeePrice: boolean,
): PropertyWithAgent[] {
  return rows.map((row) => presentProperty(row, canSeePrice));
}

export async function getPublicAgent(id: string): Promise<PublicAgentProfile> {
  await ensureBootstrapped();
  const store = getStore();
  const user = store.users.find(
    (u) =>
      u.role === "agent" &&
      u.isActive &&
      (u.agentId === id || u.id === id),
  );
  if (!user) throw new ApiError(404, "NOT_FOUND", "مشاور یافت نشد");

  const key = user.agentId || user.id;
  const template = publicAgentTemplate(key);
  const listedProperties = store.properties.filter(
    (p) => !p.softDeleted && p.agentId === key && p.status === "published",
  ).length;
  const dealsClosed = store.properties.filter(
    (p) => !p.softDeleted && p.agentId === key && p.status === "sold",
  ).length;

  return {
    id: key,
    name: user.name,
    title: template?.title || "مشاور املاک",
    department: template?.department || "مشاوره املاک",
    avatarUrl: user.avatarUrl || "/images/admin/avatars/arash-shayegan.jpg",
    badge: template?.badge || "مشاور فعال دفتر",
    bio:
      template?.bio ||
      `مشاور ${siteConfig.brand.nameFa}؛ آماده همراهی شما برای بازدید و معامله.`,
    philosophy:
      template?.philosophy ||
      "شفافیت در قیمت، سند و بازدید؛ احترام به زمان موکل.",
    phone: user.phone,
    email: user.email,
    stats: template?.stats || [
      { label: "فایل‌های فعال", value: listedProperties.toLocaleString("fa-IR") },
      { label: "معاملات بسته‌شده", value: dealsClosed.toLocaleString("fa-IR") },
      { label: "وضعیت", value: "فعال" },
    ],
    specialties: template?.specialties || ["مشاوره خرید", "مشاوره فروش", "بازدید"],
    listedProperties,
    dealsClosed,
  };
}

export async function listPublicAgents(): Promise<PublicAgentProfile[]> {
  await ensureBootstrapped();
  const store = getStore();
  const agents = store.users.filter((u) => u.role === "agent" && u.isActive);
  const profiles: PublicAgentProfile[] = [];
  for (const agent of agents) {
    profiles.push(await getPublicAgent(agent.agentId || agent.id));
  }
  return profiles;
}
