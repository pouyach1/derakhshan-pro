import Link from "next/link";
import { NAV, SITE } from "@/config/site";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-beige">
      <div className="rio-container grid gap-12 py-section-md md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="text-beige" />
          <p className="mt-6 max-w-sm font-vazirmatn text-sm leading-relaxed text-beige/75 md:text-base">
            {SITE.description}
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-8 inline-block font-sans text-xl font-semibold uppercase tracking-[0.14em] text-sky-400 transition-colors duration-300 hover:text-sky-300 md:text-2xl"
          >
            {SITE.email}
          </a>
        </div>

        <div className="md:col-span-3">
          <p className="font-vazirmatn text-sm text-beige/60">راه‌های ارتباط</p>
          <ul className="mt-4 space-y-2 font-vazirmatn text-beige/90">
            <li>
              <a href={`tel:${SITE.phone.replace(/\s+/g, "")}`} className="hover:text-sky-400">
                {SITE.phone}
              </a>
            </li>
            <li>{SITE.address.line1}</li>
            <li>{SITE.address.line2}</li>
            <li>
              {SITE.address.region}
              <br />
              {SITE.address.city} {SITE.address.postal}
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="font-vazirmatn text-sm text-beige/60">ناوبری</p>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-vazirmatn hover:text-sky-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="font-vazirmatn text-sm text-beige/60">شبکه‌های اجتماعی</p>
          <a
            href={SITE.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block font-sans text-sm uppercase tracking-[0.16em] text-sky-400 hover:text-sky-300"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
