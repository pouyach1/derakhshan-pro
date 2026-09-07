import { Link } from "react-router-dom";
import { ArrowIcon, ArrowRightWhite, PlusIcon } from "../assets/icons/Icons.jsx";
import Button from "../components/ui/Button.jsx";
import PropertyCard from "../components/ui/PropertyCard.jsx";
import { CATEGORIES, EXPERTISE_LINKS, MIXED, SHOWREEL, SITE } from "../data/site.js";
import homeProperties from "../data/homeProperties.json";
import news from "../data/news.json";
import { useState } from "react";

export default function HomePage() {
  const featured = CATEGORIES.find((item) => item.featured);
  const rest = CATEGORIES.filter((item) => !item.featured);
  const [activeNews, setActiveNews] = useState(news[0]?.id);

  return (
    <>
      <section className="highlighted_properties">
        <div className="highlighted_properties-heading container">
          <h1 className="highlighted_properties-heading-title text-2xl">PROPRIÉTÉS DE LUXE EN SUISSE</h1>
          <div className="highlighted_properties-heading-bottom">
            <PlusIcon />
            <Button to="/nos-proprietes" text="Toutes nos propriétés" additional={`(${SITE.totalProperties})`} />
            <PlusIcon />
          </div>
        </div>
        <div className="highlighted_properties-wrapper">
          <div className="highlighted_properties-zoom">
            <div className="highlighted_properties-zoom-wrapper container">
              <h2 className="highlighted_properties-item-title highlighted_properties-item-title--main text-m">
                <span className="highlighted_properties-item-title-inner">{featured.title}</span>
              </h2>
              <span className="button button--bright button--default highlighted_properties-item-button">
                <span className="button-text text-3xs">Voir les propriétés</span>
                <span className="button-additional text-3xs">( {featured.count} )</span>
              </span>
            </div>
            <div className="highlighted_properties-preview">
              <div className="highlighted_properties-preview-item highlighted_properties-preview-item--left">
                <img src={featured.images[0]} alt="" className="highlighted_properties-preview-item-img" />
              </div>
              <Link to={`/nos-proprietes?categorie=${featured.slug}`} className="highlighted_properties-preview-item container highlighted_properties-preview-item--main">
                <div className="highlighted_properties-preview-item-inner">
                  <img src={featured.images[1]} alt={featured.title} className="highlighted_properties-preview-item-img" />
                  <div className="highlighted_properties-preview-item-layer" />
                </div>
              </Link>
              <div className="highlighted_properties-preview-item highlighted_properties-preview-item--right">
                <img src={featured.images[2]} alt="" className="highlighted_properties-preview-item-img" />
              </div>
            </div>
          </div>
          <div className="highlighted_properties-content">
            {rest.map((item) => (
              <Link to={`/nos-proprietes?categorie=${item.slug}`} className="highlighted_properties-item container" key={item.slug}>
                <h2 className="highlighted_properties-item-title text-m">{item.title}</h2>
                <span className="button button--bright button--default highlighted_properties-item-button">
                  <span className="button-text text-3xs">Voir les propriétés</span>
                  <span className="button-additional text-3xs">( {item.count} )</span>
                </span>
                <img src={item.image} alt={item.title} className="highlighted_properties-item-img" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="properties_slider">
        <div className="properties_slider-heading container">
          <h2 className="properties_slider-heading-title text-l">Notre sélection de propriétés</h2>
          <Button to="/nos-proprietes" text="Toutes nos propriétés" additional={`(${SITE.totalProperties})`} />
        </div>
        <div className="properties_slider-slider">
          <ul className="properties_slider-wrapper" style={{ display: "flex", gap: 16, overflowX: "auto", padding: "0 16px 32px" }}>
            {homeProperties.map((item) => (
              <li className="properties_slider-slide" key={item.id} style={{ minWidth: 280, maxWidth: 360, flex: "0 0 28%" }}>
                <PropertyCard property={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MixedBlock data={MIXED.expertise} links={EXPERTISE_LINKS} mediaRight />
      <MixedBlock data={MIXED.universe} />

      <section className="demonstration">
        <div className="demonstration-wrapper">
          <video className="demonstration-main-image" autoPlay muted loop playsInline>
            <source src={SHOWREEL} type="video/webm" />
          </video>
        </div>
      </section>

      <section className="news container">
        <div className="news-heading">
          <h2 className="news-title text-l">Le Journal Luxury Places</h2>
          <Button to="/actualites" text="Tous nos articles" additional={`(${SITE.totalArticles})`} />
        </div>
        <div className="news-content">
          <div className="news-illustration">
            {news.map((item) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.title}
                className="news-illustration-img"
                hidden={activeNews !== item.id}
              />
            ))}
          </div>
          <ul className="news-list">
            {news.map((item) => (
              <li className="news-item" key={item.id}>
                <article className="news-card">
                  <Link
                    to={`/actualites/${item.slug}`}
                    className="news-card-link"
                    title="Tout lire"
                    onMouseEnter={() => setActiveNews(item.id)}
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
    </>
  );
}

function MixedBlock({ data, links = [], mediaRight = false }) {
  return (
    <section className={`mixed block container${mediaRight ? " mixed--media_right" : ""}`}>
      <div className="mixed-media">
        <img src={data.image} alt="" className="mixed-img" />
      </div>
      <div className="mixed-content">
        <h2 className="mixed-title text-xl">{data.title}</h2>
        <div className="mixed-links">
          <div className="mixed-links-wrapper">
            <ul className="mixed-links-list">
              {links.map((item) => (
                <li className="mixed-links-item" key={item.label}>
                  <Link className="mixed-links-link text-3xs" to={item.to}>
                    {item.label}
                    <ArrowIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mixed-links-button_wrapper">
            <Button to={data.cta.to} className="mixed-links-button" text={data.cta.label} icon={<ArrowRightWhite />} />
          </div>
        </div>
        <div className="mixed-text cms">
          {data.html.map((paragraph, index) => (
            <p key={paragraph}>
              {index === 0 ? <strong>{paragraph}</strong> : paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
