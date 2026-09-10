import FeaturedPropertyHero from "@/components/admin/FeaturedPropertyHero";
import MostViewedProperties from "@/components/admin/MostViewedProperties";

/**
 * Dashboard content. Scroll sequencing (contacts sidebar first, then page)
 * is owned by AdminShell via wheel capture on /admin/dashboard.
 */
export default function AdminDashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:gap-5" data-dashboard-main>
      <div className="sticky top-6 z-20 h-fit">
        <FeaturedPropertyHero />
      </div>
      <div className="relative z-10">
        <MostViewedProperties />
      </div>
    </div>
  );
}
