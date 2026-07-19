import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const vehicle = await prisma.vehicle.update({
    where: { id: Number(params.id) },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.passengerCapacity !== undefined && {
        passengerCapacity: Number(body.passengerCapacity)
      }),
      ...(body.features !== undefined && { features: body.features }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) })
    }
  });
  return NextResponse.json(vehicle);
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.vehicle.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
