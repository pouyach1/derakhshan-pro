import type { Metadata } from "next";
import AgentProfileView from "@/components/agents/AgentProfileView";
import { siteConfig } from "@/config/siteConfig";
import { getPublicAgent } from "@/server/services/agents-public";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const agent = await getPublicAgent(id);
    const title = `${agent.name} | تیم ${siteConfig.brand.nameFa}`;
    const description =
      agent.bio?.trim().slice(0, 160) ||
      `${agent.title} — ${siteConfig.brand.nameFa}`;
    const canonical = `/agents/${agent.id}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: "profile",
        url: canonical,
        locale: "fa_IR",
        siteName: siteConfig.brand.nameFa,
        images: agent.avatarUrl ? [{ url: agent.avatarUrl }] : undefined,
      },
    };
  } catch {
    return {
      title: `مشاور یافت نشد | ${siteConfig.brand.nameFa}`,
      robots: { index: false, follow: false },
    };
  }
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;
  return <AgentProfileView id={id} />;
}
