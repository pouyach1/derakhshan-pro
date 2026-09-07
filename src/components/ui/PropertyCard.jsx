import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowIcon, HeartFullIcon, HeartIcon } from "../../assets/icons/Icons.jsx";
import { useFavorites } from "../../data/favorites.jsx";

export default function PropertyCard({ property }) {
  const fav = useFavorites();
  const [slide, setSlide] = useState(0);
  const images = property.images?.length ? property.images : [];
  const active = images[slide] || images[0];
  const saved = fav?.has(property.id);

  return (
    <article className="property_card property_card--portrait" data-property-card>
      <Link className="property_card-link" to={`/property/${property.slug}`} title="Tout lire">
        <div className="favorite_btn property_card-favorite">
          <button
            className="favorite_btn-inner property_card-favorite-btn"
            type="button"
            aria-pressed={saved}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              fav?.toggle(property.id);
            }}
          >
            <HeartIcon />
            <HeartFullIcon />
          </button>
        </div>
        <div className="property_card-slider" style={{ "--slider-length": images.length || 1 }}>
          <div className="property_card-wrapper">
            {active ? (
              <div className="property_card-slide">
                <div className="property_card-slide-inner">
                  <img className="property_card-slide-img" src={active} alt={property.title} loading="lazy" />
                </div>
              </div>
            ) : null}
          </div>
          {images.length > 1 ? (
            <div className="property_card-pagination" role="tablist">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Image ${index + 1}`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSlide(index);
                  }}
                  style={{
                    width: 8,
                    height: 8,
                    margin: 2,
                    borderRadius: 0,
                    background: index === slide ? "#000" : "#909090",
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="property_card-content">
          <ul className="property_card-details">
            {property.meta?.map((item) => (
              <li className="property_card-meta" key={item}>
                <span className="property_card-meta-text">{item}</span>
              </li>
            ))}
          </ul>
          <h3 className="property_card-title text-s">{property.title}</h3>
          <div className="property_card-bottom">
            <p className="property_card-location">{property.location}</p>
            <ArrowIcon />
          </div>
        </div>
      </Link>
    </article>
  );
}
