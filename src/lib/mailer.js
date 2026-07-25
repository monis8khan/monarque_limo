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
          <div style="margin:0; padding:0; background:#0b0b0f; font-family:Arial, Helvetica, sans-serif; color:#f5f5f5;">
            <div style="max-width:640px; margin:0 auto; padding:32px 20px;">
              <div style="background:linear-gradient(145deg, #111118 0%, #07070a 100%); border:1px solid #b68d2c; border-radius:18px; overflow:hidden; box-shadow:0 0 30px rgba(182,141,44,0.18);">
                <div style="padding:28px 30px; border-bottom:1px solid rgba(182,141,44,0.25); background:linear-gradient(90deg, rgba(182,141,44,0.18), rgba(255,215,120,0.04));">
                  <h2 style="margin:0; font-size:24px; letter-spacing:1px; color:#d8b45a; text-transform:uppercase;">Booking Request Confirmed</h2>
                </div>

                <div style="padding:30px;">
                  <p style="margin:0 0 16px; font-size:16px; line-height:1.7; color:#e7e7e7;">
                    Thank you, <strong style="color:#d8b45a;">${booking.fullName}</strong>. We have successfully received your reservation request for
                    <strong style="color:#d8b45a;">${booking.serviceType}</strong> scheduled for
                    <strong style="color:#d8b45a;">${new Date(booking.pickupDatetime).toLocaleString()}</strong>.
                  </p>

                  <p style="margin:0 0 16px; font-size:16px; line-height:1.7; color:#e7e7e7;">
                    Our team is now reviewing your request and will contact you shortly to confirm the details and finalize your booking.
                  </p>

                  <p style="margin:0; font-size:16px; line-height:1.7; color:#e7e7e7;">
                    We appreciate the opportunity to serve you and look forward to delivering a premium experience.
                  </p>

                  <div style="margin-top:28px; padding-top:18px; border-top:1px solid rgba(182,141,44,0.25); color:#d8b45a; font-weight:bold; letter-spacing:0.5px;">
                    Monarque Limo
                  </div>
                </div>
              </div>
            </div>
          </div>
    `
  };
}

export function bookingAdminEmail(booking) {
  return {
    subject: `New booking request from ${booking.fullName}`,
    html: `
        <div style="margin:0; padding:0; background:#0b0b0f; font-family:Arial, Helvetica, sans-serif; color:#f5f5f5;">
          <div style="max-width:640px; margin:0 auto; padding:32px 20px;">
            <div style="background:linear-gradient(145deg, #111118 0%, #07070a 100%); border:1px solid #b68d2c; border-radius:18px; overflow:hidden; box-shadow:0 0 30px rgba(182,141,44,0.18);">
              <div style="padding:28px 30px; border-bottom:1px solid rgba(182,141,44,0.25); background:linear-gradient(90deg, rgba(182,141,44,0.18), rgba(255,215,120,0.04));">
                <h2 style="margin:0; font-size:24px; letter-spacing:1px; color:#d8b45a; text-transform:uppercase;">New Booking Request</h2>
              </div>

              <div style="padding:30px;">
                <p style="margin:0 0 18px; font-size:16px; line-height:1.7; color:#e7e7e7;">
                  A new reservation request has been received and is ready for review. Please find the booking details below.
                </p>

                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(182,141,44,0.18); border-radius:14px; padding:20px;">
                  <ul style="margin:0; padding:0; list-style:none;">
                    <li style="padding:10px 0; border-bottom:1px solid rgba(182,141,44,0.12);"><strong style="color:#d8b45a;">Client Name:</strong> ${booking.fullName}</li>
                    <li style="padding:10px 0; border-bottom:1px solid rgba(182,141,44,0.12);"><strong style="color:#d8b45a;">Contact Number:</strong> ${booking.phone}</li>
                    <li style="padding:10px 0; border-bottom:1px solid rgba(182,141,44,0.12);"><strong style="color:#d8b45a;">Email Address:</strong> ${booking.email}</li>
                    <li style="padding:10px 0; border-bottom:1px solid rgba(182,141,44,0.12);"><strong style="color:#d8b45a;">Requested Service:</strong> ${booking.serviceType}</li>
                    <li style="padding:10px 0; border-bottom:1px solid rgba(182,141,44,0.12);"><strong style="color:#d8b45a;">Pickup Date &amp; Time:</strong> ${new Date(booking.pickupDatetime).toLocaleString()}</li>
                    <li style="padding:10px 0; border-bottom:1px solid rgba(182,141,44,0.12);"><strong style="color:#d8b45a;">Number of Passengers:</strong> ${booking.passengers}</li>
                    <li style="padding:10px 0; border-bottom:1px solid rgba(182,141,44,0.12);"><strong style="color:#d8b45a;">Luggage Count:</strong> ${booking.luggage}</li>
                    <li style="padding:10px 0;"><strong style="color:#d8b45a;">Additional Notes:</strong> ${booking.specialInstructions || "—"}</li>
                  </ul>
                </div>

                <p style="margin:22px 0 0; font-size:16px; line-height:1.7; color:#e7e7e7;">
                  Please review this request at your earliest convenience and proceed with the next steps accordingly.
                </p>

                <div style="margin-top:28px; padding-top:18px; border-top:1px solid rgba(182,141,44,0.25); color:#d8b45a; font-weight:bold; letter-spacing:0.5px;">
                  Monarque Limo
                </div>
              </div>
            </div>
          </div>
        </div>
    `
  };
}
