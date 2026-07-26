import prisma from "@/lib/prisma";
import Link from "next/link";
import { safeFindMany, safeGetSettings } from "@/lib/safe-prisma";

export const revalidate = 60;

async function getPageSettings() {
  return safeGetSettings(() => prisma.siteSetting.findMany());
}

export async function generateMetadata() {
  const settings = await getPageSettings();

  return {
    title: settings.page_blog_meta_title || "Blog | Monarque Limo",
    description: settings.page_blog_meta_description || "News, guides, and updates from Monarque Limo."
  };
}

export default async function BlogListPage() {
  const posts = await safeFindMany(() =>
    prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" }
    })
  );

  return (
    <main className="px-6 md:px-16 py-20 min-h-screen">
      <span className="section-eyebrow">Insights</span>
      <h1 className="section-heading mb-10">The Monarque Journal</h1>

      {posts.length === 0 && <p className="text-white/60">No posts published yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="card block hover:border-gold transition-colors">
            {post.category && (
              <p className="text-xs gold-text uppercase tracking-wide mb-2">{post.category}</p>
            )}
            <h2 className="font-display text-xl text-white mb-2">{post.title}</h2>
            {post.excerpt && <p className="text-white/60 text-sm">{post.excerpt}</p>}
            <p className="text-white/30 text-xs mt-4">
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <Link href="/" className="gold-text text-sm hover:underline">
          &larr; Back to home
        </Link>
      </div>
    </main>
  );
}
