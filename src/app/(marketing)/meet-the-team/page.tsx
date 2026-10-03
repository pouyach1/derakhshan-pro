import type { Metadata } from "next";
import { LuxuryMeetTeamView } from "@/components/team/LuxuryMeetTeamView";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.teamPage.seoTitle} | ${siteConfig.brand.nameFa}`,
  description: siteConfig.teamPage.seoDescription,
  alternates: { canonical: "/meet-the-team" },
  openGraph: {
    title: `${siteConfig.teamPage.seoTitle} | ${siteConfig.brand.nameFa}`,
    description: siteConfig.teamPage.seoDescription,
    type: "website",
    url: "/meet-the-team",
    locale: "fa_IR",
    siteName: siteConfig.brand.nameFa,
  },
};

export default function MeetTheTeamPage() {
  return <LuxuryMeetTeamView />;
}
