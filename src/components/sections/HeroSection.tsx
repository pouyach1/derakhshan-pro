import Image from "next/image";
import { HERO } from "@/config/home";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-brand-800 text-beige">
      <Image
        src={HERO.image}
        alt="Cape Town commercial property skyline"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-800/80 via-brand-800/25 to-brand-800/40" />

      <div className="rio-container relative z-10 flex min-h-[100dvh] flex-col justify-end pb-16 pt-page-top md:pb-24">
        <div className="mb-10 grid max-w-3xl gap-6 md:grid-cols-[auto_1fr] md:items-end">
          <p className="text-sm uppercase tracking-[0.18em] text-beige/85">
            {HERO.eyebrow.join(" / ")}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-beige/85 md:text-base">{HERO.support}</p>
        </div>
        <h1 className="max-w-5xl font-display text-[clamp(3.2rem,9vw,7rem)] uppercase leading-[0.92] tracking-tight text-beige">
          {HERO.title}
        </h1>
      </div>
    </section>
  );
}
