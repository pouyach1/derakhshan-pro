import { useEffect, useRef } from "react";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion.js";

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function ShowreelSection({ src }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return undefined;

    if (reducedMotion) {
      video.style.transform = "scale(1)";
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const start = viewport * 0.9;
      const end = viewport * 0.15;
      const progress = clamp((start - rect.top) / (start - end));
      const scale = 0.6 + progress * 0.4;
      video.style.transform = `scale(${scale})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  return (
    <section className="demonstration" ref={rootRef} data-home-motion="showreel">
      <div className="demonstration-wrapper">
        <video ref={videoRef} className="demonstration-main-image" autoPlay muted loop playsInline>
          <source src={src} type="video/webm" />
        </video>
      </div>
    </section>
  );
}
