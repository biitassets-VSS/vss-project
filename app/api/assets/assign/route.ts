import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                  from "next/headers";
import { NextResponse }             from "next/server";

export async function POST(req: Request) {
  const supabase         = createRouteHandlerClient({ cookies });
  const { assetId, staffId } = await req.json();

  if (!assetId || !staffId)
    return NextResponse.json({ error: "assetId and staffId required" }, { status: 400 });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await supabase
    .from("profiles").select("role").eq("id", session.user.id).single();

  if (caller?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error: mapErr } = await supabase
    .from("staff_assets")
    .insert({ staff_id: staffId, asset_id: assetId, assigned_by: session.user.id });

  if (mapErr)
    return NextResponse.json({ error: mapErr.message }, { status: 500 });

  await supabase.from("assets")
    .update({ available: false, assigned_to: staffId }).eq("id", assetId);

  await supabase.from("tracking_history").insert({
    asset_id: assetId, staff_id: staffId, type: "ASSIGN",
    notes: "Asset assigned to staff", created_by: session.user.id,
  });

  return NextResponse.json({ success: true, message: "Asset assigned." });
}
