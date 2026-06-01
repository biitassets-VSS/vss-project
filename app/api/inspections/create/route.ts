import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                  from "next/headers";
import { NextResponse }             from "next/server";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    assetId, notes, dueDate,
    photoFrontUrl, photoBackUrl, photoLeftUrl, photoRightUrl,
  } = await req.json();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const staffId = session.user.id;

  const { data: profile } = await supabase
    .from("profiles").select("active, role").eq("id", staffId).single();

  if (!profile?.active || profile?.role !== "staff")
    return NextResponse.json({ error: "Access denied" }, { status: 403 });

  const { data: assignment } = await supabase
    .from("staff_assets").select("id")
    .eq("staff_id", staffId).eq("asset_id", assetId).single();

  if (!assignment)
    return NextResponse.json({ error: "Asset not assigned to you" }, { status: 403 });

  const { data: inspection, error } = await supabase
    .from("inspections")
    .insert({
      asset_id: assetId, staff_id: staffId, notes,
      due_date: dueDate, status: "done",
      photo_front_url: photoFrontUrl,
      photo_back_url:  photoBackUrl,
      photo_left_url:  photoLeftUrl,
      photo_right_url: photoRightUrl,
    })
    .select().single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("tracking_history").insert({
    asset_id: assetId, staff_id: staffId, type: "INSPECT",
    notes: `Inspection completed. Notes: ${notes ?? "none"}`,
    created_by: staffId,
  });

  return NextResponse.json({ success: true, inspection });
}
