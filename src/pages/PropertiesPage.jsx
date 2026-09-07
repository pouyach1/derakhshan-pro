import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/ui/PropertyCard.jsx";
import { CATEGORIES, SITE } from "../data/site.js";
import properties from "../data/properties.json";

export default function PropertiesPage() {
  const [params] = useSearchParams();
  const category = params.get("categorie");
  const active = CATEGORIES.find((item) => item.slug === category);

  const list = useMemo(() => properties, []);

  return (
    <section className="properties container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div className="properties_slider-heading" style={{ marginBottom: 32 }}>
        <h1 className="properties_slider-heading-title text-l">{active ? active.title : "Toutes nos propriétés"}</h1>
        <p className="text-3xs" style={{ color: "#666666" }}>
          {list.length} biens extraits · {SITE.totalProperties} au catalogue Luxury Places
        </p>
      </div>
      <ul
        className="properties_favorite-list"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}
      >
        {list.map((item) => (
          <li key={item.id}>
            <PropertyCard property={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
