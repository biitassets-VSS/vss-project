// ================================================
// CATEGORY FILTER BAR
// ================================================

"use client";

import { ASSET_CATEGORIES } from "@/lib/assetCategories";

type Props = {
  selected: string;
  onChange: (slug: string) => void;
  counts?:  Record<string, number>;
};

export default function CategoryFilter({
  selected,
  onChange,
  counts = {},
}: Props) {
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  const tabs = [
    { slug: "all", label: "All Assets", icon: "🗂️", count: totalCount },
    ...ASSET_CATEGORIES.map((c) => ({
      slug:  c.slug,
      label: c.label,
      icon:  c.icon,
      count: counts[c.slug] ?? 0,
    })),
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide pb-1">
      <div className="flex gap-2 min-w-max px-0.5 py-0.5">
        {tabs.map((tab) => {
          const isActive = selected === tab.slug;
          return (
            <button
              key={tab.slug}
              onClick={() => onChange(tab.slug)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full
                text-sm font-medium border
                transition-all duration-200 whitespace-nowrap select-none
                ${isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center
                  ${isActive
                    ? "bg-white/25 text-white"
                    : "bg-gray-100 text-gray-500"
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
