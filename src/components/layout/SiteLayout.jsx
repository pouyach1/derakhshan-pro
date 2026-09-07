import { Outlet } from "react-router-dom";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-beige font-sans">
      <SiteHeader />
      <main className="flex-1 py-16">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
