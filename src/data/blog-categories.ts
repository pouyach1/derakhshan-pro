/** Editorial categories shared by forms, filters, and server validation. */
export const BLOG_CATEGORIES = [
  "خرید ملک",
  "فروش ملک",
  "سرمایه‌گذاری",
  "بازار املاک",
  "راهنمای محله‌ها",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
