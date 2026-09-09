import { useEffect } from "react";

export default function useViewportHeight() {
  useEffect(() => {
    const setHeight = () => {
      const height = `${window.innerHeight}px`;
      document.documentElement.style.setProperty("--viewport-h", height);
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);
    return () => {
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);
}
