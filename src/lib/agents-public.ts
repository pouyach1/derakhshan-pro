/**
 * Public agent resume/profile cards keyed by CRM agentId (a1, a2, a3…).
 */

export type PublicAgentProfile = {
  id: string;
  name: string;
  title: string;
  department: string;
  avatarUrl: string;
  badge: string;
  bio: string;
  philosophy: string;
  phone: string;
  email: string | null;
  stats: Array<{ label: string; value: string }>;
  specialties: string[];
  listedProperties: number;
  dealsClosed: number;
};

const BASE: Record<
  string,
  Omit<PublicAgentProfile, "listedProperties" | "dealsClosed" | "phone" | "email" | "name" | "avatarUrl">
> = {
  a1: {
    id: "a1",
    title: "مشاور ارشد منطقه یک و بالاشهر کرج",
    department: "مشاوره فروش و سرمایه‌گذاری",
    badge: "مشاور ممتاز دفتر · فایل‌های VIP",
    bio: "مسئول پرونده‌های خرید و فروش لوکس در عظیمیه، گوهردشت و مهرشهر؛ از کشف فایل آف‌مارکت تا هماهنگی بازدید خصوصی و بستن معامله.",
    philosophy: "هر فایل باید شفاف، دقیق و قابل اعتماد ارائه شود — قیمت، سند و بازدید بدون ابهام.",
    stats: [
      { label: "تمرکز منطقه‌ای", value: "عظیمیه / گوهردشت" },
      { label: "سبک کار", value: "بازدید خصوصی" },
      { label: "تخصص", value: "آپارتمان VIP" },
    ],
    specialties: ["آپارتمان لوکس", "سرمایه‌گذاری", "مذاکره قیمت", "بازدید خصوصی"],
  },
  a2: {
    id: "a2",
    title: "مشاور ارشد آپارتمان و قراردادها",
    department: "مشاوره خریداران VIP",
    badge: "هماهنگ‌کننده پرونده‌های قراردادی",
    bio: "همراهی کامل خریداران از انتخاب فایل تا پیش‌قرارداد؛ تمرکز روی شفافیت بودجه، محله و زمان‌بندی تحویل.",
    philosophy: "اعتماد موکل در جزئیات ساخته می‌شود — از اولین تماس تا کلیدسپاری.",
    stats: [
      { label: "تمرکز", value: "گوهردشت / مهرشهر" },
      { label: "نقش", value: "خریدارمحور" },
      { label: "تخصص", value: "قرارداد و تحویل" },
    ],
    specialties: ["خرید آپارتمان", "مشاوره بودجه", "پیگیری قرارداد", "تحویل ملک"],
  },
  a3: {
    id: "a3",
    title: "مشاور املاک اداری و اجاره تجاری",
    department: "اجاره و واحدهای اداری",
    badge: "متخصص فایل‌های اداری و تجاری",
    bio: "هدایت پرونده‌های اجاره دفتر و واحدهای تجاری در مهرشهر و مراکز اداری کرج با تمرکز بر قرارداد رسمی و استقرار سریع.",
    philosophy: "اجاره موفق یعنی پلان مناسب، دسترسی درست و قرارداد بدون حاشیه.",
    stats: [
      { label: "تمرکز", value: "اداری / تجاری" },
      { label: "قرارداد", value: "رسمی دفتر" },
      { label: "تخصص", value: "اجاره بلندمدت" },
    ],
    specialties: ["اجاره اداری", "ملک تجاری", "مذاکره اجاره", "استقرار مستأجر"],
  },
};

export function publicAgentTemplate(agentId: string) {
  return BASE[agentId] ?? null;
}
