import FeaturedPropertyHero from "@/components/admin/FeaturedPropertyHero";
import MostViewedProperties from "@/components/admin/MostViewedProperties";

/**
 * Main content column only (contacts live in AdminShell).
 * Hero and Most Viewed stack vertically — no sticky/z-index overlap.
 */
export default function AdminDashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-8" data-dashboard-main>
      <FeaturedPropertyHero />
      <div className="relative z-0">
        <MostViewedProperties />
      </div>
    </div>
  );
}
