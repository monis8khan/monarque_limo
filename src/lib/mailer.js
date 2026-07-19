import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  return transporter;
}

export async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.warn(
      `[mailer] SMTP not configured — skipping email to ${to} ("${subject}"). Set SMTP_* env vars to enable.`
    );
    return { skipped: true };
  }

  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || "Monarque Limo <no-reply@monarquelimo.com>",
      to,
      subject,
      html
    });
    return { sent: true };
  } catch (err) {
    console.error("[mailer] Failed to send email:", err.message);
    return { sent: false, error: err.message };
  }
}

export function bookingCustomerEmail(booking) {
  return {
    subject: "Your Monarque Limo booking request",
    html: `
      <h2>Thank you for your booking request, ${booking.fullName}</h2>
      <p>We've received your request for <strong>${booking.serviceType}</strong> on
      ${new Date(booking.pickupDatetime).toLocaleString()}.</p>
      <p>A member of our team will confirm your reservation shortly.</p>
      <p>— Monarque Limo</p>
    `
  };
}

export function bookingAdminEmail(booking) {
  return {
    subject: `New booking request from ${booking.fullName}`,
    html: `
      <h2>New booking request</h2>
      <ul>
        <li><strong>Name:</strong> ${booking.fullName}</li>
        <li><strong>Phone:</strong> ${booking.phone}</li>
        <li><strong>Email:</strong> ${booking.email}</li>
        <li><strong>Service:</strong> ${booking.serviceType}</li>
        <li><strong>Pickup:</strong> ${new Date(booking.pickupDatetime).toLocaleString()}</li>
        <li><strong>Passengers:</strong> ${booking.passengers}</li>
        <li><strong>Luggage:</strong> ${booking.luggage}</li>
        <li><strong>Notes:</strong> ${booking.specialInstructions || "—"}</li>
      </ul>
    `
  };
}
