import Image from "next/image";
import { PERSONAS } from "@/config/home";

export default function PersonasSection() {
  return (
    <section className="bg-beige py-section-md text-brand-800">
      <div className="rio-container">
        <div className="mb-12 max-w-4xl">
          <h2 className="rio-h2">One of these? You&apos;re in the right place.</h2>
          <p className="mt-4 text-sm uppercase tracking-[0.14em] text-brand-500">
            what matters depends on who you are
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PERSONAS.map((persona) => (
            <article
              key={persona.id}
              className="group relative min-h-[28rem] overflow-hidden rounded-rio bg-brand-800 text-beige"
            >
              <Image
                src={persona.image}
                alt={persona.title}
                fill
                sizes="(max-width: 1280px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-rio group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-800 via-brand-800/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl uppercase tracking-tight">{persona.title}</h3>
                <p className="mt-3 max-h-0 overflow-hidden text-sm text-beige/85 opacity-0 transition-all duration-500 ease-rio group-hover:max-h-28 group-hover:opacity-100 xl:max-h-0 xl:opacity-0 xl:group-hover:max-h-28 xl:group-hover:opacity-100">
                  {persona.description}
                </p>
                <p className="mt-3 text-sm text-beige/85 xl:hidden">{persona.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
