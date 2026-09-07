import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { LogoMark } from "../../assets/icons/Icons.jsx";
import noise from "../../assets/noise.webp";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";

export default function SiteLayout() {
  useEffect(() => {
    document.querySelector(".loader")?.classList.add("animate");
    const timer = window.setTimeout(() => {
      document.body.classList.add("is-ready");
      document.querySelector(".loader")?.classList.add("disabled");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="page-root" style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <div className="loader" data-component-loader>
        <div className="loader-logo">
          <LogoMark className="loader-logo-svg" />
          <svg className="loader-logo-circle" viewBox="0 0 71 71" fill="none" aria-hidden="true">
            <circle cx="35.44" cy="35.44" r="34.94" />
          </svg>
        </div>
      </div>
      <nav role="navigation" className="quick-access">
        <ul className="quick-access-list">
          <li className="quick-access-item">
            <a href="#en-tete" className="quick-access-link">
              Accéder à l'en-tête
            </a>
          </li>
          <li className="quick-access-item">
            <a href="#contenu-principal" className="quick-access-link">
              Accéder au contenu principal
            </a>
          </li>
          <li className="quick-access-item">
            <a href="#pied-de-page" className="quick-access-link">
              Accéder au pied de page
            </a>
          </li>
        </ul>
      </nav>
      <SiteHeader />
      <div className="noise" style={{ "--background-noise": `url(${noise})` }} />
      <main id="contenu-principal" role="main" className="main wrapper">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
