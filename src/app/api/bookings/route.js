import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendMail, bookingCustomerEmail, bookingAdminEmail } from "@/lib/mailer";

// Very small in-memory rate limiter (per server instance) to deter spam.
// For production, put this behind a real rate limiter (e.g. at the proxy/CDN level).
const recentSubmissions = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = recentSubmissions.get(ip) || [];
  const recent = entry.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  recentSubmissions.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const bookingSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(5).max(30),
  email: z.string().email(),
  pickupDatetime: z.string().min(1),
  serviceType: z.string().min(2).max(120),
  vehicleId: z.number().int().positive().nullable().optional(),
  passengers: z.number().int().min(1).max(50).default(1),
  luggage: z.number().int().min(0).max(50).default(0),
  specialInstructions: z.string().max(2000).optional().nullable()
});

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const pickupDate = new Date(data.pickupDatetime);
  if (isNaN(pickupDate.getTime())) {
    return NextResponse.json({ error: "Invalid pickup date/time." }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      pickupDatetime: pickupDate,
      serviceType: data.serviceType,
      vehicleId: data.vehicleId || null,
      passengers: data.passengers,
      luggage: data.luggage,
      specialInstructions: data.specialInstructions || null,
      status: "pending"
    }
  });

  const customerEmail = bookingCustomerEmail(booking);
  const adminEmail = bookingAdminEmail(booking);

  await sendMail({ to: booking.email, ...customerEmail });
  if (process.env.NOTIFY_EMAIL) {
    await sendMail({ to: process.env.NOTIFY_EMAIL, ...adminEmail });
  }

  return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
}
