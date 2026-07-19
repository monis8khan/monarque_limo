import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true }
  });
  return posts.map((p) => ({ slug: p.slug }));
}

async function getPost(slug) {
  return prisma.blogPost.findFirst({ where: { slug, status: "published" } });
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle || `${post.title} | Monarque Limo`,
    description: post.metaDescription || post.excerpt || undefined
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <main className="px-6 md:px-16 py-20 min-h-screen max-w-3xl mx-auto">
      {post.category && (
        <p className="text-xs gold-text uppercase tracking-wide mb-3">{post.category}</p>
      )}
      <h1 className="font-display text-3xl md:text-4xl text-white mb-4">{post.title}</h1>
      <p className="text-white/30 text-xs mb-10">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
      </p>

      <div
        className="prose prose-invert max-w-none text-white/80"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      <div className="mt-16">
        <Link href="/blog" className="gold-text text-sm hover:underline">
          &larr; Back to journal
        </Link>
      </div>
    </main>
  );
}
