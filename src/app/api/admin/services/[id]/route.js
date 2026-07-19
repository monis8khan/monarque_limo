import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const service = await prisma.service.update({
    where: { id: Number(params.id) },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.icon !== undefined && { icon: body.icon }),
      ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) })
    }
  });
  return NextResponse.json(service);
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.service.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
