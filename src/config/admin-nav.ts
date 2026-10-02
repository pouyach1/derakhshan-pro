import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  Home,
  MessageCircle,
  Newspaper,
  Settings,
  Users,
  UserRoundSearch,
  Workflow,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  /** Shown in the primary mobile bottom bar */
  primary?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "خانه", shortLabel: "خانه", icon: Home, primary: true },
  { href: "/admin/properties", label: "آگهی‌ها", shortLabel: "آگهی", icon: Building2, primary: true },
  { href: "/admin/leads", label: "پیگیری‌ها", shortLabel: "لید", icon: Workflow, primary: true },
  { href: "/admin/clients", label: "مشتریان", shortLabel: "مشتری", icon: Users, primary: true },
  { href: "/admin/tours", label: "بازدیدها", shortLabel: "بازدید", icon: CalendarDays },
  { href: "/admin/agents", label: "مشاوران", shortLabel: "مشاور", icon: UserRoundSearch },
  { href: "/admin/blog", label: "وبلاگ", shortLabel: "وبلاگ", icon: Newspaper },
  { href: "/admin/support", label: "پشتیبانی", shortLabel: "پشتیبانی", icon: MessageCircle },
  { href: "/admin/team-chat", label: "چت ادمین", shortLabel: "چت", icon: MessageCircle },
  { href: "/admin/settings", label: "تنظیمات", shortLabel: "تنظیمات", icon: Settings },
];

export const ADMIN_PRIMARY_NAV = ADMIN_NAV_ITEMS.filter((item) => item.primary);
export const ADMIN_MORE_NAV = ADMIN_NAV_ITEMS.filter((item) => !item.primary);
