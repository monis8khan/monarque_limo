"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";

const emptyForm = {
  id: null,
  title: "",
  slug: "",
  category: "",
  coverImageUrl: "",
  excerpt: "",
  body: "",
  metaTitle: "",
  metaDescription: "",
  status: "draft"
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function edit(post) {
    setForm({
      id: post.id,
      title: post.title || "",
      slug: post.slug || "",
      category: post.category || "",
      coverImageUrl: post.coverImageUrl || "",
      excerpt: post.excerpt || "",
      body: post.body || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      status: post.status || "draft"
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
        await fetch(`/api/admin/blog/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        await fetch("/api/admin/blog", {
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
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
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
      if (data.url) {
        setForm((f) => ({ ...f, coverImageUrl: data.url }));
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-10">
        <h1 className="font-display text-2xl text-white mb-6">Blog Posts</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="card space-y-4">
            <h2 className="text-white font-semibold">{form.id ? "Edit Post" : "New Post"}</h2>

            <div>
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Slug (leave blank to auto-generate)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. pinnacle-of-luxury-transport"
              />
            </div>

            <div>
              <label>Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div>
              <label>Cover Image</label>
              <input type="file" accept="image/*" onChange={handleUpload} />
              {uploading && <p className="text-white/40 text-xs mt-1">Uploading...</p>}
              {form.coverImageUrl && (
                <div className="mt-3 space-y-2">
                  <img
                    src={form.coverImageUrl}
                    alt="Blog cover preview"
                    className="h-28 w-full rounded-xl border border-white/10 object-cover"
                  />
                  <p className="text-white/40 text-xs">Current: {form.coverImageUrl}</p>
                </div>
              )}
            </div>

            <div>
              <label>Excerpt</label>
              <textarea
                rows="2"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>

            <div>
              <label>Body (HTML supported)</label>
              <textarea
                rows="8"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Meta Title (SEO)</label>
              <input
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              />
            </div>

            <div>
              <label>Meta Description (SEO)</label>
              <textarea
                rows="2"
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              />
            </div>

            <div>
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold">
                {saving ? "Saving..." : form.id ? "Update Post" : "Create Post"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-white/50 hover:text-white text-sm"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          {/* List */}
          <div>
            {loading ? (
              <p className="text-white/50">Loading...</p>
            ) : posts.length === 0 ? (
              <p className="text-white/50">No posts yet.</p>
            ) : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="card flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{p.title}</p>
                      <p className="text-white/40 text-xs">
                        /{p.slug} ·{" "}
                        <span className={p.status === "published" ? "gold-text" : ""}>
                          {p.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => edit(p)} className="text-white/60 hover:text-gold text-xs">
                        Edit
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
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
