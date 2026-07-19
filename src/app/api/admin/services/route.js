import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const services = await prisma.service.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json(services);
}

export async function POST(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const service = await prisma.service.create({
    data: {
      title: body.title,
      description: body.description || "",
      icon: body.icon || null,
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true
    }
  });
  return NextResponse.json(service, { status: 201 });
}
