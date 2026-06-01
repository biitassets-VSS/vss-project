// ================================================
// ASSET THUMBNAIL GRID
// ================================================

"use client";

import { useState, useMemo }  from "react";
import AssetCard              from "./AssetCard";
import CategoryFilter         from "./CategoryFilter";
import { getCategoryBySlug }  from "@/lib/assetCategories";
import type { Asset }         from "@/types";

type Props = {
  assets:       Asset[];
  title?:       string;
  showInspect?: boolean;
};

export default function AssetThumbnailGrid({
  assets,
  title       = "Assets",
  showInspect = false,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery,    setSearchQuery]    = useState("");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of assets) {
      const slug = a.category_slug ?? "others";
      counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
  }, [assets]);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchCat =
        activeCategory === "all" || a.category_slug === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q)                    ||
        (a.brand         ?? "").toLowerCase().includes(q)   ||
        (a.model         ?? "").toLowerCase().includes(q)   ||
        (a.serial_number ?? "").toLowerCase().includes(q)   ||
        (a.department    ?? "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [assets, activeCategory, searchQuery]);

  const grouped = useMemo(() => {
    if (activeCategory !== "all") return null;
    const map: Record<string, Asset[]> = {};
    for (const asset of filtered) {
      const slug = asset.category_slug ?? "others";
      if (!map[slug]) map[slug] = [];
      map[slug].push(asset);
    }
    return map;
  }, [filtered, activeCategory]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">
          {title}
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({filtered.length} of {assets.length})
          </span>
        </h2>

        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2
                           text-gray-400 pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search name, brand, serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-gray-600 text-sm"
            >✕</button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selected={activeCategory}
        onChange={setActiveCategory}
        counts={categoryCounts}
      />

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed
                        border-gray-200 p-16 text-center">
          <p className="text-6xl mb-4">📭</p>
          <p className="font-semibold text-gray-600 text-lg">No assets found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try a different category or clear your search
          </p>
          {(searchQuery || activeCategory !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="mt-4 text-sm text-blue-600 hover:underline font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Grouped by Category (All view) */}
      {grouped && Object.keys(grouped).length > 0 && (
        <div className="space-y-10">
          {Object.entries(grouped).map(([slug, items]) => {
            if (!items.length) return null;
            const cat = getCategoryBySlug(slug);
            return (
              <section key={slug}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    text-xl ${cat.color} border ${cat.borderColor} flex-shrink-0
                  `}>
                    {cat.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-gray-100" />
                  <button
                    onClick={() => setActiveCategory(slug)}
                    className="text-xs text-blue-600 hover:underline
                               font-medium whitespace-nowrap flex-shrink-0"
                  >
                    View all →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3
                                lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {items.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      showInspect={showInspect}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Single Category Grid */}
      {!grouped && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3
                        lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              showInspect={showInspect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
