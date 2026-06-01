// ================================================
// STATUS PILL
// ================================================

type Status = "pending" | "done" | "overdue";

const CONFIG: Record<Status, {
  label: string; icon: string;
  bg: string; text: string; border: string;
}> = {
  done:    { label: "Done",    icon: "✅", bg: "bg-green-100",  text: "text-green-800",  border: "border-green-200"  },
  pending: { label: "Pending", icon: "🕐", bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
  overdue: { label: "Overdue", icon: "🚨", bg: "bg-red-100",    text: "text-red-800",    border: "border-red-200"    },
};

export default function StatusPill({ status }: { status: Status }) {
  const cfg = CONFIG[status] ?? CONFIG.pending;
  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-1 rounded-full
      text-xs font-semibold border whitespace-nowrap
      ${cfg.bg} ${cfg.text} ${cfg.border}
    `}>
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
