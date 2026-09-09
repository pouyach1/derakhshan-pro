import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon, ArrowRightWhite } from "../../assets/icons/Icons.jsx";
import Button from "../ui/Button.jsx";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion.js";

export default function MixedBlock({ data, links = [], mediaRight = false }) {
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;

    const media = root.querySelector(".mixed-img");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!media) return;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = (viewport / 2 - (rect.top + rect.height / 2)) / viewport;
      media.style.transform = `translate3d(0, ${progress * 8}%, 0) scale(1.04)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className={`mixed block container${mediaRight ? " mixed--media_right" : ""}`}
      data-home-motion="mixed"
    >
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
