import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import AgentShell from "@/components/agent/AgentShell";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "پنل مشاور | درخشان پرو",
  description: "مدیریت آگهی‌ها، بازدیدها و معاملات شخصی مشاور",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${vazirmatn.variable} ${vazirmatn.className}`}>
      <AgentShell>{children}</AgentShell>
    </div>
  );
}
