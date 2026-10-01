import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";
import { listPublishedBlogPosts } from "@/server/services/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.seo.url.replace(/\/$/, "");
  const posts = await listPublishedBlogPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/properties`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/login`, changeFrequency: "monthly", priority: 0.2 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
