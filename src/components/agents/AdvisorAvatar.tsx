"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type AdvisorAvatarSize = "sm" | "md" | "lg" | "xl" | "hero";

const SIZE: Record<AdvisorAvatarSize, { box: string; text: string; icon: string; px: number }> = {
  sm: { box: "h-7 w-7", text: "text-[11px]", icon: "h-3.5 w-3.5", px: 28 },
  md: { box: "h-11 w-11", text: "text-sm", icon: "h-4 w-4", px: 44 },
  lg: { box: "h-14 w-14 sm:h-16 sm:w-16", text: "text-lg", icon: "h-5 w-5", px: 64 },
  xl: { box: "h-20 w-20", text: "text-2xl", icon: "h-7 w-7", px: 80 },
  hero: { box: "h-28 w-28 sm:h-32 sm:w-32", text: "text-3xl", icon: "h-9 w-9", px: 128 },
};

type AdvisorAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: AdvisorAvatarSize;
  className?: string;
  /** Meaningful alt when the face identifies the person; empty = decorative. */
  alt?: string;
  decorative?: boolean;
};

function initialOf(name: string) {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0) : "";
}

/**
 * Shared advisor face — real `avatarUrl` when present, initials/icon otherwise.
 * Replaces hero-banner fallbacks for missing person photos.
 */
export default function AdvisorAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
  alt,
  decorative = false,
}: AdvisorAvatarProps) {
  const [broken, setBroken] = useState(false);
  const src = avatarUrl?.trim() || "";
  useEffect(() => {
    setBroken(false);
  }, [src]);

  const showImage = Boolean(src && !broken);
  const dim = SIZE[size];
  const initial = initialOf(name);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-sky-800 ring-2 ring-white/80",
        dim.box,
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={decorative ? "" : alt ?? name}
          width={dim.px}
          height={dim.px}
          className="h-full w-full object-cover"
          sizes={`${dim.px}px`}
          onError={() => setBroken(true)}
        />
      ) : (
        <span
          className={cn(
            "flex h-full w-full items-center justify-center font-vazirmatn font-bold",
            dim.text,
          )}
          aria-hidden={decorative || undefined}
        >
          {initial ? initial : <UserRound className={dim.icon} strokeWidth={1.9} />}
        </span>
      )}
    </span>
  );
}
