import Image from "next/image";
import type { BlogAuthor } from "@/types/blog";

type ArticleAuthorProps = {
  author: BlogAuthor;
};

/**
 * Restrained author band — only fields present on BlogAuthor.
 */
export default function ArticleAuthor({ author }: ArticleAuthorProps) {
  return (
    <section
      className="rounded-[1.5rem] border border-sky-100/80 bg-white/70 p-5 shadow-[0_20px_50px_-42px_rgba(11,58,92,0.35)] backdrop-blur-xl md:p-6"
      aria-label="نویسنده"
      dir="rtl"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-sky-100 bg-[#E8F1F8]">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-vazirmatn text-lg font-bold text-sky-700">
              {author.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-600">AUTHOR</p>
          <p className="mt-1 font-vazirmatn text-base font-bold text-[#0B3A5C]">{author.name}</p>
          <p className="mt-1 text-sm text-[#0B3A5C]/55">نویسنده این مطلب</p>
        </div>
      </div>
    </section>
  );
}
