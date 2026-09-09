import { LAWS } from "@/config/home";

export default function LawsSection() {
  return (
    <section className="bg-beige py-section-md text-brand-800">
      <div className="rio-container">
        <div className="mb-12 max-w-4xl">
          <h2 className="rio-h2">When you do a lot of deals, you start to notice patterns.</h2>
          <p className="mt-4 text-sm uppercase tracking-[0.16em] text-brand-500">Rio&apos;s Laws of Brokering</p>
        </div>

        <div className="grid gap-px bg-brand-800/15 md:grid-cols-3">
          {LAWS.map((law, index) => (
            <article
              key={law.title}
              className="group bg-beige p-6 transition-colors duration-300 hover:bg-brand-800 md:min-h-56"
            >
              <p className="text-xs uppercase tracking-wide text-brand-500 group-hover:text-yellow-500">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-display text-xl uppercase leading-tight tracking-tight text-brand-800 transition-colors duration-300 group-hover:text-beige">
                {law.title}
              </h3>
              <p className="mt-3 text-sm text-brand-800/70 transition-colors duration-300 group-hover:text-beige/80">
                {law.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
