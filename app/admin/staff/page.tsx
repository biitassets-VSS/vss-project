import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                     from "next/headers";
import { redirect }                    from "next/navigation";
import Navbar                          from "@/components/Navbar";
import Footer                          from "@/components/Footer";
import StaffDeactivateButton           from "./StaffDeactivateButton";

export default async function AdminStaffPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/staff/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", session.user.id).single();
  if (profile?.role !== "admin") redirect("/staff/dashboard");

  const { data: staffList } = await supabase
    .from("profiles")
    .select("id, role, active, department, phone, staff_assets ( asset_id )")
    .eq("role", "staff")
    .order("active", { ascending: false });

  const activeCount   = staffList?.filter((s) => s.active).length  ?? 0;
  const inactiveCount = staffList?.filter((s) => !s.active).length ?? 0;

  return (
    <div className="page-wrapper">
      <Navbar role="admin" />
      <main className="page-main space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👥 Staff Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              {activeCount} active · {inactiveCount} inactive
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Staff",    value: staffList?.length ?? 0, icon: "👥", bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100"   },
            { label: "Active",         value: activeCount,             icon: "✅", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100"  },
            { label: "Deactivated",    value: inactiveCount,           icon: "🚫", bg: "bg-gray-50",   text: "text-gray-700",   border: "border-gray-200"   },
          ].map((s) => (
            <div key={s.label} className={`stat-card ${s.bg} ${s.border}`}>
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Staff Table */}
        <div className="table-wrapper">
          <table className="w-full text-sm">
            <thead className="table-header">
              <tr>
                <th className="table-th">Staff ID</th>
                <th className="table-th">Department</th>
                <th className="table-th">Assets Assigned</th>
                <th className="table-th">Status</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(staffList ?? []).map((staff: any) => (
                <tr key={staff.id} className="table-row">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br
                                      from-blue-100 to-blue-200 flex items-center
                                      justify-center text-blue-700 font-bold
                                      text-sm flex-shrink-0">
                        👤
                      </div>
                      <div>
                        <p className="font-mono text-xs text-gray-600">
                          {staff.id.slice(0, 12)}...
                        </p>
                        {staff.phone && (
                          <p className="text-xs text-gray-400">{staff.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-td text-gray-600">
                    {staff.department ?? "—"}
                  </td>
                  <td className="table-td">
                    <span className="badge bg-blue-50 text-blue-700 border-blue-100">
                      📦 {staff.staff_assets?.length ?? 0}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${
                      staff.active
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                      {staff.active ? "✅ Active" : "🚫 Inactive"}
                    </span>
                  </td>
                  <td className="table-td">
                    {staff.active && (
                      <StaffDeactivateButton staffId={staff.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!staffList || staffList.length === 0) && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">👥</p>
              <p className="text-sm">No staff members found</p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
