import { ArrowRightWhite, LogoMark } from "../../assets/icons/Icons.jsx";
import { SITE } from "../../data/site.js";
import Button from "../ui/Button.jsx";
import wordmark from "../../assets/logo-wordmark.svg";

export default function SiteFooter() {
  return (
    <footer id="pied-de-page" role="contentinfo" className="footer container">
      <div className="footer-logo">
        <img src={wordmark} alt="Luxury Places" className="footer-logo-inner" />
      </div>
      <div className="footer-links">
        <ul className="footer-socials">
          {SITE.social.map((item) => (
            <li key={item.title}>
              <a title={item.title} href={item.href} target="_blank" rel="noreferrer" className="button button--bright button--square">
                <span className="button-icon">
                  <LogoMark size={16} />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <Button to="/contact" text="Nous contacter" icon={<ArrowRightWhite />} />
      </div>
      <div className="footer-legals">
        <div className="footer-legals-wrapper">
          <ul>
            <li>
              <a className="text-3xs" href="https://www.luxury-places.ch/mentions-legales/" target="_blank" rel="noreferrer">
                Conditions générales
              </a>
            </li>
            <li>
              <a className="text-3xs" href="https://www.luxury-places.ch/politique-de-confidentialite/" target="_blank" rel="noreferrer">
                Politique de confidentialité
              </a>
            </li>
          </ul>
        </div>
        <p className="text-3xs footer-legals-copyright">© 2026 Luxury Places</p>
      </div>
    </footer>
  );
}
