import FeaturedPropertyHero from "@/components/admin/FeaturedPropertyHero";
import MostViewedProperties from "@/components/admin/MostViewedProperties";

/**
 * Pure CSS scroll architecture:
 * - Hero stays sticky while the page scrolls
 * - Contacts sidebar (in AdminShell) scrolls independently via overflow CSS
 * - No JS wheel listeners or scroll locks
 */
export default function AdminDashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:gap-5" data-dashboard-main>
      <div className="sticky top-6 z-10 h-fit">
        <FeaturedPropertyHero />
      </div>
      <div className="relative z-0">
        <MostViewedProperties />
      </div>
    </div>
  );
}
