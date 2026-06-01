import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                     from "next/headers";
import { redirect }                    from "next/navigation";
import Navbar                          from "@/components/Navbar";
import Footer                          from "@/components/Footer";
import AssetThumbnailGrid              from "@/components/AssetThumbnailGrid";
import { ASSET_CATEGORIES }            from "@/lib/assetCategories";
import type { Asset }                  from "@/types";

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/staff/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", session.user.id).single();
  if (profile?.role !== "admin") redirect("/staff/dashboard");

  const { data: rawAssets } = await supabase
    .from("assets")
    .select(`
      id, name, image_url, department,
      category_slug, serial_number, brand, model, available,
      inspections ( status, due_date )
    `)
    .order("category_slug").order("name");

  const { count: totalStaff } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "staff").eq("active", true);

  const { count: overdueCount } = await supabase
    .from("inspections")
    .select("*", { count: "exact", head: true })
    .eq("status", "overdue");

  const assets: Asset[] = (rawAssets ?? []).map((a: any) => ({
    id:            a.id,
    name:          a.name,
    image_url:     a.image_url,
    department:    a.department,
    category_slug: a.category_slug ?? "others",
    serial_number: a.serial_number,
    brand:         a.brand,
    model:         a.model,
    available:     a.available,
    status:        (a.inspections?.[0]?.status ?? "pending") as Asset["status"],
  }));

  const stats = {
    total:   assets.length,
    done:    assets.filter((a) => a.status === "done").length,
    pending: assets.filter((a) => a.status === "pending").length,
    overdue: overdueCount ?? 0,
    staff:   totalStaff   ?? 0,
  };

  return (
    <div className="page-wrapper">
      <Navbar role="admin" />

      <main className="page-main space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📊 Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Virtual Staffing Solutions — Asset Management
            </p>
          </div>
          {stats.overdue > 0 && (
            <div className="inline-flex items-center gap-2 bg-red-100
                            border border-red-300 text-red-700 px-5 py-2.5
                            rounded-xl font-semibold text-sm flex-shrink-0">
              🚨 {stats.overdue} Overdue
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Assets", value: stats.total,   icon: "📦", bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100"   },
            { label: "Inspected",    value: stats.done,    icon: "✅", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100"  },
            { label: "Pending",      value: stats.pending, icon: "🕐", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-100" },
            { label: "Overdue",      value: stats.overdue, icon: "🚨", bg: "bg-red-50",    text: "text-red-700",    border: "border-red-100"    },
            { label: "Active Staff", value: stats.staff,   icon: "👥", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
          ].map((s) => (
            <div key={s.label}
              className={`stat-card ${s.bg} ${s.border}`}>
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category Quick Count */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
            📂 By Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5
                          lg:grid-cols-10 gap-3">
            {ASSET_CATEGORIES.map((cat) => {
              const count = assets.filter(
                (a) => a.category_slug === cat.slug
              ).length;
              return (
                <div key={cat.slug}
                  className={`
                    ${cat.color} ${cat.borderColor} border rounded-xl
                    p-3 text-center flex flex-col items-center gap-1
                    hover:shadow-sm transition-shadow
                  `}>
                  <span className="text-2xl">{cat.icon}</span>
                  <span className={`text-lg font-bold ${cat.textColor}`}>
                    {count}
                  </span>
                  <span className="text-xs text-gray-500 leading-tight
                                   line-clamp-2 text-center">
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asset Grid */}
        <div className="section-card">
          <AssetThumbnailGrid assets={assets} title="All Assets" />
        </div>

      </main>
      <Footer />
    </div>
  );
}
