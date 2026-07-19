import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" }
  });
  return NextResponse.json(vehicles);
}
