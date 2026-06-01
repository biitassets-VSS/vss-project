"use client";

import { useState }  from "react";
import { useRouter } from "next/navigation";

export default function StaffDeactivateButton({ staffId }: { staffId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  async function handleDeactivate() {
    setLoading(true);
    const res = await fetch("/api/staff/deactivate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ staffId }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(`Error: ${data.error}`);
    }
    setLoading(false);
    setConfirm(false);
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDeactivate}
          disabled={loading}
          className="btn-danger text-xs px-3 py-1.5"
        >
          {loading ? "..." : "✓ Confirm"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-xs text-red-600 hover:text-red-800
                 hover:bg-red-50 px-3 py-1.5 rounded-lg
                 transition-colors font-medium"
    >
      Deactivate
    </button>
  );
}
