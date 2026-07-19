"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";

const emptyForm = {
  id: null,
  name: "",
  category: "",
  description: "",
  passengerCapacity: 4,
  features: "",
  imageUrl: "",
  displayOrder: 0,
  isActive: true
};

export default function AdminFleetPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/vehicles");
    const data = await res.json();
    setVehicles(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function edit(v) {
    setForm({
      id: v.id,
      name: v.name || "",
      category: v.category || "",
      description: v.description || "",
      passengerCapacity: v.passengerCapacity || 4,
      features: v.features || "",
      imageUrl: v.imageUrl || "",
      displayOrder: v.displayOrder || 0,
      isActive: v.isActive
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
        await fetch(`/api/admin/vehicles/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        await fetch("/api/admin/vehicles", {
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
    if (!confirm("Delete this vehicle?")) return;
    await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
    if (form.id === id) resetForm();
    load();
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, imageUrl: data.url }));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-10">
        <h1 className="font-display text-2xl text-white mb-6">Fleet</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="card space-y-4">
            <h2 className="text-white font-semibold">{form.id ? "Edit Vehicle" : "New Vehicle"}</h2>

            <div>
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label>Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="SUV, Sedan, Van..."
              />
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
              <label>Passenger Capacity</label>
              <input
                type="number"
                min="1"
                value={form.passengerCapacity}
                onChange={(e) => setForm({ ...form, passengerCapacity: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Features (comma-separated)</label>
              <input
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
            </div>
            <div>
              <label>Image</label>
              <input type="file" accept="image/*" onChange={handleUpload} />
              {uploading && <p className="text-white/40 text-xs mt-1">Uploading...</p>}
              {form.imageUrl && <p className="text-white/40 text-xs mt-1">Current: {form.imageUrl}</p>}
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
                id="isActive"
                className="w-auto"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <label htmlFor="isActive" className="mb-0">Active (visible on site)</label>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold">
                {saving ? "Saving..." : form.id ? "Update Vehicle" : "Add Vehicle"}
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
            ) : vehicles.length === 0 ? (
              <p className="text-white/50">No vehicles yet.</p>
            ) : (
              <div className="space-y-3">
                {vehicles.map((v) => (
                  <div key={v.id} className="card flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{v.name}</p>
                      <p className="text-white/40 text-xs">
                        {v.category} · {v.passengerCapacity} pax ·{" "}
                        {v.isActive ? <span className="gold-text">active</span> : "inactive"}
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => edit(v)} className="text-white/60 hover:text-gold text-xs">
                        Edit
                      </button>
                      <button onClick={() => remove(v.id)} className="text-red-400 hover:text-red-300 text-xs">
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
