import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogBackLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

/** Deterministic back link to the Blog management root. */
export default function BlogBackLink({
  href,
  label = "بازگشت به وبلاگ",
  className,
}: BlogBackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B3A5C]/65 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
        className,
      )}
    >
      <ArrowRight className="h-4 w-4" aria-hidden />
      {label}
    </Link>
  );
}
