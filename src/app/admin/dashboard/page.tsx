"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ContactsSidebar from "@/components/admin/ContactsSidebar";
import FeaturedPropertyHero from "@/components/admin/FeaturedPropertyHero";
import MostViewedProperties from "@/components/admin/MostViewedProperties";

export default function AdminDashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-dvh bg-admin-canvas">
      <AdminHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 lg:px-6 lg:py-6">
        <ContactsSidebar />

        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <FeaturedPropertyHero />
          <MostViewedProperties />
        </div>
      </div>
    </div>
  );
}
