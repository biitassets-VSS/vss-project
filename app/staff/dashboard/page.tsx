import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                     from "next/headers";
import { redirect }                    from "next/navigation";
import Navbar                          from "@/components/Navbar";
import Footer                          from "@/components/Footer";
import AssetThumbnailGrid              from "@/components/AssetThumbnailGrid";
import OverdueBanner                   from "@/components/OverdueBanner";
import type { Asset }                  from "@/types";

export default async function StaffDashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/staff/login");

  const { data: profile } = await supabase
    .from("profiles").select("id, role, active")
    .eq("id", session.user.id).single();

  if (!profile?.active)          redirect("/staff/login?reason=deactivated");
  if (profile?.role !== "staff") redirect("/admin/dashboard");

  const { data: assignments } = await supabase
    .from("staff_assets")
    .select(`
      assets (
        id, name, image_url, department,
        category_slug, serial_number, brand, model, available,
        inspections ( status, due_date )
      )
    `)
    .eq("staff_id", profile.id);

  const { data: overdueNotifs } = await supabase
    .from("inspection_notifications")
    .select("message")
    .eq("staff_id", profile.id).eq("status", "overdue");

  const assets: Asset[] = (assignments ?? [])
    .map((a: any) => {
      const asset = a.assets;
      if (!asset) return null;
      const insp  = asset.inspections?.[0];
      return {
        id:            asset.id,
        name:          asset.name,
        image_url:     asset.image_url,
        department:    asset.department,
        category_slug: asset.category_slug ?? "others",
        serial_number: asset.serial_number,
        brand:         asset.brand,
        model:         asset.model,
        available:     asset.available,
        status: (insp?.status ?? "pending") as Asset["status"],
      };
    })
    .filter(Boolean) as Asset[];

  const overdueMsgs = (overdueNotifs ?? []).map((n: any) => n.message);

  return (
    <div className="page-wrapper">
      <Navbar role="staff" />
      <main className="page-main space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">👋 My Assets</h1>
          <p className="text-gray-500 text-sm mt-1">
            {assets.length} asset{assets.length !== 1 ? "s" : ""} assigned to you
          </p>
        </div>

        {overdueMsgs.length > 0 && (
          <OverdueBanner count={overdueMsgs.length} messages={overdueMsgs} />
        )}

        <div className="section-card">
          <AssetThumbnailGrid
            assets={assets}
            title="My Assigned Assets"
            showInspect
          />
        </div>

      </main>
      <Footer />
    </div>
  );
}
