import { useEffect, useRef } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

/**
 * Adds .is-visible when the node enters the viewport (stagger-friendly reveals).
 */
export default function useInViewReveal(options = {}) {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (reducedMotion) {
      node.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: options.threshold ?? 0.18, rootMargin: options.rootMargin ?? "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, options.threshold, options.rootMargin]);

  return ref;
}
