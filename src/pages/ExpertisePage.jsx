import { KEY_FIGURES, MIXED } from "../data/site.js";
import faqs from "../data/expertiseFaq.json";
import FaqList from "../components/ui/FaqList.jsx";

export default function ExpertisePage() {
  return (
    <>
      <section className="mixed block container mixed--media_right">
        <div className="mixed-media">
          <img src={MIXED.expertise.image} alt="" className="mixed-img" />
        </div>
        <div className="mixed-content">
          <h1 className="mixed-title text-xl">Notre expertise</h1>
          <div className="mixed-text cms">
            {MIXED.expertise.html.map((paragraph, index) => (
              <p key={paragraph}>{index === 0 ? <strong>{paragraph}</strong> : paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="key_figures container" style={{ padding: "48px 16px" }}>
        <h2 className="text-m" style={{ marginBottom: 32 }}>
          Luxury Places en quelques chiffres
        </h2>
        <ul className="key_figures-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {KEY_FIGURES.map((item) => (
            <li className="key_figures-item" key={item.label}>
              <h3 className="key_figures-item-title text-2xl">{item.value}</h3>
              <p className="key_figures-item-text text-xs">{item.label}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="faq block container" id="production-visuelle">
        <h2 className="faq-title text-m">Une stratégie marketing pensée pour chaque propriété</h2>
        <FaqList items={faqs} />
      </section>
    </>
  );
}
