import { createClient } from "@supabase/supabase-js";
import { NextResponse }  from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today    = new Date();
  const in2Days  = new Date(today);
  in2Days.setDate(today.getDate() + 2);

  const todayStr   = today.toISOString().split("T")[0];
  const in2DaysStr = in2Days.toISOString().split("T")[0];

  const { data: upcoming } = await supabase
    .from("inspections")
    .select("id, staff_id, due_date")
    .eq("due_date", in2DaysStr).eq("status", "pending");

  let reminded = 0;
  for (const ins of upcoming ?? []) {
    const { data: exists } = await supabase
      .from("inspection_notifications").select("id")
      .eq("inspection_id", ins.id).eq("status", "sent").single();

    if (!exists) {
      await supabase.from("inspection_notifications").insert({
        inspection_id: ins.id, staff_id: ins.staff_id,
        due_date: ins.due_date, status: "sent",
        message: `⏰ Reminder: Inspection due on ${ins.due_date}`,
      });
      reminded++;
    }
  }

  const { data: overdueList } = await supabase
    .from("inspections")
    .select("id, staff_id, due_date")
    .lt("due_date", todayStr).eq("status", "pending");

  let overdueCount = 0;
  for (const ins of overdueList ?? []) {
    await supabase.from("inspections")
      .update({ status: "overdue" }).eq("id", ins.id);
    await supabase.from("inspection_notifications").upsert({
      inspection_id: ins.id, staff_id: ins.staff_id,
      due_date: ins.due_date, status: "overdue",
      message: `🚨 OVERDUE: Inspection was due on ${ins.due_date}`,
    });
    overdueCount++;
  }

  return NextResponse.json({ success: true, reminded, overdue: overdueCount });
}
