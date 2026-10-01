type BlogPostContentProps = {
  content: string;
};

/** Phase 1: plain paragraphs from mock content (newline-separated). */
export default function BlogPostContent({ content }: BlogPostContentProps) {
  const paragraphs = content
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 font-vazirmatn text-sm leading-8 text-[#0B3A5C]/80 md:text-base" dir="rtl">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
