"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV } from "@/config/site";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

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
          scrolled || open ? "bg-brand-800/95 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="rio-container flex h-16 items-center justify-between py-6 md:h-20">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm uppercase tracking-wide text-beige/90 transition-colors duration-300 hover:text-yellow-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
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
      </header>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-0 z-40 bg-brand-800 transition-transform duration-700 ease-rio lg:hidden",
          open ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <nav className="rio-container flex h-full flex-col justify-center gap-6 pt-20" aria-label="Mobile">
          {NAV.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl uppercase tracking-tight text-beige transition-colors duration-300 hover:text-yellow-500"
              style={{ transitionDelay: open ? `${index * 60}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
