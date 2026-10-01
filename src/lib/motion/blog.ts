/**
 * Derakhshan blog motion language — restrained editorial timings.
 * Prefer transform/opacity. Always gate decorative motion with reduced-motion.
 */

/** Level 1 — micro (chips, arrows, borders) */
export const BLOG_MICRO = {
  duration: 0.16,
  ease: [0.22, 1, 0.36, 1] as const,
};

/** Level 2 — component (cards, search, filters) */
export const BLOG_COMPONENT = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

/** Level 3 — section (reveal, hero entrance) */
export const BLOG_SECTION = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const BLOG_CARD_ENTER = {
  initial: { opacity: 0, y: 14, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.985 },
};
