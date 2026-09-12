import { ADMIN_AGENTS } from "@/config/admin";

export type AgentStatus = "active" | "away" | "inactive";

export type AgentPerformanceRow = {
  id: string;
  name: string;
  avatar: string;
  activeListings: number;
  closedDeals: number;
  status: AgentStatus;
};

export const PLATFORM_STATS = {
  totalProperties: 186,
  activeAgents: ADMIN_AGENTS.length,
  registeredClients: 1240,
  monthlyDeals: 37,
} as const;

export const AGENT_PERFORMANCE: AgentPerformanceRow[] = ADMIN_AGENTS.map((agent, index) => ({
  id: agent.id,
  name: agent.name,
  avatar: agent.avatar,
  activeListings: agent.listedProperties,
  closedDeals: agent.dealsClosed,
  status: (["active", "active", "away", "active"] as AgentStatus[])[index] ?? "active",
}));

export const AGENT_STATUS_LABEL: Record<AgentStatus, string> = {
  active: "فعال",
  away: "مرخصی",
  inactive: "غیرفعال",
};

export type ListingStatus = "published" | "negotiation" | "draft";

export type AgentListing = {
  id: string;
  title: string;
  location: string;
  price: string;
  views: number;
  status: ListingStatus;
  updatedAt: string;
};

export type AgentDashboardData = {
  propertiesCount: number;
  totalViews: number;
  successfulDeals: number;
  listings: AgentListing[];
};

const AGENT_DASHBOARD: Record<string, AgentDashboardData> = {
  a1: {
    propertiesCount: 24,
    totalViews: 18420,
    successfulDeals: 11,
    listings: [
      {
        id: "al1",
        title: "دپارتمان درخشان",
        location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
        price: "۴۸ میلیارد",
        views: 2140,
        status: "published",
        updatedAt: "۲ روز پیش",
      },
      {
        id: "al2",
        title: "دپارتمان درخشان",
        location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
        price: "۳۲ میلیارد",
        views: 1680,
        status: "negotiation",
        updatedAt: "دیروز",
      },
      {
        id: "al3",
        title: "دپارتمان درخشان",
        location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
        price: "۱۸ میلیارد",
        views: 980,
        status: "published",
        updatedAt: "۵ روز پیش",
      },
      {
        id: "al4",
        title: "دپارتمان درخشان",
        location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
        price: "۱۲ میلیارد",
        views: 640,
        status: "draft",
        updatedAt: "۱ هفته پیش",
      },
    ],
  },
};

export const LISTING_STATUS_LABEL: Record<ListingStatus, string> = {
  published: "منتشر شده",
  negotiation: "در مذاکره",
  draft: "پیش‌نویس",
};

export function getAgentDashboard(agentId = "a1"): AgentDashboardData {
  return AGENT_DASHBOARD[agentId] ?? AGENT_DASHBOARD.a1;
}
