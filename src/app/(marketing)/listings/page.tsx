import type { Metadata } from "next";
import ListingsView from "@/components/listings/ListingsView";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `آرشیو املاک | ${siteConfig.brand.nameFa}`,
  description: `فایل‌های فروش و اجاره ${siteConfig.brand.nameFa}`,
};

export default function ListingsPage() {
  return <ListingsView />;
}
