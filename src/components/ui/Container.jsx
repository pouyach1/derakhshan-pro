export default function Container({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`u-container mx-auto flex w-[calc(100%-var(--site--margin)*2)] max-w-[var(--max-width--main)] flex-col ${className}`} {...props}>
      {children}
    </Tag>
  );
}
