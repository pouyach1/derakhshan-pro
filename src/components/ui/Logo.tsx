import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "font-display text-lg uppercase tracking-[0.08em] text-beige transition-colors duration-300 hover:text-yellow-500 md:text-xl",
        className,
      )}
      aria-label="RIO Property home"
    >
      Rio Property
    </Link>
  );
}
