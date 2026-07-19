"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const url = filter ? `/api/admin/bookings?status=${filter}` : "/api/admin/bookings";
    const res = await fetch(url);
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function updateStatus(id, status) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notifyCustomer: status === "confirmed" })
    });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-10">
        <h1 className="font-display text-2xl text-white mb-6">Bookings</h1>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("")}
            className={`px-3 py-1 text-sm rounded-sm border ${
              filter === "" ? "border-gold text-gold" : "border-white/20 text-white/60"
            }`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-sm rounded-sm border capitalize ${
                filter === s ? "border-gold text-gold" : "border-white/20 text-white/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white/50">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-white/50">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Service</th>
                  <th className="py-2 pr-4">Pickup</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-white/5">
                    <td className="py-3 pr-4">
                      <div className="text-white">{b.fullName}</div>
                      <div className="text-white/40 text-xs">{b.email} · {b.phone}</div>
                    </td>
                    <td className="py-3 pr-4 text-white/70">{b.serviceType}</td>
                    <td className="py-3 pr-4 text-white/70">
                      {new Date(b.pickupDatetime).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="py-1 px-2 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => remove(b.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
