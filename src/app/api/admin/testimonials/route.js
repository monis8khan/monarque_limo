import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const testimonials = await prisma.testimonial.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json(testimonials);
}

export async function POST(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const testimonial = await prisma.testimonial.create({
    data: {
      clientName: body.clientName,
      clientTitle: body.clientTitle || null,
      quote: body.quote || "",
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true
    }
  });
  return NextResponse.json(testimonial, { status: 201 });
}
