/**
 * Agent-scoped CRM data.
 * Every record is bound to an agentId — never expose cross-agent inventories.
 */

export type AgentPropertyStatus = "active" | "negotiation" | "sold";

export type AgentProperty = {
  id: string;
  agentId: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  priceLabel: string;
  image: string;
  bedrooms: number;
  area: number;
  dealType: "sale" | "rent";
  status: AgentPropertyStatus;
  features: string[];
  views: number;
};

export type ClientUrgency = "low" | "medium" | "high";

export type AgentClient = {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  budgetMin: number;
  budgetMax: number;
  budgetLabel: string;
  preferredNeighborhood: string;
  urgency: ClientUrgency;
  notes: AgentClientNote[];
  preferredBedrooms?: number;
};

export type AgentClientNote = {
  id: string;
  at: string;
  text: string;
};

export type TourStatus = "upcoming" | "completed" | "canceled";

export type AgentTour = {
  id: string;
  agentId: string;
  propertyId: string;
  propertyTitle: string;
  clientName: string;
  when: string;
  dayLabel: string;
  time: string;
  status: TourStatus;
};

export type AgentCrmProfile = {
  id: string;
  name: string;
  title: string;
  commissionRate: number;
  avatar: string;
  rankLabel: string;
  monthlyTarget: number;
  monthlyClosed: number;
};

export type AgentTaskKind = "visit" | "callback" | "contract" | "note";

export type AgentTask = {
  id: string;
  agentId: string;
  kind: AgentTaskKind;
  title: string;
  detail: string;
  time: string;
  dayLabel: string;
  done?: boolean;
};

const media = {
  lavasan: "/images/admin/properties/lavasan-duplex.jpg",
  fereshteh: "/images/admin/properties/fereshteh-apt.jpg",
  zaferanieh: "/images/admin/properties/zaferanieh-penthouse.jpg",
  saadatabad: "/images/admin/properties/saadatabad.jpg",
  jordan: "/images/admin/properties/jordan-renovated.jpg",
  mirdamad: "/images/admin/properties/mirdamad-office.jpg",
  arash: "/images/admin/avatars/arash-shayegan.jpg",
} as const;

export const AGENT_PROFILES: Record<string, AgentCrmProfile> = {
  a1: {
    id: "a1",
    name: "مهندس آرش شایگان",
    title: "مشاور ارشد منطقه یک",
    commissionRate: 2.5,
    avatar: media.arash,
    rankLabel: "مشاور فعال - رتبه ممتاز دفتر",
    monthlyTarget: 3_000_000_000,
    monthlyClosed: 1_850_000_000,
  },
};

export const AGENT_PROPERTIES: AgentProperty[] = [
  {
    id: "ap1",
    agentId: "a1",
    title: "پنت‌هاوس نیاوران",
    location: "تهران · نیاوران",
    neighborhood: "نیاوران",
    price: 48_000_000_000,
    priceLabel: "۴۸ میلیارد",
    image: media.zaferanieh,
    bedrooms: 4,
    area: 320,
    dealType: "sale",
    status: "active",
    features: ["آسانسور", "پارکینگ", "انباری", "روف‌گاردن"],
    views: 2140,
  },
  {
    id: "ap2",
    agentId: "a1",
    title: "ویلای لواسان",
    location: "لواسان · جاده دماوند",
    neighborhood: "لواسان",
    price: 32_000_000_000,
    priceLabel: "۳۲ میلیارد",
    image: media.lavasan,
    bedrooms: 5,
    area: 480,
    dealType: "sale",
    status: "negotiation",
    features: ["استخر", "پارکینگ", "نگهبانی"],
    views: 1680,
  },
  {
    id: "ap3",
    agentId: "a1",
    title: "آپارتمان فرشته",
    location: "تهران · فرشته",
    neighborhood: "فرشته",
    price: 18_000_000_000,
    priceLabel: "۱۸ میلیارد",
    image: media.fereshteh,
    bedrooms: 3,
    area: 165,
    dealType: "sale",
    status: "active",
    features: ["آسانسور", "پارکینگ", "انباری"],
    views: 980,
  },
  {
    id: "ap4",
    agentId: "a1",
    title: "دفتر ونک",
    location: "تهران · ونک",
    neighborhood: "ونک",
    price: 12_000_000_000,
    priceLabel: "۱۲ میلیارد",
    image: media.mirdamad,
    bedrooms: 0,
    area: 110,
    dealType: "sale",
    status: "active",
    features: ["آسانسور", "پارکینگ"],
    views: 640,
  },
  {
    id: "ap5",
    agentId: "a1",
    title: "آپارتمان جردن",
    location: "تهران · جردن",
    neighborhood: "جردن",
    price: 9_500_000_000,
    priceLabel: "۹٫۵ میلیارد",
    image: media.jordan,
    bedrooms: 2,
    area: 95,
    dealType: "rent",
    status: "sold",
    features: ["آسانسور", "پارکینگ"],
    views: 1210,
  },
  {
    id: "ap6",
    agentId: "a1",
    title: "واحد سعادت‌آباد",
    location: "تهران · سعادت‌آباد",
    neighborhood: "سعادت‌آباد",
    price: 14_000_000_000,
    priceLabel: "۱۴ میلیارد",
    image: media.saadatabad,
    bedrooms: 3,
    area: 140,
    dealType: "sale",
    status: "negotiation",
    features: ["آسانسور", "پارکینگ", "انباری", "بالکن"],
    views: 870,
  },
];

export const AGENT_CLIENTS: AgentClient[] = [
  {
    id: "ac1",
    agentId: "a1",
    name: "سارا محمدی",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    budgetMin: 15_000_000_000,
    budgetMax: 22_000_000_000,
    budgetLabel: "۱۵–۲۲ میلیارد",
    preferredNeighborhood: "فرشته",
    urgency: "high",
    preferredBedrooms: 3,
    notes: [
      {
        id: "n1",
        at: "۱۴۰۳/۰۶/۱۸ · ۱۴:۲۰",
        text: "بازدید از آپارتمان فرشته انجام شد — خریدار از نقشه راضی بود ولی تخفیف می‌خواهد.",
      },
    ],
  },
  {
    id: "ac2",
    agentId: "a1",
    name: "علی رضایی",
    phone: "۰۹۳۵۹۸۷۶۵۴۳",
    budgetMin: 40_000_000_000,
    budgetMax: 55_000_000_000,
    budgetLabel: "۴۰–۵۵ میلیارد",
    preferredNeighborhood: "نیاوران",
    urgency: "medium",
    preferredBedrooms: 4,
    notes: [
      {
        id: "n2",
        at: "۱۴۰۳/۰۶/۱۷ · ۱۱:۰۰",
        text: "علاقه‌مند به پنت‌هاوس نیاوران؛ درخواست بازدید آخر هفته.",
      },
    ],
  },
  {
    id: "ac3",
    agentId: "a1",
    name: "مریم کریمی",
    phone: "۰۹۱۹۱۱۱۲۲۳۳",
    budgetMin: 25_000_000_000,
    budgetMax: 35_000_000_000,
    budgetLabel: "۲۵–۳۵ میلیارد",
    preferredNeighborhood: "لواسان",
    urgency: "low",
    preferredBedrooms: 5,
    notes: [],
  },
  {
    id: "ac4",
    agentId: "a1",
    name: "رضا اکبری",
    phone: "۰۹۱۲۷۷۷۸۸۹۹",
    budgetMin: 10_000_000_000,
    budgetMax: 14_000_000_000,
    budgetLabel: "۱۰–۱۴ میلیارد",
    preferredNeighborhood: "ونک",
    urgency: "high",
    preferredBedrooms: 0,
    notes: [
      {
        id: "n3",
        at: "۱۴۰۳/۰۶/۱۶ · ۱۶:۴۵",
        text: "به‌دنبال دفتر اداری نزدیک ونک؛ بودجه منعطف تا ۱۴ میلیارد.",
      },
    ],
  },
];

export const AGENT_TOURS: AgentTour[] = [
  {
    id: "t1",
    agentId: "a1",
    propertyId: "ap3",
    propertyTitle: "آپارتمان فرشته",
    clientName: "سارا محمدی",
    when: "امروز",
    dayLabel: "امروز",
    time: "۱۰:۳۰",
    status: "upcoming",
  },
  {
    id: "t2",
    agentId: "a1",
    propertyId: "ap1",
    propertyTitle: "پنت‌هاوس نیاوران",
    clientName: "علی رضایی",
    when: "امروز",
    dayLabel: "امروز",
    time: "۱۶:۰۰",
    status: "upcoming",
  },
  {
    id: "t3",
    agentId: "a1",
    propertyId: "ap2",
    propertyTitle: "ویلای لواسان",
    clientName: "مریم کریمی",
    when: "فردا",
    dayLabel: "فردا",
    time: "۱۲:۰۰",
    status: "upcoming",
  },
  {
    id: "t4",
    agentId: "a1",
    propertyId: "ap6",
    propertyTitle: "واحد سعادت‌آباد",
    clientName: "رضا اکبری",
    when: "دیروز",
    dayLabel: "دیروز",
    time: "۱۱:۱۵",
    status: "completed",
  },
  {
    id: "t5",
    agentId: "a1",
    propertyId: "ap4",
    propertyTitle: "دفتر ونک",
    clientName: "سارا محمدی",
    when: "این هفته",
    dayLabel: "سه‌شنبه",
    time: "۰۹:۰۰",
    status: "canceled",
  },
];

export const AGENT_TASKS: AgentTask[] = [
  {
    id: "task1",
    agentId: "a1",
    kind: "visit",
    title: "بازدید آپارتمان فرشته",
    detail: "همراه سارا محمدی · بررسی نور و نقشه",
    time: "۱۰:۳۰",
    dayLabel: "امروز",
  },
  {
    id: "task2",
    agentId: "a1",
    kind: "callback",
    title: "تماس با مالک نیاوران",
    detail: "پیگیری تخفیف و زمان قرارداد",
    time: "۱۲:۰۰",
    dayLabel: "امروز",
  },
  {
    id: "task3",
    agentId: "a1",
    kind: "visit",
    title: "بازدید پنت‌هاوس نیاوران",
    detail: "علی رضایی · تور کامل واحد و روف",
    time: "۱۶:۰۰",
    dayLabel: "امروز",
  },
  {
    id: "task4",
    agentId: "a1",
    kind: "contract",
    title: "جلسه پیش‌قرارداد لواسان",
    detail: "مریم کریمی · هماهنگی مدارک و بیعانه",
    time: "۱۱:۰۰",
    dayLabel: "فردا",
  },
  {
    id: "task5",
    agentId: "a1",
    kind: "note",
    title: "ثبت گزارش تماس ونک",
    detail: "رضا اکبری · نیاز به فایل اداری نزدیک ونک",
    time: "۱۸:۳۰",
    dayLabel: "امروز",
    done: true,
  },
];

export const PROPERTY_STATUS_LABEL: Record<AgentPropertyStatus, string> = {
  active: "فعال",
  negotiation: "در حال مذاکره",
  sold: "واگذار شد",
};

export const URGENCY_LABEL: Record<ClientUrgency, string> = {
  low: "عادی",
  medium: "متوسط",
  high: "فوری",
};

export const TOUR_STATUS_LABEL: Record<TourStatus, string> = {
  upcoming: "پیش‌رو",
  completed: "انجام‌شده",
  canceled: "لغو شده",
};

export const TASK_KIND_LABEL: Record<AgentTaskKind, string> = {
  visit: "بازدید",
  callback: "تماس با مالک",
  contract: "قرارداد",
  note: "یادداشت",
};

export const PROPERTY_FEATURE_OPTIONS = [
  "آسانسور",
  "پارکینگ",
  "انباری",
  "بالکن",
  "استخر",
  "نگهبانی",
  "روف‌گاردن",
] as const;

/** Strict agent isolation helpers */
export function getAgentProfile(agentId: string): AgentCrmProfile {
  return AGENT_PROFILES[agentId] ?? AGENT_PROFILES.a1;
}

export function getAgentProperties(agentId: string): AgentProperty[] {
  return AGENT_PROPERTIES.filter((p) => p.agentId === agentId);
}

export function getAgentClients(agentId: string): AgentClient[] {
  return AGENT_CLIENTS.filter((c) => c.agentId === agentId);
}

export function getAgentTours(agentId: string): AgentTour[] {
  return AGENT_TOURS.filter((t) => t.agentId === agentId);
}

export function getAgentTasks(agentId: string): AgentTask[] {
  return AGENT_TASKS.filter((t) => t.agentId === agentId);
}

export function matchPropertiesForClient(
  agentId: string,
  client: AgentClient,
): AgentProperty[] {
  return getAgentProperties(agentId).filter((property) => {
    if (property.status === "sold") return false;
    const inBudget =
      property.price >= client.budgetMin * 0.85 &&
      property.price <= client.budgetMax * 1.15;
    const neighborhoodOk =
      !client.preferredNeighborhood ||
      property.neighborhood.includes(client.preferredNeighborhood) ||
      client.preferredNeighborhood.includes(property.neighborhood);
    const bedsOk =
      client.preferredBedrooms === undefined ||
      client.preferredBedrooms === 0 ||
      property.bedrooms === 0 ||
      property.bedrooms >= client.preferredBedrooms;
    return inBudget && (neighborhoodOk || bedsOk);
  });
}

/** 0–100 score for smart matching CRM badges */
export function scorePropertyMatch(
  property: AgentProperty,
  client: AgentClient,
): number {
  if (property.status === "sold") return 0;

  let score = 35;

  const mid = (client.budgetMin + client.budgetMax) / 2;
  const span = Math.max(client.budgetMax - client.budgetMin, 1);
  const budgetDelta = Math.abs(property.price - mid) / span;
  score += Math.max(0, 35 - budgetDelta * 35);

  if (
    property.neighborhood.includes(client.preferredNeighborhood) ||
    client.preferredNeighborhood.includes(property.neighborhood)
  ) {
    score += 20;
  }

  if (
    client.preferredBedrooms &&
    client.preferredBedrooms > 0 &&
    property.bedrooms >= client.preferredBedrooms
  ) {
    score += 10;
  }

  return Math.max(0, Math.min(98, Math.round(score)));
}

export function bestMatchForClient(
  agentId: string,
  client: AgentClient,
): { property: AgentProperty; score: number } | null {
  const matches = matchPropertiesForClient(agentId, client)
    .map((property) => ({ property, score: scorePropertyMatch(property, client) }))
    .sort((a, b) => b.score - a.score);
  return matches[0] ?? null;
}

export function getAgentCrmMetrics(agentId: string) {
  const properties = getAgentProperties(agentId);
  const clients = getAgentClients(agentId);
  const tours = getAgentTours(agentId);
  const tasks = getAgentTasks(agentId);
  const profile = getAgentProfile(agentId);

  const activeProperties = properties.filter((p) => p.status === "active").length;
  const negotiationCount = properties.filter((p) => p.status === "negotiation").length;
  const highUrgencyClients = clients.filter((c) => c.urgency === "high").length;
  const upcomingTours = tours.filter((t) => t.status === "upcoming").length;
  const todayTasks = tasks.filter((t) => t.dayLabel === "امروز").length;
  const negotiationValue = properties
    .filter((p) => p.status === "negotiation")
    .reduce((sum, p) => sum + p.price, 0);
  const estimatedCommission = Math.round(
    (negotiationValue * profile.commissionRate) / 100,
  );
  const targetProgress = Math.min(
    100,
    Math.round((profile.monthlyClosed / profile.monthlyTarget) * 100),
  );

  return {
    activeProperties,
    negotiationCount,
    assignedClients: clients.length,
    highUrgencyClients,
    scheduledTours: upcomingTours,
    todayTasks,
    estimatedCommission,
    estimatedCommissionLabel: formatBillion(estimatedCommission),
    commissionRate: profile.commissionRate,
    targetProgress,
    monthlyTargetLabel: formatBillion(profile.monthlyTarget),
    monthlyClosedLabel: formatBillion(profile.monthlyClosed),
  };
}

export function formatBillion(value: number): string {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `${billions.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیارد`;
  }
  return value.toLocaleString("fa-IR");
}

export function calcCommission(price: number, ratePercent: number): number {
  return Math.round((price * ratePercent) / 100);
}
