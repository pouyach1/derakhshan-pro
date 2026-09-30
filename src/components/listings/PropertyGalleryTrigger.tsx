"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import PropertyLightbox from "@/components/listings/PropertyLightbox";
import { frameLabel, listPropertyImages } from "@/lib/property-images";
import { fallbackImage } from "@/lib/money";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PropertyGalleryTriggerProps = {
  item: {
    title: string;
    code?: string;
    imageUrl?: string | null;
    gallery?: string[] | null;
  };
  sizes: string;
  priority?: boolean;
  /** Hide the corner counter when the card already shows it. */
  showCount?: boolean;
  className?: string;
};

export default function PropertyGalleryTrigger({
  item,
  sizes,
  priority = false,
  showCount = true,
  className,
}: PropertyGalleryTriggerProps) {
  const reduceMotion = useReducedMotion();
  const images = useMemo(() => listPropertyImages(item), [item]);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [broken, setBroken] = useState(false);
  const total = images.length;

  return (
    <>
      <button
        type="button"
        aria-label={`مشاهده گالری ${item.title}${total > 1 ? `، ${frameLabel(1, total)}` : ""}`}
        className={cn(
          "absolute inset-0 z-[1] cursor-pointer overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white",
          className,
        )}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <motion.span
          className="absolute inset-0 block"
          animate={{ scale: hovered && !reduceMotion ? 1.03 : 1 }}
          transition={{ duration: 0.7, ease: EASE.expoOut }}
        >
          <Image
            src={broken ? fallbackImage(null) : images[0]}
            alt=""
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
            onError={() => {
              if (!broken) setBroken(true);
            }}
          />
        </motion.span>
      </button>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-[4] bg-[#07080c] transition-opacity duration-500",
          hovered ? "opacity-30" : "opacity-0",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-[4] flex items-center justify-center transition-opacity duration-500",
          hovered ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="font-vazirmatn text-[11px] font-medium tracking-[0.14em] text-white">
          مشاهده گالری
        </span>
      </span>
      {showCount && total > 1 ? (
        <span className="pointer-events-none absolute bottom-3 end-3 z-[4] font-mono text-[10px] tracking-[0.2em] text-white">
          {frameLabel(1, total)}
        </span>
      ) : null}
      <PropertyLightbox
        open={open}
        images={images}
        title={item.title}
        code={item.code}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
