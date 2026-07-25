import prisma from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.monarquelimo.com";

export default async function sitemap() {
  const generatedAt = new Date();

  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true }
  });

  const routes = [
    "",
    "/services",
    "/fleet",
    "/blog"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: generatedAt
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: generatedAt
  }));

  return [...routes, ...blogRoutes];
}
