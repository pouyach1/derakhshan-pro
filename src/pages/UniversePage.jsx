import { MIXED } from "../data/site.js";
import faqs from "../data/universeFaq.json";
import FaqList from "../components/ui/FaqList.jsx";

export default function UniversePage() {
  return (
    <>
      <section className="mixed block container">
        <div className="mixed-media">
          <img src={MIXED.universe.image} alt="" className="mixed-img" />
        </div>
        <div className="mixed-content">
          <h1 className="mixed-title text-xl">Notre univers</h1>
          <div className="mixed-text cms">
            {MIXED.universe.html.map((paragraph, index) => (
              <p key={paragraph}>{index === 0 ? <strong>{paragraph}</strong> : paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="faq block container">
        <h2 className="faq-title text-m">Foire aux questions</h2>
        <FaqList items={faqs} />
      </section>
    </>
  );
}
