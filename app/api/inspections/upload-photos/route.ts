import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                  from "next/headers";
import { NextResponse }             from "next/server";
import { PHOTO_SIDES }              from "@/lib/constants";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const staffId      = session.user.id;
  const formData     = await req.formData();
  const inspectionId = formData.get("inspectionId") as string;
  const assetId      = formData.get("assetId")      as string;

  if (!inspectionId || !assetId)
    return NextResponse.json({ error: "inspectionId and assetId required" }, { status: 400 });

  const { data: assignment } = await supabase
    .from("staff_assets").select("id")
    .eq("staff_id", staffId).eq("asset_id", assetId).single();

  if (!assignment)
    return NextResponse.json({ error: "Not your asset" }, { status: 403 });

  const urls: Record<string, string> = {};

  for (const side of PHOTO_SIDES) {
    const file = formData.get(side) as File | null;
    if (!file) continue;

    const path = `${staffId}/${inspectionId}/${side}.jpg`;

    const { error: uploadErr } = await supabase.storage
      .from("inspection-photos")
      .upload(path, file, { contentType: "image/jpeg", upsert: true });

    if (uploadErr)
      return NextResponse.json(
        { error: `Upload failed for ${side}: ${uploadErr.message}` },
        { status: 500 }
      );

    const { data: urlData } = supabase.storage
      .from("inspection-photos").getPublicUrl(path);

    urls[`${side}_url`] = urlData.publicUrl;
  }

  await supabase.from("inspections")
    .update({
      photo_front_url: urls["photo_front_url"],
      photo_back_url:  urls["photo_back_url"],
      photo_left_url:  urls["photo_left_url"],
      photo_right_url: urls["photo_right_url"],
    })
    .eq("id", inspectionId).eq("staff_id", staffId);

  return NextResponse.json({ success: true, urls });
}
