import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                     from "next/headers";
import { redirect }                    from "next/navigation";
import Link                            from "next/link";
import Navbar                          from "@/components/Navbar";
import Footer                          from "@/components/Footer";
import AssetThumbnailGrid              from "@/components/AssetThumbnailGrid";
import type { Asset }                  from "@/types";

export default async function AdminAssetsPage() {
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
      inspections ( status )
    `)
    .order("category_slug").order("name");

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

  return (
    <div className="page-wrapper">
      <Navbar role="admin" />
      <main className="page-main space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📦 Asset Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">{assets.length} total assets</p>
          </div>
          <Link href="/admin/assets/add" className="btn-primary">
            ➕ Add Asset
          </Link>
        </div>
        <div className="section-card">
          <AssetThumbnailGrid assets={assets} title="All Assets" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
