"use client";

import FeaturedPropertyHero from "@/components/admin/FeaturedPropertyHero";
import MostViewedProperties from "@/components/admin/MostViewedProperties";
import { useScrollSync } from "@/hooks/useScrollSync";

/**
 * Dashboard with proportional scroll sync:
 * ~40% of the journey feeds the contacts sidebar, then the page unlocks (60%).
 * Disabled automatically below the lg breakpoint.
 */
export default function AdminDashboardPage() {
  useScrollSync({
    enabled: true,
    sidebarShare: 0.4,
    minWidth: 1024,
    sidebarSelector: "[data-contacts-scroll]",
  });

  return (
    <div className="flex min-w-0 flex-col gap-4 scroll-smooth lg:gap-5" data-dashboard-main>
      <div className="sticky top-6 z-20 h-fit">
        <FeaturedPropertyHero />
      </div>
      <div className="relative z-10">
        <MostViewedProperties />
      </div>
    </div>
  );
}
