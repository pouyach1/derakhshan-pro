"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { NAV } from "@/config/site";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

function LoginButton({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/login"
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full",
        "bg-gradient-to-l from-sky-400 via-sky-500 to-cyan-400 px-5 py-2.5",
        "font-vazirmatn text-sm font-semibold text-slate-950",
        "shadow-[0_10px_30px_-12px_rgba(56,189,248,0.85)]",
        "ring-1 ring-white/25 transition duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(56,189,248,0.95)]",
        "active:translate-y-0",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] opacity-0 transition duration-500 group-hover:translate-x-[-120%] group-hover:opacity-100"
      />
      <LogIn className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2.1} />
      <span className="relative">ورود</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled || open ? "border-b border-white/10 bg-slate-950/90 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="rio-container flex h-16 items-center justify-between gap-4 py-6 md:h-20">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="اصلی">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-vazirmatn text-sm text-beige/90 transition-colors duration-300 hover:text-sky-400"
              >
                {item.label}
              </Link>
            ))}
            <LoginButton className="ms-2" />
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <LoginButton className="px-4 py-2 text-xs" />
            <button
              type="button"
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              onClick={() => setOpen((value) => !value)}
            >
              <span
                className={cn(
                  "block h-px w-6 bg-beige transition-transform duration-500 ease-rio",
                  open && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-beige transition-opacity duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-beige transition-transform duration-500 ease-rio",
                  open && "-translate-y-[7px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-0 z-40 bg-slate-950 transition-transform duration-700 ease-rio lg:hidden",
          open ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <nav
          className="rio-container flex h-full flex-col justify-center gap-6 pt-20"
          aria-label="موبایل"
        >
          {NAV.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-vazirmatn text-3xl text-beige transition-colors duration-300 hover:text-sky-400"
              style={{ transitionDelay: open ? `${index * 60}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
          <LoginButton className="mt-4 w-full max-w-xs py-3.5 text-base" onClick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
}
