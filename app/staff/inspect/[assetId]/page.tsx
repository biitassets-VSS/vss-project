"use client";

import { useState, useRef }             from "react";
import { useParams, useRouter }         from "next/navigation";
import { createClientComponentClient }  from "@supabase/auth-helpers-nextjs";
import Navbar                           from "@/components/Navbar";
import Footer                           from "@/components/Footer";
import { PHOTO_SIDES, type PhotoSide }  from "@/lib/constants";

const SIDE_LABELS: Record<PhotoSide, { label: string; icon: string; hint: string }> = {
  photo_front: { label: "Front View",  icon: "⬆️", hint: "Face the asset from the front" },
  photo_back:  { label: "Back View",   icon: "⬇️", hint: "Capture the rear side"         },
  photo_left:  { label: "Left Side",   icon: "⬅️", hint: "Capture the left side"         },
  photo_right: { label: "Right Side",  icon: "➡️", hint: "Capture the right side"        },
};

export default function InspectPage() {
  const supabase = createClientComponentClient();
  const params   = useParams();
  const router   = useRouter();
  const assetId  = params.assetId as string;

  const [notes,   setNotes]   = useState("");
  const [dueDate, setDueDate] = useState("");
  const [photos,  setPhotos]  = useState<Record<PhotoSide, File | null>>({
    photo_front: null, photo_back: null,
    photo_left:  null, photo_right: null,
  });
  const [previews, setPreviews] = useState<Record<PhotoSide, string | null>>({
    photo_front: null, photo_back: null,
    photo_left:  null, photo_right: null,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  function handlePhotoChange(side: PhotoSide, file: File | null) {
    setPhotos((p)   => ({ ...p, [side]: file }));
    setPreviews((p) => ({
      ...p,
      [side]: file ? URL.createObjectURL(file) : null,
    }));
  }

  const uploadedCount = Object.values(photos).filter(Boolean).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Create inspection
    const createRes = await fetch("/api/inspections/create", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ assetId, notes, dueDate }),
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      setError(createData.error ?? "Failed to create inspection");
      setLoading(false);
      return;
    }

    // Upload photos if any
    if (uploadedCount > 0) {
      const formData = new FormData();
      formData.append("inspectionId", createData.inspection.id);
      formData.append("assetId",      assetId);

      for (const side of PHOTO_SIDES) {
        if (photos[side]) formData.append(side, photos[side]!);
      }

      const uploadRes = await fetch("/api/inspections/upload-photos", {
        method: "POST",
        body:   formData,
      });

      if (!uploadRes.ok) {
        const uploadData = await uploadRes.json();
        setError(uploadData.error ?? "Photo upload failed");
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setTimeout(() => router.push("/staff/dashboard"), 2000);
  }

  return (
    <div className="page-wrapper">
      <Navbar role="staff" />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🔍 Submit Inspection</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload photos from all 4 angles and add your notes
          </p>
        </div>

        <div className="section-card">
          {success ? (
            <div className="text-center py-12">
              <p className="text-7xl mb-4">✅</p>
              <p className="font-bold text-green-700 text-2xl">
                Inspection Submitted!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Returning to dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Photo Upload Progress */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl
                              p-3 flex items-center gap-3">
                <span className="text-2xl">📸</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-800">
                    {uploadedCount} of 4 photos uploaded
                  </p>
                  <div className="mt-1.5 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${(uploadedCount / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 4 Photo Boxes */}
              <div>
                <label className="label">Asset Photos (4 Angles)</label>
                <div className="grid grid-cols-2 gap-4">
                  {PHOTO_SIDES.map((side) => (
                    <PhotoUploadBox
                      key={side}
                      side={side}
                      config={SIDE_LABELS[side]}
                      preview={previews[side]}
                      onChange={(file) => handlePhotoChange(side, file)}
                    />
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="label">📅 Next Inspection Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="label">📝 Inspection Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Describe the current condition of the asset. Note any damage, missing parts, or concerns..."
                  className="input resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600
                                text-sm p-3 rounded-xl flex gap-2">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary flex-1 py-3"
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700
                             text-white font-semibold py-3 rounded-xl
                             transition-colors disabled:opacity-60
                             disabled:cursor-not-allowed text-sm
                             shadow-sm shadow-green-200"
                >
                  {loading ? "⏳ Submitting..." : "✅ Submit Inspection"}
                </button>
              </div>

            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ── Photo Upload Box ──
function PhotoUploadBox({
  side, config, preview, onChange,
}: {
  side:    PhotoSide;
  config:  { label: string; icon: string; hint: string };
  preview: string | null;
  onChange:(file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="
        relative h-40 rounded-2xl border-2 border-dashed
        border-gray-200 hover:border-blue-400 cursor-pointer
        overflow-hidden bg-gray-50 hover:bg-blue-50
        flex flex-col items-center justify-center gap-2
        transition-all duration-200 group
      "
    >
      {preview ? (
        <>
          <img
            src={preview}
            alt={config.label}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col
                          items-center justify-center opacity-0
                          group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-medium">🔄 Change</span>
          </div>
          <div className="absolute top-2 left-2 bg-green-500 text-white
                          text-xs px-2 py-0.5 rounded-full font-semibold">
            ✓
          </div>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white
                          text-xs px-2 py-0.5 rounded-full">
            {config.icon} {config.label}
          </div>
        </>
      ) : (
        <>
          <span className="text-3xl">{config.icon}</span>
          <span className="text-xs font-semibold text-gray-600">
            {config.label}
          </span>
          <span className="text-xs text-gray-400 text-center px-3">
            {config.hint}
          </span>
          <span className="text-xs text-blue-500 font-medium mt-1">
            Tap to upload
          </span>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
