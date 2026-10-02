import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Home,
  LayoutDashboard,
  MessageCircle,
  Newspaper,
  Users,
} from "lucide-react";

export type AgentNavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  /** Shown in the primary mobile bottom bar */
  primary?: boolean;
};

export const AGENT_NAV_ITEMS: AgentNavItem[] = [
  {
    href: "/agent/dashboard",
    label: "داشبورد",
    shortLabel: "خانه",
    icon: LayoutDashboard,
    primary: true,
  },
  {
    href: "/agent/properties",
    label: "املاک من",
    shortLabel: "املاک",
    icon: Home,
    primary: true,
  },
  {
    href: "/agent/clients",
    label: "مشتریان",
    shortLabel: "مشتری",
    icon: Users,
    primary: true,
  },
  {
    href: "/agent/chat",
    label: "چت ادمین",
    shortLabel: "چت",
    icon: MessageCircle,
    primary: true,
  },
  {
    href: "/agent/schedule",
    label: "بازدیدها",
    shortLabel: "بازدید",
    icon: CalendarDays,
  },
  {
    href: "/agent/blog",
    label: "وبلاگ",
    shortLabel: "وبلاگ",
    icon: Newspaper,
  },
];

export const AGENT_PRIMARY_NAV = AGENT_NAV_ITEMS.filter((item) => item.primary);
export const AGENT_MORE_NAV = AGENT_NAV_ITEMS.filter((item) => !item.primary);
