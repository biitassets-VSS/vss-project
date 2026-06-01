import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                  from "next/headers";
import { NextResponse }             from "next/server";

export async function POST(req: Request) {
  const supabase    = createRouteHandlerClient({ cookies });
  const { staffId } = await req.json();

  if (!staffId)
    return NextResponse.json({ error: "staffId required" }, { status: 400 });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await supabase
    .from("profiles").select("role").eq("id", session.user.id).single();

  if (caller?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supabase
    .from("profiles").update({ active: false }).eq("id", staffId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, message: "Staff deactivated. History preserved." });
}
