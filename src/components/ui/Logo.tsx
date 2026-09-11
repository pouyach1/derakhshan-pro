import Link from "next/link";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

export default function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex flex-col items-start", className)}
      aria-label={`${SITE.brandEn} — صفحه اصلی`}
    >
      <span className="font-sans text-sm font-semibold uppercase tracking-[0.28em] text-sky-400 transition group-hover:text-sky-300 md:text-base">
        {SITE.brandEn}
      </span>
      <span className="mt-0.5 font-vazirmatn text-[11px] text-beige/70">{SITE.nameFa}</span>
    </Link>
  );
}
