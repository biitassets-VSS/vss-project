// ================================================
// HISTORY DRAWER
// ================================================

"use client";

import { useEffect, useState }         from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TrackingRow }            from "@/types";

const TYPE_CONFIG: Record<string, { icon: string; bg: string; border: string }> = {
  ASSIGN:  { icon: "📋", bg: "bg-blue-50",   border: "border-blue-100"   },
  RETURN:  { icon: "↩️", bg: "bg-orange-50", border: "border-orange-100" },
  INSPECT: { icon: "🔍", bg: "bg-green-50",  border: "border-green-100"  },
  NOTE:    { icon: "📝", bg: "bg-gray-50",   border: "border-gray-100"   },
};

export default function HistoryDrawer({
  assetId,
  open,
  onClose,
}: {
  assetId: string;
  open:    boolean;
  onClose: () => void;
}) {
  const supabase = createClientComponentClient();
  const [rows,    setRows]    = useState<TrackingRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("tracking_history")
      .select("id, type, notes, created_at")
      .eq("asset_id", assetId)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setRows((data as TrackingRow[]) ?? []);
        setLoading(false);
      });
  }, [open, assetId]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="
          fixed right-0 top-0 h-full w-full sm:w-[420px]
          bg-white z-50 shadow-2xl flex flex-col
        "
        style={{ animation: "slideInRight 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5
                        border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="font-bold text-lg text-gray-900">📜 Tracking History</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {rows.length} record{rows.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300
                       text-gray-600 flex items-center justify-center
                       transition-colors text-sm font-bold"
          >✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
              <span className="text-2xl" style={{ animation: "spin 1s linear infinite" }}>
                ⏳
              </span>
              Loading history...
            </div>
          )}

          {!loading && rows.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-sm">No history records yet</p>
            </div>
          )}

          {rows.map((row) => {
            const cfg = TYPE_CONFIG[row.type] ?? TYPE_CONFIG.NOTE;
            return (
              <div
                key={row.id}
                className={`
                  flex gap-3 p-4 rounded-xl border
                  ${cfg.bg} ${cfg.border}
                `}
              >
                <span className="text-xl flex-shrink-0">{cfg.icon}</span>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-gray-700 text-sm">
                    {row.type}
                  </span>
                  {row.notes && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {row.notes}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">
                    🕐 {new Date(row.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
