import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                  from "next/headers";
import { NextResponse }             from "next/server";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { assetId, staffId, notes } = await req.json();

  if (!assetId || !staffId)
    return NextResponse.json({ error: "assetId and staffId required" }, { status: 400 });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error: histErr } = await supabase.from("tracking_history").insert({
    asset_id: assetId, staff_id: staffId, type: "RETURN",
    notes: notes ?? "Asset returned", created_by: session.user.id,
  });

  if (histErr)
    return NextResponse.json({ error: histErr.message }, { status: 500 });

  await supabase.from("assets")
    .update({ available: true, assigned_to: null }).eq("id", assetId);

  await supabase.from("staff_assets")
    .delete().eq("asset_id", assetId).eq("staff_id", staffId);

  return NextResponse.json({ success: true, message: "Asset returned. Stock updated." });
}
