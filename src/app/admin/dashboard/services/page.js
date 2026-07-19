"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";

const emptyForm = { id: null, title: "", description: "", displayOrder: 0, isActive: true };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function edit(s) {
    setForm({
      id: s.id,
      title: s.title || "",
      description: s.description || "",
      displayOrder: s.displayOrder || 0,
      isActive: s.isActive
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
        await fetch(`/api/admin/services/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        await fetch("/api/admin/services", {
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
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (form.id === id) resetForm();
    load();
  }

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-10">
        <h1 className="font-display text-2xl text-white mb-6">Services</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="card space-y-4">
            <h2 className="text-white font-semibold">{form.id ? "Edit Service" : "New Service"}</h2>

            <div>
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label>Description</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
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
                id="isActiveService"
                className="w-auto"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <label htmlFor="isActiveService" className="mb-0">Active (visible on site)</label>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold">
                {saving ? "Saving..." : form.id ? "Update Service" : "Add Service"}
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
            ) : services.length === 0 ? (
              <p className="text-white/50">No services yet.</p>
            ) : (
              <div className="space-y-3">
                {services.map((s) => (
                  <div key={s.id} className="card flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{s.title}</p>
                      <p className="text-white/40 text-xs">
                        {s.isActive ? <span className="gold-text">active</span> : "inactive"}
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => edit(s)} className="text-white/60 hover:text-gold text-xs">
                        Edit
                      </button>
                      <button onClick={() => remove(s.id)} className="text-red-400 hover:text-red-300 text-xs">
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
