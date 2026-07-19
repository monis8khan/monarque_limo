import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";

export async function GET(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) },
    include: { vehicle: true }
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PUT(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { status, assignedVehicleId, assignedDriver, internalNotes, notifyCustomer } = body;

  const booking = await prisma.booking.update({
    where: { id: Number(params.id) },
    data: {
      ...(status !== undefined && { status }),
      ...(assignedVehicleId !== undefined && { assignedVehicleId }),
      ...(assignedDriver !== undefined && { assignedDriver }),
      ...(internalNotes !== undefined && { internalNotes })
    }
  });

  if (notifyCustomer && status === "confirmed") {
    await sendMail({
      to: booking.email,
      subject: "Your Monarque Limo reservation is confirmed",
      html: `<p>Hi ${booking.fullName},</p><p>Your reservation for <strong>${booking.serviceType}</strong> on ${new Date(
        booking.pickupDatetime
      ).toLocaleString()} is confirmed. We look forward to serving you.</p><p>— Monarque Limo</p>`
    });
  }

  return NextResponse.json(booking);
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.booking.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
