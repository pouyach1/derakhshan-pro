import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CloseIcon, LogoMark } from "../../assets/icons/Icons.jsx";
import { NAV, SITE } from "../../data/site.js";
import { useFavorites } from "../../data/favorites.jsx";
import properties from "../../data/properties.json";
import Button from "../ui/Button.jsx";
import PropertyCard from "../ui/PropertyCard.jsx";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const fav = useFavorites();
  const saved = properties.filter((item) => fav?.ids.includes(item.id));

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  return (
    <header id="en-tete" role="banner" className="header">
      <div className="container">
        <div className="header-wrapper">
          <Link to="/" className="header-logo" onClick={() => setMenuOpen(false)}>
            <LogoMark className="header-logo-inner" />
          </Link>
          <nav role="navigation" aria-label="Menu" className="menu">
            <Button
              className="menu-toggle"
              text="Menu"
              aria-expanded={menuOpen}
              aria-controls="menu"
              onClick={() => setMenuOpen((value) => !value)}
            />
            <div id="menu" className={`menu-wrapper${menuOpen ? " is-open" : ""}`}>
              <ul className="menu-list menu-list--primary">
                {NAV.map((item) => (
                  <li className="menu-item" key={item.to}>
                    <NavLink to={item.to} className="menu-link" onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <ul className="menu-list menu-list--secondary">
                <li className="menu-item">
                  <NavLink to="/contact" className="menu-link" onClick={() => setMenuOpen(false)}>
                    Contact
                  </NavLink>
                </li>
                <li className="menu-item language">
                  <button
                    type="button"
                    className="language-toggle"
                    aria-expanded={langOpen}
                    onClick={() => setLangOpen((value) => !value)}
                  >
                    FR
                  </button>
                  <ul className="language-list" hidden={!langOpen}>
                    <li className="language-item">
                      <span className="language-link">EN</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
          <div className="menu-item favorite">
            <button className="favorite-button" type="button" onClick={() => fav?.setOpen(true)}>
              <span className="favorite-button-text">Favoris |&nbsp;</span>
              <span className="favorite-button-count">{fav?.count ?? 0}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="modal modal--right favorite-modal" inert={fav?.open ? undefined : true} role="dialog">
        <div className="modal-inner favorite-modal-inner">
          <div className="favorite-modal-heading">
            <p className="text-m favorite-modal-title">
              Mes <span className="count">({fav?.count ?? 0})</span> Favoris
            </p>
            <Button text="Fermer" icon={<CloseIcon />} onClick={() => fav?.setOpen(false)} />
          </div>
          <div className="favorite-modal-wrapper">
            <div className="favorite-modal-content">
              <div className="properties_favorite">
                {saved.length ? (
                  <ul className="properties_favorite-list">
                    {saved.map((item) => (
                      <li key={item.id}>
                        <PropertyCard property={item} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="properties_favorite-noresults">Vous n'avez aucun favoris pour le moment</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
