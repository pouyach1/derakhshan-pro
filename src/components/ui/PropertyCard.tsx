import Image from "next/image";
import type { Deal } from "@/types";
import { cn } from "@/lib/utils";

export default function PropertyCard({ deal, className }: { deal: Deal; className?: string }) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-rio bg-brand-800 text-beige",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-rio group-hover:scale-105 group-hover:grayscale"
        />
        <div className="absolute inset-0 bg-brand-800/0 transition-colors duration-500 group-hover:bg-brand-800/35" />
        <div className="absolute inset-x-0 bottom-0 translate-y-1 p-3 transition-transform duration-500 ease-rio group-hover:translate-y-0 sm:translate-y-2 sm:p-5">
          <p className="text-[10px] uppercase tracking-wide text-beige/80 sm:text-xs">
            {deal.area}
            {deal.size ? ` · ${deal.size}` : ""}
          </p>
          <h3 className="mt-1.5 font-vazirmatn text-sm font-semibold leading-6 tracking-tight sm:mt-2 sm:text-xl sm:leading-relaxed">
            {deal.title}
          </h3>
          <p className="mt-2 font-vazirmatn text-xs text-yellow-500 sm:mt-3 sm:text-sm">✔ {deal.status}</p>
        </div>
      </div>
    </article>
  );
}
