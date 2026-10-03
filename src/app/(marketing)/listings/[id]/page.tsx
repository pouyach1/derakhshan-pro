import type { Metadata } from "next";
import PropertyDetailView from "@/components/listings/PropertyDetailView";
import { siteConfig } from "@/config/siteConfig";
import { getProperty } from "@/server/services/properties";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const property = await getProperty(id);
    if (property.status !== "published" && property.status !== "sold") {
      return {
        title: `ملک یافت نشد | ${siteConfig.brand.nameFa}`,
        robots: { index: false, follow: false },
      };
    }

    const locationLabel = [property.location, property.neighborhood]
      .filter(Boolean)
      .join("، ");
    const description =
      (property.description?.trim().slice(0, 160) ||
        `${property.title}${locationLabel ? ` — ${locationLabel}` : ""}`) ||
      `جزئیات فایل در ${siteConfig.brand.nameFa}`;
    const canonical = `/listings/${property.id}`;
    const image = property.imageUrl || siteConfig.seo.ogImage;

    return {
      title: `${property.title} | ${siteConfig.brand.nameFa}`,
      description,
      alternates: { canonical },
      openGraph: {
        title: property.title,
        description,
        type: "website",
        url: canonical,
        locale: "fa_IR",
        siteName: siteConfig.brand.nameFa,
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title: property.title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: `ملک یافت نشد | ${siteConfig.brand.nameFa}`,
      robots: { index: false, follow: false },
    };
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PropertyDetailView id={id} />;
}
