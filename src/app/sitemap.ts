import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";
import { listPublishedBlogPosts } from "@/server/services/blog";
import { listProperties } from "@/server/services/properties";
import { listPublicAgents } from "@/server/services/agents-public";

/**
 * Must be request-time: AgencyStore (esp. on Cloudflare isolates) is not the
 * build-time snapshot. A static sitemap would omit posts/properties published after deploy.
 */
export const dynamic = "force-dynamic";

async function publicPropertyEntries(base: string): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];
  for (const status of ["published", "sold"] as const) {
    let page = 1;
    for (;;) {
      const result = await listProperties({ status, page, pageSize: 100 });
      for (const item of result.items) {
        routes.push({
          url: `${base}/listings/${item.id}`,
          lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
      if (page * result.pageSize >= result.total) break;
      page += 1;
    }
  }
  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.seo.url.replace(/\/$/, "");
  const posts = await listPublishedBlogPosts();
  const agents = await listPublicAgents();
  const properties = await publicPropertyEntries(base);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/listings`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/meet-the-team`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/done-deals`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const agentRoutes: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `${base}/agents/${agent.id}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...properties, ...articleRoutes, ...agentRoutes];
}
