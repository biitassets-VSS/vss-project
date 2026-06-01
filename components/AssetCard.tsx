// ================================================
// ASSET CARD — Thumbnail Card
// ================================================

"use client";

import { useState }          from "react";
import Link                  from "next/link";
import StatusPill            from "./StatusPill";
import HistoryDrawer         from "./HistoryDrawer";
import { getCategoryBySlug } from "@/lib/assetCategories";
import type { Asset }        from "@/types";

type Props = {
  asset:     Asset;
  showInspect?: boolean;
};

export default function AssetCard({ asset, showInspect = false }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const category = getCategoryBySlug(asset.category_slug);

  return (
    <>
      <div className="
        bg-white rounded-2xl shadow-card hover:shadow-card-hover
        transition-all duration-200 overflow-hidden
        border border-gray-100 hover:border-blue-200
        flex flex-col group cursor-default
        animate-in
      ">
        {/* ── Thumbnail ── */}
        <div className={`
          relative h-44 ${category.color}
          flex items-center justify-center
          overflow-hidden flex-shrink-0
        `}>
          {asset.image_url ? (
            <img
              src={asset.image_url}
              alt={asset.name}
              className="w-full h-full object-cover
                         group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-7xl select-none
                             group-hover:scale-110 transition-transform duration-200">
              {category.icon}
            </span>
          )}

          {/* Availability Dot */}
          <div
            title={asset.available !== false ? "Available" : "In Use"}
            className={`
              absolute top-2.5 right-2.5 w-3 h-3 rounded-full
              border-2 border-white shadow
              ${asset.available !== false ? "bg-green-500" : "bg-red-400"}
            `}
          />

          {/* Category Badge */}
          <div className="
            absolute bottom-0 left-0 right-0
            bg-gradient-to-t from-black/30 to-transparent
            px-3 pb-2.5 pt-8
          ">
            <span className={`
              inline-flex items-center gap-1 px-2 py-0.5
              rounded-full text-xs font-semibold
              ${category.color} ${category.textColor} ${category.borderColor}
              border backdrop-blur-sm
            `}>
              {category.icon} {category.label}
            </span>
          </div>
        </div>

        {/* ── Card Body ── */}
        <div className="p-4 flex flex-col gap-1.5 flex-1">
          <h3 className="font-semibold text-gray-800 text-sm
                         leading-snug line-clamp-2">
            {asset.name}
          </h3>

          {(asset.brand || asset.model) && (
            <p className="text-xs text-gray-500 truncate">
              {[asset.brand, asset.model].filter(Boolean).join(" · ")}
            </p>
          )}

          {asset.serial_number && (
            <p className="text-xs text-gray-400 font-mono truncate">
              S/N: {asset.serial_number}
            </p>
          )}

          {asset.department && (
            <p className="text-xs text-gray-500 truncate">
              🏢 {asset.department}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between
                          mt-auto pt-2 border-t border-gray-100">
            <StatusPill status={asset.status} />
            <div className="flex items-center gap-2">
              {showInspect && (
                <Link
                  href={`/staff/inspect/${asset.id}`}
                  className="text-xs bg-blue-600 hover:bg-blue-700
                             text-white px-2.5 py-1 rounded-lg
                             font-medium transition-colors"
                >
                  Inspect
                </Link>
              )}
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-800
                           font-medium transition-colors"
              >
                📜 History
              </button>
            </div>
          </div>
        </div>
      </div>

      <HistoryDrawer
        assetId={asset.id}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
