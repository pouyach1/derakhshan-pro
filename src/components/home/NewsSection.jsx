import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon } from "../../assets/icons/Icons.jsx";
import Button from "../ui/Button.jsx";
import { SITE } from "../../data/site.js";
import useInViewReveal from "../../hooks/useInViewReveal.js";

export default function NewsSection({ items }) {
  const [activeNews, setActiveNews] = useState(items[0]?.id);
  const [visibleId, setVisibleId] = useState(items[0]?.id);
  const stageRef = useRef(null);
  const headingRef = useInViewReveal();

  useEffect(() => {
    if (!activeNews || activeNews === visibleId) return undefined;
    const imgs = stageRef.current?.querySelectorAll(".news-illustration-img");
    if (!imgs?.length) {
      setVisibleId(activeNews);
      return undefined;
    }

    imgs.forEach((img) => {
      const id = img.dataset.newsId;
      if (id === activeNews) {
        img.hidden = false;
        img.style.transform = "translateY(0%)";
        img.style.opacity = "1";
        img.style.zIndex = "2";
      } else if (id === visibleId) {
        img.hidden = false;
        img.style.transform = "translateY(-8%)";
        img.style.opacity = "0";
        img.style.zIndex = "1";
      } else {
        img.style.opacity = "0";
        img.style.zIndex = "0";
      }
    });

    const timer = window.setTimeout(() => setVisibleId(activeNews), 320);
    return () => window.clearTimeout(timer);
  }, [activeNews, visibleId]);

  return (
    <section className="news container" data-home-motion="news">
      <div className="news-heading home-reveal" ref={headingRef}>
        <h2 className="news-title text-l">Le Journal Luxury Places</h2>
        <Button to="/actualites" text="Tous nos articles" additional={`(${SITE.totalArticles})`} />
      </div>
      <div className="news-content">
        <div className="news-illustration" ref={stageRef}>
          {items.map((item, index) => (
            <img
              key={item.id}
              src={item.image}
              alt={item.title}
              data-news-id={item.id}
              className="news-illustration-img"
              hidden={item.id !== visibleId && item.id !== activeNews}
              style={{
                transform: item.id === visibleId ? "translateY(0%)" : "translateY(100%)",
                opacity: item.id === visibleId ? 1 : 0,
                transition: "transform .45s cubic-bezier(0.16, 1, 0.3, 1), opacity .35s ease-out",
                zIndex: item.id === visibleId ? 2 : 0,
              }}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
        <ul className="news-list">
          {items.map((item) => (
            <li className="news-item" key={item.id}>
              <article className="news-card">
                <Link
                  to={`/actualites/${item.slug}`}
                  className="news-card-link"
                  title="Tout lire"
                  onMouseEnter={() => setActiveNews(item.id)}
                  onFocus={() => setActiveNews(item.id)}
                >
                  <div className="news-card-details">
                    <p className="news-card-category text-3xs">{item.category}</p>
                    <p className="news-card-redirect">
                      <span className="news-card-redirect-text text-3xs">Tout lire</span>
                      <ArrowIcon />
                    </p>
                  </div>
                  <div className="news-card-text">
                    <h3 className="news-card-title text-2xs-bolder">{item.title}</h3>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
