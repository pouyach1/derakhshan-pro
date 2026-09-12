import type { Metadata } from "next";
import { LuxuryMeetTeamView } from "@/components/team/LuxuryMeetTeamView";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `تیم مشاوران | ${SITE.nameFa}`,
  description:
    "آشنایی با نخبگان درخشان پرو — مدیریت ارشد، مشاوران پنت‌هاوس، کارشناسان ویلا و دپارتمان حقوقی با استاندارد VIP.",
};

export default function MeetTheTeamPage() {
  return <LuxuryMeetTeamView />;
}
