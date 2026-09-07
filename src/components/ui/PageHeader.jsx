export default function PageHeader({ title, description }) {
  return (
    <header className="mb-10">
      <h1 className="m-0 mb-3 text-[clamp(2.125rem,4vw,3.25rem)] font-semibold leading-[1.17] text-ink">
        {title}
      </h1>
      {description ? (
        <p className="m-0 max-w-xl text-brand">{description}</p>
      ) : null}
    </header>
  );
}
