import Image from "next/image";
import { CLIENT_LOGOS } from "@/config/home";

export default function ClientLogoMarquee() {
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="overflow-hidden border-y border-brand-800/10 bg-beige py-12">
      <div className="rio-container mb-8">
        <p className="text-sm uppercase tracking-[0.16em] text-brand-500">
          Some of the people we&apos;ve worked with
        </p>
      </div>
      <div className="relative">
        <div className="flex w-max animate-marquee gap-16 px-8">
          {logos.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="flex h-14 w-40 shrink-0 items-center justify-center opacity-70"
            >
              <Image src={src} alt="" width={160} height={56} className="max-h-12 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
