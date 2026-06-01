"use client";

import { useState }                     from "react";
import { useRouter }                    from "next/navigation";
import { createClientComponentClient }  from "@supabase/auth-helpers-nextjs";
import Navbar                           from "@/components/Navbar";
import Footer                           from "@/components/Footer";
import { CATEGORY_SLUG_OPTIONS, getCategoryBySlug } from "@/lib/assetCategories";

export default function AddAssetPage() {
  const supabase = createClientComponentClient();
  const router   = useRouter();

  const [form, setForm] = useState({
    name: "", brand: "", model: "",
    serial_number: "", department: "",
    category_slug: "others", image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const selectedCat = getCategoryBySlug(form.category_slug);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: insertErr } = await supabase.from("assets").insert({
      name:          form.name,
      brand:         form.brand         || null,
      model:         form.model         || null,
      serial_number: form.serial_number || null,
      department:    form.department    || null,
      category_slug: form.category_slug,
      image_url:     form.image_url     || null,
      available:     true,
    });

    if (insertErr) {
      setError(insertErr.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/admin/assets"), 1500);
  }

  return (
    <div className="page-wrapper">
      <Navbar role="admin" />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">➕ Add New Asset</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to add a new asset to inventory
          </p>
        </div>

        <div className="section-card">
          {success ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-3">✅</p>
              <p className="font-bold text-green-700 text-xl">Asset Added!</p>
              <p className="text-gray-400 text-sm mt-1">Redirecting to inventory...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Category Select */}
              <div>
                <label className="label">Category *</label>
                <select
                  name="category_slug"
                  value={form.category_slug}
                  onChange={handleChange}
                  required
                  className="select"
                >
                  {CATEGORY_SLUG_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {/* Category Preview */}
                <div className={`
                  mt-2 inline-flex items-center gap-2 px-3 py-1.5
                  rounded-xl text-sm font-medium border
                  ${selectedCat.color} ${selectedCat.textColor} ${selectedCat.borderColor}
                `}>
                  <span className="text-lg">{selectedCat.icon}</span>
                  {selectedCat.label}
                  <span className="text-xs opacity-70">— {selectedCat.description}</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="label">Asset Name *</label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} required
                  placeholder="e.g. MacBook Pro 14-inch"
                  className="input"
                />
              </div>

              {/* Brand + Model */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Brand</label>
                  <input
                    type="text" name="brand" value={form.brand}
                    onChange={handleChange} placeholder="e.g. Apple"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Model</label>
                  <input
                    type="text" name="model" value={form.model}
                    onChange={handleChange} placeholder="e.g. M3 Pro"
                    className="input"
                  />
                </div>
              </div>

              {/* Serial */}
              <div>
                <label className="label">Serial Number</label>
                <input
                  type="text" name="serial_number"
                  value={form.serial_number}
                  onChange={handleChange}
                  placeholder="e.g. C02XG123JGHJ"
                  className="input font-mono"
                />
              </div>

              {/* Department */}
              <div>
                <label className="label">Department</label>
                <input
                  type="text" name="department" value={form.department}
                  onChange={handleChange} placeholder="e.g. Engineering"
                  className="input"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="label">Image URL</label>
                <input
                  type="url" name="image_url" value={form.image_url}
                  onChange={handleChange} placeholder="https://..."
                  className="input"
                />
                {form.image_url && (
                  <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600
                                text-sm p-3 rounded-xl flex gap-2">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => router.back()}
                  className="btn-secondary flex-1 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={loading}
                  className="btn-primary flex-1 py-3"
                >
                  {loading ? "⏳ Saving..." : "✅ Add Asset"}
                </button>
              </div>

            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
