import { Fragment } from "react";
import { sanitizeBlogHref } from "@/lib/blog/safe-href";

type BlogPostContentProps = {
  content: string;
};

type Block =
  | { type: "p"; text: string }
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

/**
 * Lightweight editorial parser for mock / future plain-text content.
 * Supports # / ## / ###, > quotes, lists, and inline ** * __ [link](url).
 */
function parseContent(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const line = raw.trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const parts: string[] = [line.slice(2).trim()];
      i += 1;
      while (i < lines.length && (lines[i] ?? "").trim().startsWith("> ")) {
        parts.push((lines[i] ?? "").trim().slice(2).trim());
        i += 1;
      }
      blocks.push({ type: "quote", text: parts.join(" ") });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test((lines[i] ?? "").trim())) {
        items.push((lines[i] ?? "").trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test((lines[i] ?? "").trim())) {
        items.push((lines[i] ?? "").trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const parts: string[] = [line];
    i += 1;
    while (i < lines.length) {
      const next = (lines[i] ?? "").trim();
      if (
        !next ||
        next.startsWith("# ") ||
        next.startsWith("## ") ||
        next.startsWith("### ") ||
        next.startsWith("> ") ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next)
      ) {
        break;
      }
      parts.push(next);
      i += 1;
    }
    blocks.push({ type: "p", text: parts.join(" ") });
  }

  return blocks;
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={index} className="font-semibold text-[#0B3A5C]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("__") && part.endsWith("__") && part.length > 4) {
          return (
            <span key={index} className="underline decoration-sky-400/70 underline-offset-4">
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return (
            <em key={index} className="italic text-[#0B3A5C]/90">
              {part.slice(1, -1)}
            </em>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const href = sanitizeBlogHref(link[2] ?? "");
          if (!href) {
            return <Fragment key={index}>{link[1]}</Fragment>;
          }
          const external = href.startsWith("http");
          return (
            <a
              key={index}
              href={href}
              className="font-semibold text-sky-700 underline decoration-sky-300/70 underline-offset-4 transition hover:text-sky-600"
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {link[1]}
            </a>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

/**
 * Editorial article body — comfortable Persian measure and hierarchy.
 */
export default function BlogPostContent({ content }: BlogPostContentProps) {
  const blocks = parseContent(content);

  if (!blocks.length) {
    return null;
  }

  return (
    <div
      className="blog-prose font-vazirmatn text-[0.975rem] leading-[2] text-[#0B3A5C]/85 md:text-[1.05rem] md:leading-[2.05]"
      dir="rtl"
    >
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h1":
            return (
              <h2
                key={index}
                className="mt-12 mb-4 font-vazirmatn text-2xl font-black leading-10 tracking-tight text-[#0B3A5C] first:mt-0 md:text-3xl"
              >
                <InlineText text={block.text} />
              </h2>
            );
          case "h2":
            return (
              <h2
                key={index}
                className="mt-12 mb-4 font-vazirmatn text-xl font-bold leading-9 tracking-tight text-[#0B3A5C] first:mt-0 md:text-2xl md:leading-10"
              >
                <InlineText text={block.text} />
              </h2>
            );
          case "h3":
            return (
              <h3
                key={index}
                className="mt-9 mb-3 font-vazirmatn text-lg font-bold leading-8 text-[#0B3A5C] md:text-xl md:leading-9"
              >
                <InlineText text={block.text} />
              </h3>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="my-8 rounded-[1.25rem] border border-sky-100/90 border-s-4 border-s-sky-400/80 bg-sky-50/60 px-5 py-4 text-[0.975rem] font-medium leading-9 text-[#0B3A5C]/85 shadow-[0_16px_40px_-36px_rgba(11,58,92,0.35)] backdrop-blur-sm md:px-6 md:py-5 md:text-base"
              >
                <InlineText text={block.text} />
              </blockquote>
            );
          case "ul":
            return (
              <ul
                key={index}
                className="my-6 list-none space-y-2.5 pe-0 ps-0"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="relative ps-5 leading-8">
                    <span
                      aria-hidden
                      className="absolute start-0 top-[0.85em] h-1.5 w-1.5 rounded-full bg-sky-500"
                    />
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index} className="my-6 list-none space-y-2.5">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="relative ps-8 leading-8">
                    <span className="absolute start-0 top-0 font-semibold tabular-nums text-sky-600">
                      {(itemIndex + 1).toLocaleString("fa-IR")}.
                    </span>
                    <InlineText text={item} />
                  </li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={index} className="mb-5 last:mb-0">
                <InlineText text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
