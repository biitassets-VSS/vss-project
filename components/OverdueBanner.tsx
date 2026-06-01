// ================================================
// OVERDUE BANNER
// ================================================

"use client";

type Props = { count: number; messages: string[] };

export default function OverdueBanner({ count, messages }: Props) {
  if (count === 0) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4
                    flex gap-3 items-start shadow-sm animate-in">
      <span className="text-2xl flex-shrink-0">🚨</span>
      <div className="min-w-0">
        <p className="font-bold text-red-700 text-sm">
          {count} Overdue Inspection{count > 1 ? "s" : ""} — Action Required
        </p>
        <ul className="mt-2 space-y-1">
          {messages.map((msg, i) => (
            <li key={i} className="text-xs text-red-600 flex gap-1.5">
              <span className="flex-shrink-0">•</span>
              <span>{msg}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
