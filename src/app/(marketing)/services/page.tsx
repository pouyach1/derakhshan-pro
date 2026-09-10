export default function ServicesPage() {
  return (
    <section className="bg-beige px-[var(--site--margin)] pb-24 pt-page-top text-brand-800">
      <div className="mx-auto max-w-rio">
        <h1 className="rio-h1">Services</h1>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {["Sell", "Lease", "Value"].map((item) => (
            <article key={item} className="rounded-rio border border-brand-800/10 p-8">
              <h2 className="font-display text-3xl uppercase tracking-tight">{item}</h2>
              <p className="mt-4 text-brand-800/75">
                Commercial brokerage across retail, industrial and office property in Cape Town and
                surrounding suburbs.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
