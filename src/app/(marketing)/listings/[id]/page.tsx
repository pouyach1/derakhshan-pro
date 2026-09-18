import PropertyDetailView from "@/components/listings/PropertyDetailView";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyDetailView id={id} />;
}
