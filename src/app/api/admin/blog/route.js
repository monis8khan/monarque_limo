import { NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const baseSlug = body.slug ? slugify(body.slug, { lower: true }) : slugify(body.title || "post", { lower: true });

  let slug = baseSlug;
  let counter = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug,
      category: body.category || null,
      coverImageUrl: body.coverImageUrl || null,
      excerpt: body.excerpt || null,
      body: body.body || "",
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      status: body.status || "draft",
      publishedAt: body.status === "published" ? new Date() : null
    }
  });

  return NextResponse.json(post, { status: 201 });
}
