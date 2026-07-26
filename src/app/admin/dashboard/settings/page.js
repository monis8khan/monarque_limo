"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";

const KNOWN_LABELS = {
  stat_journeys_completed: "Journeys Completed",
  stat_years_of_excellence: "Years of Excellence",
  stat_global_markets: "Global Markets",
  stat_privacy_guaranteed: "Privacy Guaranteed (%)",
  site_title: "Site Title",
  site_tagline: "Site Tagline",
  site_logo_url: "Site Logo",
  home_banner_image_url: "Home Banner Image",
  schema_business_json: "Business Schema JSON-LD",
  schema_website_json: "Website Schema JSON-LD"
};

const PAGE_TABS = [
  {
    id: "home",
    label: "Home",
    metaTitleKey: "page_home_meta_title",
    metaDescriptionKey: "page_home_meta_description"
  },
  {
    id: "services",
    label: "Services",
    metaTitleKey: "page_services_meta_title",
    metaDescriptionKey: "page_services_meta_description"
  },
  {
    id: "fleet",
    label: "Fleet",
    metaTitleKey: "page_fleet_meta_title",
    metaDescriptionKey: "page_fleet_meta_description"
  },
  {
    id: "blog",
    label: "Blog",
    metaTitleKey: "page_blog_meta_title",
    metaDescriptionKey: "page_blog_meta_description"
  }
];

const EMPTY_PAGE_META = {
  home: { metaTitle: "", metaDescription: "" },
  services: { metaTitle: "", metaDescription: "" },
  fleet: { metaTitle: "", metaDescription: "" },
  blog: { metaTitle: "", metaDescription: "" }
};

const EMPTY_SCHEMA_SETTINGS = {
  websiteSchema: "",
  businessSchema: ""
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [pageMeta, setPageMeta] = useState(EMPTY_PAGE_META);
  const [schemaSettings, setSchemaSettings] = useState(EMPTY_SCHEMA_SETTINGS);
  const [uploading, setUploading] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    const rows = Array.isArray(data) ? data : [];
    setSettings(rows);

    const nextPageMeta = { ...EMPTY_PAGE_META };
    PAGE_TABS.forEach((tab) => {
      nextPageMeta[tab.id] = {
        metaTitle: rows.find((s) => s.key === tab.metaTitleKey)?.value || "",
        metaDescription: rows.find((s) => s.key === tab.metaDescriptionKey)?.value || ""
      };
    });
    setPageMeta(nextPageMeta);
    setSchemaSettings({
      websiteSchema: rows.find((s) => s.key === "schema_website_json")?.value || "",
      businessSchema: rows.find((s) => s.key === "schema_business_json")?.value || ""
    });
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function updateLocal(key, value) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  function updatePageMeta(tabId, field, value) {
    setPageMeta((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        [field]: value
      }
    }));
  }

  function updateSchemaSetting(field, value) {
    setSchemaSettings((prev) => ({ ...prev, [field]: value }));
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

  async function savePageMeta(tabId) {
    const currentTab = PAGE_TABS.find((tab) => tab.id === tabId);
    if (!currentTab) return;

    setSaving((s) => ({ ...s, [tabId]: true }));
    try {
      await Promise.all([
        fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: currentTab.metaTitleKey,
            value: pageMeta[tabId]?.metaTitle || ""
          })
        }),
        fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: currentTab.metaDescriptionKey,
            value: pageMeta[tabId]?.metaDescription || ""
          })
        })
      ]);
    } finally {
      setSaving((s) => ({ ...s, [tabId]: false }));
    }
  }

  async function saveSchemaSettings() {
    setSaving((s) => ({ ...s, schemas: true }));
    try {
      await Promise.all([
        fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "schema_website_json", value: schemaSettings.websiteSchema })
        }),
        fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "schema_business_json", value: schemaSettings.businessSchema })
        })
      ]);
    } finally {
      setSaving((s) => ({ ...s, schemas: false }));
    }
  }

  async function handleImageUpload(field, file) {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [field]: true }));
    setUploadErrors((prev) => ({ ...prev, [field]: "" }));

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setUploadErrors((prev) => ({
          ...prev,
          [field]: data.error || "The image could not be uploaded."
        }));
        return;
      }

      await save(field === "homeBannerImageUrl" ? "home_banner_image_url" : field, data.url);
    } catch {
      setUploadErrors((prev) => ({
        ...prev,
        [field]: "The image could not be uploaded. Please try again."
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
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

  const generalSettings = settings.filter(
    (s) =>
      !PAGE_TABS.some((tab) => [tab.metaTitleKey, tab.metaDescriptionKey].includes(s.key)) &&
      !["schema_business_json", "schema_website_json", "home_banner_image_url", "site_logo_url"].includes(s.key)
  );

  const activePageTab = PAGE_TABS.find((tab) => tab.id === activeTab) || PAGE_TABS[0];

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-10 max-w-4xl">
        <h1 className="font-display text-2xl text-white mb-2">Site Settings</h1>
        <p className="text-white/50 text-sm mb-8">
          Manage the public site content and page SEO settings for the home, services, fleet, and blog pages.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "general"
                ? "bg-gold text-ink"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            General
          </button>
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-gold text-ink"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveTab("schemas")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "schemas"
                ? "bg-gold text-ink"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            Schemas
          </button>
        </div>

        {loading ? (
          <p className="text-white/50">Loading...</p>
        ) : activeTab === "general" ? (
          <>
            <div className="card space-y-4 mb-10">
              <div>
                <h2 className="text-white font-semibold">Brand Assets</h2>
                <p className="text-white/50 text-sm mt-1">
                  Upload and preview the logo used in the public header.
                </p>
              </div>
              <div>
                <label>Site Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleImageUpload("site_logo_url", file);
                    e.target.value = "";
                  }}
                />
                {uploading.site_logo_url && <p className="text-white/40 text-xs mt-1">Uploading...</p>}
                {uploadErrors.site_logo_url && (
                  <p className="mt-1 text-xs text-red-300">{uploadErrors.site_logo_url}</p>
                )}
                <div className="mt-3 space-y-2">
                  {settings.find((s) => s.key === "site_logo_url")?.value ? (
                    <img
                      src={settings.find((s) => s.key === "site_logo_url")?.value}
                      alt="Site logo preview"
                      className="h-24 w-full rounded-xl border border-white/10 object-contain bg-black/20 p-3"
                    />
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 text-sm text-white/40">
                      No logo set yet.
                    </div>
                  )}
                  <p className="text-xs text-white/40">
                    Current: {settings.find((s) => s.key === "site_logo_url")?.value || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {generalSettings.map((s) => (
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
          </>
        ) : activeTab === "schemas" ? (
          <div className="card space-y-4">
            <div>
              <h2 className="text-white font-semibold">Schema Markup</h2>
              <p className="text-white/50 text-sm mt-1">
                Paste valid JSON-LD objects for website and business schema. These will be injected across the site.
              </p>
            </div>

            <div>
              <label>Website Schema</label>
              <textarea
                value={schemaSettings.websiteSchema}
                onChange={(e) => updateSchemaSetting("websiteSchema", e.target.value)}
                rows={10}
                placeholder='{"@context":"https://schema.org","@type":"WebSite",...}'
              />
            </div>

            <div>
              <label>Business Schema</label>
              <textarea
                value={schemaSettings.businessSchema}
                onChange={(e) => updateSchemaSetting("businessSchema", e.target.value)}
                rows={10}
                placeholder='{"@context":"https://schema.org","@type":"LocalBusiness",...}'
              />
            </div>

            <button
              type="button"
              onClick={saveSchemaSettings}
              disabled={saving.schemas}
              className="btn-gold mb-0"
            >
              {saving.schemas ? "Saving..." : "Save Schemas"}
            </button>
          </div>
        ) : (
          <div className="card space-y-4">
            <div>
              <h2 className="text-white font-semibold">{activePageTab.label} Page SEO</h2>
              <p className="text-white/50 text-sm mt-1">
                These values will be used for the public {activePageTab.label.toLowerCase()} page metadata.
              </p>
            </div>

            {activePageTab.id === "home" && (
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <label>Home Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleImageUpload("homeBannerImageUrl", file);
                      e.target.value = "";
                    }}
                  />
                  {uploading.homeBannerImageUrl && <p className="text-white/40 text-xs mt-1">Uploading...</p>}
                  {uploadErrors.homeBannerImageUrl && (
                    <p className="mt-1 text-xs text-red-300">{uploadErrors.homeBannerImageUrl}</p>
                  )}
                </div>
                <div className="space-y-2">
                  {settings.find((s) => s.key === "home_banner_image_url")?.value ? (
                    <img
                      src={settings.find((s) => s.key === "home_banner_image_url")?.value}
                      alt="Home banner preview"
                      className="h-48 w-full rounded-xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 text-sm text-white/40">
                      No banner image set yet.
                    </div>
                  )}
                  <p className="text-xs text-white/40">
                    Current: {settings.find((s) => s.key === "home_banner_image_url")?.value || "Not set"}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label>Meta title</label>
              <input
                value={pageMeta[activePageTab.id]?.metaTitle || ""}
                onChange={(e) => updatePageMeta(activePageTab.id, "metaTitle", e.target.value)}
                placeholder={`Enter a meta title for the ${activePageTab.label} page`}
              />
            </div>

            <div>
              <label>Meta description</label>
              <textarea
                value={pageMeta[activePageTab.id]?.metaDescription || ""}
                onChange={(e) => updatePageMeta(activePageTab.id, "metaDescription", e.target.value)}
                rows={4}
                placeholder={`Enter a meta description for the ${activePageTab.label} page`}
              />
            </div>

            <button
              type="button"
              onClick={() => savePageMeta(activePageTab.id)}
              disabled={saving[activePageTab.id]}
              className="btn-gold mb-0"
            >
              {saving[activePageTab.id] ? "Saving..." : `Save ${activePageTab.label} SEO`}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
