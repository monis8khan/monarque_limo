import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vehicles = await prisma.vehicle.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json(vehicles);
}

export async function POST(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const vehicle = await prisma.vehicle.create({
    data: {
      name: body.name,
      category: body.category,
      description: body.description || "",
      passengerCapacity: Number(body.passengerCapacity) || 1,
      features: body.features || "",
      imageUrl: body.imageUrl || null,
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true
    }
  });
  return NextResponse.json(vehicle, { status: 201 });
}
