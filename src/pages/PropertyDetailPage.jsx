import { useParams, Link } from "react-router-dom";
import properties from "../data/properties.json";
import Button from "../components/ui/Button.jsx";

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const property = properties.find((item) => item.slug === slug);

  if (!property) {
    return (
      <section className="container" style={{ padding: "80px 16px" }}>
        <h1 className="text-l">Propriété introuvable</h1>
        <Button to="/nos-proprietes" text="Retour aux propriétés" />
      </section>
    );
  }

  return (
    <article className="container" style={{ padding: "48px 16px 96px" }}>
      <p className="text-3xs" style={{ color: "#666666", marginBottom: 12 }}>
        <Link to="/nos-proprietes">Propriétés</Link> / {property.location}
      </p>
      <h1 className="text-xl" style={{ marginBottom: 16 }}>
        {property.title}
      </h1>
      <p className="text-s" style={{ marginBottom: 32 }}>
        {property.price} · {property.location}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8, marginBottom: 32 }}>
        {property.images.map((src) => (
          <img key={src} src={src} alt={property.title} style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 3 }} />
        ))}
      </div>
      <ul className="property_card-details" style={{ marginBottom: 24 }}>
        {property.meta.map((item) => (
          <li className="property_card-meta" key={item}>
            <span className="property_card-meta-text">{item}</span>
          </li>
        ))}
      </ul>
      <Button to="/contact" text="Nous contacter au sujet de ce bien" />
    </article>
  );
}
