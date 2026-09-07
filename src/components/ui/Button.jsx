import { Link } from "react-router-dom";

export default function Button({
  to,
  href,
  variant = "dark",
  shape = "default",
  text,
  additional,
  icon,
  type = "button",
  className = "",
  onClick,
  children,
  ...props
}) {
  const cls = `button button--${variant} button--${shape} ${className}`.trim();
  const content = children ?? (
    <>
      {text ? <span className="button-text text-3xs">{text}</span> : null}
      {additional ? <span className="button-additional text-3xs">{additional}</span> : null}
      {icon ? <span className="button-icon">{icon}</span> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
