import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | RIO Property",
  description: "Real estate admin dashboard for contacts, leads, and most viewed properties.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-admin-canvas text-slate-900 antialiased">{children}</div>;
}
