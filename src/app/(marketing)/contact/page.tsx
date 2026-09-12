import type { Metadata } from "next";
import { LuxuryContactView } from "@/components/contact/LuxuryContactView";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `ارتباط با ما | ${SITE.nameFa}`,
  description:
    "ارتباط با دپارتمان املاک درخشان — پشتیبانی VIP، مشاوره حقوقی و رزرو جلسه حضوری در دفتر مرکزی نیاوران.",
};

export default function ContactPage() {
  return <LuxuryContactView />;
}
