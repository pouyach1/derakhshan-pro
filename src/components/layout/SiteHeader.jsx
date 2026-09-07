import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/done-deals", label: "Done Deals" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-beige/90 backdrop-blur">
      <div className="mx-auto flex w-[calc(100%-var(--site--margin)*2)] max-w-[var(--max-width--main)] items-center justify-between py-5">
        <NavLink to="/" className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">
          Derakhshan Pro
        </NavLink>
        <nav className="flex gap-6 text-sm uppercase tracking-[0.12em] text-label">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "text-brand" : "transition-colors hover:text-brand"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
