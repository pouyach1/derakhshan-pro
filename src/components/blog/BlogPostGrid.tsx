"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { BLOG_CARD_ENTER, BLOG_COMPONENT } from "@/lib/motion/blog";

type BlogPostGridProps = {
  posts: BlogPost[];
  /** When true, first card may span wider for editorial rhythm */
  emphasizeFirst?: boolean;
};

/**
 * Editorial article grid — 1 col mobile, 2 tablet, 3 desktop.
 * Cards transition with opacity/transform when the result set changes.
 */
export default function BlogPostGrid({
  posts,
  emphasizeFirst = true,
}: BlogPostGridProps) {
  const reduceMotion = useReducedMotion();

  if (!posts.length) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6" dir="rtl">
      <AnimatePresence mode="popLayout" initial={false}>
        {posts.map((post, index) => {
          const wide = emphasizeFirst && index === 0 && posts.length > 2;
          const content = (
            <BlogPostCard post={post} emphasis={wide ? "wide" : "default"} />
          );

          if (reduceMotion) {
            return (
              <div key={post.id} className={wide ? "sm:col-span-2 lg:col-span-2" : undefined}>
                {content}
              </div>
            );
          }

          return (
            <motion.div
              key={post.id}
              layout
              className={wide ? "sm:col-span-2 lg:col-span-2" : undefined}
              initial={BLOG_CARD_ENTER.initial}
              animate={BLOG_CARD_ENTER.animate}
              exit={BLOG_CARD_ENTER.exit}
              transition={{
                ...BLOG_COMPONENT,
                delay: Math.min(index * 0.03, 0.12),
                layout: { duration: 0.28 },
              }}
            >
              {content}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
