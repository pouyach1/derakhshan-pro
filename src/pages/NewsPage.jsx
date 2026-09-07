import { Link } from "react-router-dom";
import { ArrowIcon } from "../assets/icons/Icons.jsx";
import { SITE } from "../data/site.js";
import news from "../data/news.json";

export default function NewsPage() {
  return (
    <section className="news container" style={{ paddingTop: 48, paddingBottom: 96 }}>
      <div className="news-heading">
        <h1 className="news-title text-l">Le Journal Luxury Places</h1>
        <p className="text-3xs" style={{ color: "#666666" }}>
          {news.length} articles extraits · {SITE.totalArticles} au journal
        </p>
      </div>
      <ul className="news-list" style={{ marginTop: 32 }}>
        {news.map((item) => (
          <li className="news-item" key={item.id}>
            <article className="news-card">
              <Link to={`/actualites/${item.slug}`} className="news-card-link" title="Tout lire">
                <img src={item.image} alt="" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 3, marginBottom: 12 }} />
                <div className="news-card-details">
                  <p className="news-card-category text-3xs">{item.category}</p>
                  <p className="news-card-redirect">
                    <span className="news-card-redirect-text text-3xs">Tout lire</span>
                    <ArrowIcon />
                  </p>
                </div>
                <div className="news-card-text">
                  <h2 className="news-card-title text-2xs-bolder">{item.title}</h2>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
