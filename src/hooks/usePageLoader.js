import { useEffect } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion.js";

/**
 * Drives the Luxury Places loader CSS contract:
 * animate → translate → hide → exit → disabled + body.is-ready
 */
export default function usePageLoader() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const loader = document.querySelector(".loader");
    const body = document.body;
    if (!loader) {
      body.classList.add("is-ready");
      return undefined;
    }

    const timers = [];
    const wait = (ms, fn) => timers.push(window.setTimeout(fn, ms));

    loader.classList.remove("disabled", "hide", "translate", "exit");
    body.classList.remove("is-ready");

    if (reducedMotion) {
      loader.classList.add("disabled");
      body.classList.add("is-ready");
      return undefined;
    }

    // Force reflow so animate restart is reliable on route remounts.
    void loader.offsetWidth;
    loader.classList.add("animate");

    wait(1600, () => {
      loader.classList.add("translate");
      wait(200, () => {
        loader.classList.add("hide");
        wait(900, () => {
          loader.classList.add("exit");
          body.classList.add("is-ready");
          wait(200, () => {
            loader.classList.add("disabled");
          });
        });
      });
    });

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [reducedMotion]);
}
