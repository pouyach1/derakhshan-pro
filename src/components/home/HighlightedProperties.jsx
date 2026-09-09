import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "../../assets/icons/Icons.jsx";
import Button from "../ui/Button.jsx";
import { SITE } from "../../data/site.js";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion.js";

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function HighlightedProperties({ featured, categories }) {
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;

    const preview = root.querySelector(".highlighted_properties-preview");
    const parallaxNodes = [...root.querySelectorAll("[data-parallax]")];
    const countSlides = [...root.querySelectorAll(".highlighted_properties-count-slide")];
    const visualizerItems = [...root.querySelectorAll(".highlighted_properties-visualizer-item")];
    const sectionItems = [...root.querySelectorAll(".highlighted_properties-item")];
    const countEl = root.querySelector(".highlighted_properties-count");

    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight || 1;

      if (preview) {
        const rect = preview.getBoundingClientRect();
        const progress = clamp(1 - rect.bottom / (viewport + rect.height * 0.35));
        preview.classList.toggle("highlighted_properties-preview--final", progress > 0.55);
      }

      parallaxNodes.forEach((node) => {
        const speed = Number(node.dataset.parallax) || 0.12;
        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - viewport / 2;
        const shift = (-center * speed) / viewport;
        node.style.transform = `translate3d(0, ${shift * 100}%, 0)`;
      });

      let activeIndex = 0;
      sectionItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (mid < viewport * 0.62) activeIndex = index;
      });

      countSlides.forEach((slide, index) => {
        const offset = (index - activeIndex) * 100;
        slide.style.setProperty("--slide-offset", `${offset}%`);
      });
      visualizerItems.forEach((item, index) => {
        item.classList.toggle("active", index === activeIndex);
      });
      if (countEl) {
        countEl.style.transform = "translateY(0%)";
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    root.classList.add("mouseover-ready");

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, categories.length]);

  return (
    <section className="highlighted_properties" ref={rootRef} data-home-motion="highlighted">
      <div className="highlighted_properties-heading container">
        <h1 className="highlighted_properties-heading-title text-2xl">PROPRIÉTÉS DE LUXE EN SUISSE</h1>
        <div className="highlighted_properties-heading-bottom">
          <PlusIcon className="highlighted_properties-heading-icon" />
          <Button to="/nos-proprietes" text="Toutes nos propriétés" additional={`(${SITE.totalProperties})`} />
          <PlusIcon className="highlighted_properties-heading-icon" />
        </div>
      </div>

      <div className="highlighted_properties-wrapper">
        <div className="highlighted_properties-count_container" aria-hidden="true">
          <div className="highlighted_properties-count_wrapper">
            <div className="highlighted_properties-count">
              <div className="highlighted_properties-count-slider">
                {categories.map((item) => (
                  <div className="highlighted_properties-count-slide" key={`count-${item.slug}`}>
                    <span className="text-3xs">0{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="highlighted_properties-visualizer">
                {categories.map((item, index) => (
                  <span
                    key={`viz-${item.slug}`}
                    className={`highlighted_properties-visualizer-item${index === 0 ? " active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

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
              <img
                src={featured.images[0]}
                alt=""
                className="highlighted_properties-preview-item-img"
                data-parallax="0.08"
              />
            </div>
            <Link
              to={`/nos-proprietes?categorie=${featured.slug}`}
              className="highlighted_properties-preview-item container highlighted_properties-preview-item--main"
            >
              <div className="highlighted_properties-preview-item-inner">
                <img
                  src={featured.images[1]}
                  alt={featured.title}
                  className="highlighted_properties-preview-item-img"
                  data-parallax="0.14"
                />
                <div className="highlighted_properties-preview-item-layer" />
              </div>
            </Link>
            <div className="highlighted_properties-preview-item highlighted_properties-preview-item--right">
              <img
                src={featured.images[2]}
                alt=""
                className="highlighted_properties-preview-item-img"
                data-parallax="0.1"
              />
            </div>
          </div>
        </div>

        <div className="highlighted_properties-content">
          {categories.map((item) => (
            <Link
              to={`/nos-proprietes?categorie=${item.slug}`}
              className="highlighted_properties-item container"
              key={item.slug}
            >
              <h2 className="highlighted_properties-item-title text-m">
                <span className="highlighted_properties-item-title-inner">{item.title}</span>
              </h2>
              <span className="button button--bright button--default highlighted_properties-item-button">
                <span className="button-text text-3xs">Voir les propriétés</span>
                <span className="button-additional text-3xs">( {item.count} )</span>
              </span>
              <img
                src={item.image}
                alt={item.title}
                className="highlighted_properties-item-img"
                data-parallax="0.18"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
