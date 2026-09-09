import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import Button from "../ui/Button.jsx";
import PropertyCard from "../ui/PropertyCard.jsx";
import { SITE } from "../../data/site.js";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion.js";

export default function PropertiesSlider({ properties }) {
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const setOffset = (swiper) => {
      root.style.setProperty("--slide-offset", String(swiper.activeIndex || 0));
    };
    const swiperEl = root.querySelector(".swiper");
    if (!swiperEl?.swiper) return undefined;
    const swiper = swiperEl.swiper;
    setOffset(swiper);
    swiper.on("slideChange", setOffset);
    return () => swiper.off("slideChange", setOffset);
  }, [properties.length, reducedMotion]);

  return (
    <section className="properties_slider" ref={rootRef} data-home-motion="slider">
      <div className="properties_slider-heading container">
        <h2 className="properties_slider-heading-title text-l">Notre sélection de propriétés</h2>
        <Button to="/nos-proprietes" text="Toutes nos propriétés" additional={`(${SITE.totalProperties})`} />
      </div>
      <div className="properties_slider-slider">
        <Swiper
          modules={[Navigation]}
          className="properties_slider-swiper"
          slidesPerView="auto"
          spaceBetween={16}
          speed={reducedMotion ? 0 : 800}
          resistanceRatio={0.65}
          watchSlidesProgress
          navigation={{
            nextEl: ".properties_slider-next",
            prevEl: ".properties_slider-prev",
          }}
          breakpoints={{
            0: { slidesPerView: 1.25 },
            576: { slidesPerView: 1.6 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {properties.map((item) => (
            <SwiperSlide className="properties_slider-slide" key={item.id}>
              <PropertyCard property={item} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="properties_slider-controls">
          <button type="button" className="button button--bright properties_slider-prev" aria-label="Précédent">
            ←
          </button>
          <button type="button" className="button button--bright properties_slider-next" aria-label="Suivant">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
