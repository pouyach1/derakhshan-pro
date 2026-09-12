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
  description: "CRM اختصاصی مشاور — املاک، مشتریان و بازدیدهای شخصی",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${vazirmatn.variable} ${vazirmatn.className}`}>
      <AgentShell>{children}</AgentShell>
    </div>
  );
}
