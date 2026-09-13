import type { Metadata } from "next";
import { LuxuryMeetTeamView } from "@/components/team/LuxuryMeetTeamView";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.teamPage.seoTitle} | ${siteConfig.brand.nameFa}`,
  description: siteConfig.teamPage.seoDescription,
};

export default function MeetTheTeamPage() {
  return <LuxuryMeetTeamView />;
}
