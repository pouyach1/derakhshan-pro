import Image from "next/image";
import Button from "@/components/ui/Button";
import { OFF_MARKET_CTA } from "@/config/home";

export default function FullImageCtaSection() {
  return (
    <section className="relative overflow-hidden bg-brand-800 text-beige">
      <div className="absolute inset-0">
        <Image
          src={OFF_MARKET_CTA.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-brand-800/70" />
      </div>
      <div className="rio-container relative z-10 grid gap-10 py-section-lg md:grid-cols-12">
        <h2 className="rio-h2 md:col-span-7">{OFF_MARKET_CTA.title}</h2>
        <div className="md:col-span-5">
          <p className="text-beige/85">{OFF_MARKET_CTA.body}</p>
          <div className="mt-8">
            <Button href={OFF_MARKET_CTA.cta.href} variant="yellow">
              {OFF_MARKET_CTA.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
