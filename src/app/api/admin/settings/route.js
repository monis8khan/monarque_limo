import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.siteSetting.findMany();
  return NextResponse.json(rows);
}

// body: { key: string, value: string } — upserts a single setting
export async function PUT(request) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  const setting = await prisma.siteSetting.upsert({
    where: { key: body.key },
    update: { value: String(body.value ?? "") },
    create: { key: body.key, value: String(body.value ?? "") }
  });

  return NextResponse.json(setting);
}
