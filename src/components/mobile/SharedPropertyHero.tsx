"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fallbackImage } from "@/lib/money";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";

/** شناسه‌های مشترک برای morph کارت → جزئیات */
export function propertyImageLayoutId(id: string) {
  return `property-image-${id}`;
}

export function propertyTitleLayoutId(id: string) {
  return `property-title-${id}`;
}

type SharedPropertyImageProps = {
  id: string;
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** تصویر مشترک با layoutId — فقط transform توسط Framer کنترل می‌شود */
export function SharedPropertyImage({
  id,
  src,
  alt,
  className,
  priority,
  sizes = "(max-width: 428px) 100vw, 390px",
}: SharedPropertyImageProps) {
  return (
    <motion.div
      layoutId={propertyImageLayoutId(id)}
      className={cn("relative overflow-hidden bg-slate-950", className)}
      transition={IOS_PAGE_SPRING}
      style={{ borderRadius: 24, willChange: "transform" }}
    >
      <Image
        src={fallbackImage(src)}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </motion.div>
  );
}

type SharedPropertyTitleProps = {
  id: string;
  title: string;
  className?: string;
  as?: "h1" | "h2";
};

export function SharedPropertyTitle({
  id,
  title,
  className,
  as = "h2",
}: SharedPropertyTitleProps) {
  const Comp = motion[as];
  return (
    <Comp
      layoutId={propertyTitleLayoutId(id)}
      className={cn("font-vazirmatn font-semibold", className)}
      transition={IOS_PAGE_SPRING}
      style={{ willChange: "transform" }}
    >
      {title}
    </Comp>
  );
}
