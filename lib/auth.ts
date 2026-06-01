// ================================================
// AUTH HELPERS — Server Side
// ================================================

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                     from "next/headers";
import { redirect }                    from "next/navigation";

export async function getSessionAndProfile() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { session: null, profile: null, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, active, department, avatar_url")
    .eq("id", session.user.id)
    .single();

  return { session, profile, supabase };
}

export async function requireAdmin() {
  const { session, profile, supabase } = await getSessionAndProfile();
  if (!session || !profile || profile.role !== "admin") redirect("/staff/login");
  return { session, profile, supabase };
}

export async function requireActiveStaff() {
  const { session, profile, supabase } = await getSessionAndProfile();
  if (!session || !profile) redirect("/staff/login");
  if (!profile.active)      redirect("/staff/login?reason=deactivated");
  if (profile.role !== "staff") redirect("/admin/dashboard");
  return { session, profile, supabase };
}
