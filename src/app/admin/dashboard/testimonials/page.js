"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";

const emptyForm = {
  id: null,
  clientName: "",
  clientTitle: "",
  quote: "",
  displayOrder: 0,
  isActive: true
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    setTestimonials(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function edit(t) {
    setForm({
      id: t.id,
      clientName: t.clientName || "",
      clientTitle: t.clientTitle || "",
      quote: t.quote || "",
      displayOrder: t.displayOrder || 0,
      isActive: t.isActive
    });
  }

  function resetForm() {
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) {
        await fetch(`/api/admin/testimonials/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      }
      resetForm();
      load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (form.id === id) resetForm();
    load();
  }

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-10">
        <h1 className="font-display text-2xl text-white mb-6">Testimonials</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="card space-y-4">
            <h2 className="text-white font-semibold">{form.id ? "Edit Testimonial" : "New Testimonial"}</h2>

            <div>
              <label>Client Name</label>
              <input
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Client Title / Company</label>
              <input
                value={form.clientTitle}
                onChange={(e) => setForm({ ...form, clientTitle: e.target.value })}
              />
            </div>
            <div>
              <label>Quote</label>
              <textarea rows="3" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
            </div>
            <div>
              <label>Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActiveTestimonial"
                className="w-auto"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <label htmlFor="isActiveTestimonial" className="mb-0">Active (visible on site)</label>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold">
                {saving ? "Saving..." : form.id ? "Update" : "Add Testimonial"}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} className="text-white/50 hover:text-white text-sm">
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          <div>
            {loading ? (
              <p className="text-white/50">Loading...</p>
            ) : testimonials.length === 0 ? (
              <p className="text-white/50">No testimonials yet.</p>
            ) : (
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="card flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{t.clientName}</p>
                      <p className="text-white/40 text-xs">
                        {t.clientTitle} ·{" "}
                        {t.isActive ? <span className="gold-text">active</span> : "inactive"}
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => edit(t)} className="text-white/60 hover:text-gold text-xs">
                        Edit
                      </button>
                      <button onClick={() => remove(t.id)} className="text-red-400 hover:text-red-300 text-xs">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
