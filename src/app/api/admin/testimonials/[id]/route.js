import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const testimonial = await prisma.testimonial.update({
    where: { id: Number(params.id) },
    data: {
      ...(body.clientName !== undefined && { clientName: body.clientName }),
      ...(body.clientTitle !== undefined && { clientTitle: body.clientTitle }),
      ...(body.quote !== undefined && { quote: body.quote }),
      ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) })
    }
  });
  return NextResponse.json(testimonial);
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.testimonial.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
