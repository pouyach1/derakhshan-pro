"use client";

import { useEffect, useState } from "react";

/**
 * Thin fixed reading-progress bar — light-blue Derakhshan accent.
 * Tracks scroll through the main article body when a target id is provided.
 */
export default function ArticleReadingProgress({
  targetId = "article-body",
}: {
  targetId?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const target = document.getElementById(targetId);
      if (!target) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0);
        return;
      }

      const rect = target.getBoundingClientRect();
      const targetTop = window.scrollY + rect.top;
      const targetHeight = target.offsetHeight;
      const view = window.innerHeight;
      const start = targetTop - view * 0.15;
      const end = targetTop + targetHeight - view * 0.35;
      const range = Math.max(1, end - start);
      const value = ((window.scrollY - start) / range) * 100;
      setProgress(Math.min(100, Math.max(0, value)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-sky-100/40"
      role="progressbar"
      aria-label="پیشرفت مطالعه"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div
        className="h-full origin-right bg-gradient-to-l from-sky-500 via-sky-400 to-sky-300 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
