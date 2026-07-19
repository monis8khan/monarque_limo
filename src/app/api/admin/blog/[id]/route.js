import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await prisma.blogPost.findUnique({ where: { id: Number(params.id) } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const existing = await prisma.blogPost.findUnique({ where: { id: Number(params.id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const becomingPublished = body.status === "published" && existing.status !== "published";

  const post = await prisma.blogPost.update({
    where: { id: Number(params.id) },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.coverImageUrl !== undefined && { coverImageUrl: body.coverImageUrl }),
      ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
      ...(body.body !== undefined && { body: body.body }),
      ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
      ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
      ...(body.status !== undefined && { status: body.status }),
      ...(becomingPublished && { publishedAt: new Date() })
    }
  });

  return NextResponse.json(post);
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.blogPost.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
