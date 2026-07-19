"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";

const KNOWN_LABELS = {
  stat_journeys_completed: "Journeys Completed",
  stat_years_of_excellence: "Years of Excellence",
  stat_global_markets: "Global Markets",
  stat_privacy_guaranteed: "Privacy Guaranteed (%)"
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    setSettings(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function updateLocal(key, value) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  async function save(key, value) {
    setSaving((s) => ({ ...s, [key]: true }));
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  }

  async function addSetting(e) {
    e.preventDefault();
    if (!newKey) return;
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey, value: newValue })
    });
    setNewKey("");
    setNewValue("");
    load();
  }

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-10 max-w-2xl">
        <h1 className="font-display text-2xl text-white mb-2">Site Settings</h1>
        <p className="text-white/50 text-sm mb-8">
          These power the homepage trust counters and any other editable text/numbers.
          Changes save individually — click Save next to each field.
        </p>

        {loading ? (
          <p className="text-white/50">Loading...</p>
        ) : (
          <div className="space-y-4 mb-10">
            {settings.map((s) => (
              <div key={s.key} className="card flex items-end gap-3">
                <div className="flex-1">
                  <label>{KNOWN_LABELS[s.key] || s.key}</label>
                  <input value={s.value} onChange={(e) => updateLocal(s.key, e.target.value)} />
                </div>
                <button
                  onClick={() => save(s.key, s.value)}
                  disabled={saving[s.key]}
                  className="btn-gold mb-0"
                >
                  {saving[s.key] ? "Saving..." : "Save"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <h2 className="text-white font-semibold mb-4">Add a New Setting</h2>
          <form onSubmit={addSetting} className="flex items-end gap-3">
            <div className="flex-1">
              <label>Key</label>
              <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. hero_tagline" />
            </div>
            <div className="flex-1">
              <label>Value</label>
              <input value={newValue} onChange={(e) => setNewValue(e.target.value)} />
            </div>
            <button type="submit" className="btn-gold mb-0">
              Add
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
