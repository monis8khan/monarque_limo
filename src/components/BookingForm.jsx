"use client";

import { useState } from "react";

export default function BookingForm({ vehicles, services }) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.target);
    const payload = {
      fullName: form.get("fullName"),
      phone: form.get("phone"),
      email: form.get("email"),
      pickupDatetime: form.get("pickupDatetime"),
      serviceType: form.get("serviceType"),
      vehicleId: form.get("vehicleId") ? Number(form.get("vehicleId")) : null,
      passengers: Number(form.get("passengers")) || 1,
      luggage: Number(form.get("luggage")) || 0,
      specialInstructions: form.get("specialInstructions")
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      e.target.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (status === "success") {
    return (
      <div className="card text-center">
        <p className="text-lg gold-text font-semibold mb-2">Request received</p>
        <p className="text-white/80">
          Thank you — our team will confirm your reservation by email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" name="fullName" required />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="pickupDatetime">Pickup Date &amp; Time</label>
        <input id="pickupDatetime" name="pickupDatetime" type="datetime-local" required />
      </div>
      <div>
        <label htmlFor="serviceType">Service Type</label>
        <select id="serviceType" name="serviceType" required defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="vehicleId">Preferred Vehicle</label>
        <select id="vehicleId" name="vehicleId" defaultValue="">
          <option value="">No preference</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="passengers">Passengers</label>
        <input id="passengers" name="passengers" type="number" min="1" defaultValue="1" />
      </div>
      <div>
        <label htmlFor="luggage">Luggage (bags)</label>
        <input id="luggage" name="luggage" type="number" min="0" defaultValue="0" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="specialInstructions">Special Instructions</label>
        <textarea id="specialInstructions" name="specialInstructions" rows="3" />
      </div>

      {status === "error" && (
        <p className="md:col-span-2 text-red-400 text-sm">{errorMsg}</p>
      )}

      <div className="md:col-span-2">
        <button type="submit" disabled={status === "submitting"} className="btn-gold">
          {status === "submitting" ? "Submitting..." : "Request Booking"}
        </button>
      </div>
    </form>
  );
}
