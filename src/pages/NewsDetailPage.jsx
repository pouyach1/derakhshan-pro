import { Link, useParams } from "react-router-dom";
import news from "../data/news.json";
import Button from "../components/ui/Button.jsx";

export default function NewsDetailPage() {
  const { slug } = useParams();
  const article = news.find((item) => item.slug === slug);

  if (!article) {
    return (
      <section className="container" style={{ padding: 80 }}>
        <h1 className="text-l">Article introuvable</h1>
        <Button to="/actualites" text="Retour au journal" />
      </section>
    );
  }

  return (
    <article className="container" style={{ padding: "48px 16px 96px", maxWidth: 960 }}>
      <p className="text-3xs" style={{ color: "#666666", marginBottom: 12 }}>
        <Link to="/actualites">Actualités</Link> / {article.category}
      </p>
      <h1 className="text-xl" style={{ marginBottom: 24 }}>
        {article.title}
      </h1>
      <img src={article.image} alt="" style={{ width: "100%", borderRadius: 3, marginBottom: 24 }} />
      <div className="cms">
        <p>
          Article issu du Journal Luxury Places. Le contenu long n’était pas dans le pack website-forensics ;
          le titre, la catégorie et l’illustration extraits du site source sont reproduits ici.
        </p>
      </div>
    </article>
  );
}
