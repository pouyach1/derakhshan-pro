import Link from "next/link";
import { NAV, SITE } from "@/config/site";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-brand-800 text-beige">
      <div className="rio-container grid gap-12 py-section-md md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="text-beige" />
          <p className="mt-6 max-w-sm text-body-lg text-beige/75">
            We broker, value and track commercial property across Cape Town.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-8 inline-block font-display text-2xl uppercase tracking-tight text-yellow-500 transition-colors duration-300 hover:text-beige md:text-3xl"
          >
            {SITE.email}
          </a>
        </div>

        <div className="md:col-span-3">
          <p className="text-sm uppercase tracking-wide text-beige/60">Contact Details</p>
          <ul className="mt-4 space-y-2 text-beige/90">
            <li>
              <a href={`tel:${SITE.phone.replace(/\s+/g, "")}`} className="hover:text-yellow-500">
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
          <p className="text-sm uppercase tracking-wide text-beige/60">Navigation</p>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="uppercase tracking-wide hover:text-yellow-500">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm uppercase tracking-wide text-beige/60">Socials</p>
          <a
            href={SITE.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block uppercase tracking-wide hover:text-yellow-500"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
