import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "yellow";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export default function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center gap-3 rounded-rio-sm px-5 py-3 text-sm uppercase tracking-wide transition-all duration-300 ease-rio",
    variant === "primary" &&
      "bg-brand-500 text-beige hover:bg-beige hover:text-brand-800",
    variant === "secondary" &&
      "bg-beige text-brand-500 hover:bg-brand-500 hover:text-beige",
    variant === "ghost" && "bg-transparent text-beige hover:text-yellow-500",
    variant === "yellow" && "bg-transparent text-yellow-500 hover:text-beige",
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      <span
        aria-hidden
        className="inline-flex h-4 w-4 items-center justify-center transition-transform duration-300 ease-rio group-hover:translate-x-1 group-hover:-translate-y-1"
      >
        ↗
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
