import AgentProfileView from "@/components/agents/AgentProfileView";

type Props = { params: Promise<{ id: string }> };

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;
  return <AgentProfileView id={id} />;
}
