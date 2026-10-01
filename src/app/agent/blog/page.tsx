import AgentBlogList from "@/components/blog/admin/AgentBlogList";
import { getBlogPosts } from "@/data/blog";

const BASE_PATH = "/agent/blog";

export default function AgentBlogPage() {
  const posts = getBlogPosts();
  return <AgentBlogList allPosts={posts} basePath={BASE_PATH} />;
}
