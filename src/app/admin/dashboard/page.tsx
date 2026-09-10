import FeaturedPropertyHero from "@/components/admin/FeaturedPropertyHero";
import MostViewedProperties from "@/components/admin/MostViewedProperties";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
      <FeaturedPropertyHero />
      <MostViewedProperties />
    </div>
  );
}
