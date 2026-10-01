import type { BlogPost } from "@/types/blog";

/** Normalize Persian/Arabic text for client-side matching. */
export function normalizeBlogQuery(value: string): string {
  return value
    .toLowerCase()
    .replace(/ك/g, "ک")
    .replace(/ي/g, "ی")
    .replace(/\u200c/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function postMatchesQuery(post: BlogPost, query: string): boolean {
  const q = normalizeBlogQuery(query);
  if (!q) return true;

  const haystack = normalizeBlogQuery(
    [post.title, post.excerpt, post.category, post.author.name].filter(Boolean).join(" "),
  );
  return haystack.includes(q);
}

export function filterBlogPosts(
  posts: BlogPost[],
  options: { query?: string; category?: string | null },
): BlogPost[] {
  const query = options.query ?? "";
  const category = options.category ?? null;

  return posts.filter((post) => {
    if (category && post.category !== category) return false;
    return postMatchesQuery(post, query);
  });
}
