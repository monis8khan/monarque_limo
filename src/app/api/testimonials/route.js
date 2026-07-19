import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" }
  });
  return NextResponse.json(testimonials);
}
