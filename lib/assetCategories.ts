// ================================================
// ASSET CATEGORIES CONFIG
// ================================================

export type CategorySlug =
  | "laptop"
  | "keyboard-wireless"
  | "keyboard-usb"
  | "headphone"
  | "laptop-stand"
  | "mouse-pad"
  | "mobile-phone"
  | "usb-ext-hub"
  | "cleaning-kit"
  | "others";

export type AssetCategory = {
  slug:        CategorySlug;
  label:       string;
  icon:        string;
  color:       string;
  textColor:   string;
  borderColor: string;
  description: string;
};

export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    slug: "laptop", label: "Laptop", icon: "💻",
    color: "bg-blue-100", textColor: "text-blue-800",
    borderColor: "border-blue-300",
    description: "Laptops and portable computers",
  },
  {
    slug: "keyboard-wireless", label: "Wireless Keyboard", icon: "⌨️",
    color: "bg-purple-100", textColor: "text-purple-800",
    borderColor: "border-purple-300",
    description: "Wireless keyboards",
  },
  {
    slug: "keyboard-usb", label: "USB Keyboard+Mouse", icon: "🖱️",
    color: "bg-indigo-100", textColor: "text-indigo-800",
    borderColor: "border-indigo-300",
    description: "USB wired keyboard and mouse combos",
  },
  {
    slug: "headphone", label: "Headphone", icon: "🎧",
    color: "bg-pink-100", textColor: "text-pink-800",
    borderColor: "border-pink-300",
    description: "Headphones and audio devices",
  },
  {
    slug: "laptop-stand", label: "Laptop Stand", icon: "🗜️",
    color: "bg-orange-100", textColor: "text-orange-800",
    borderColor: "border-orange-300",
    description: "Stands and risers for laptops",
  },
  {
    slug: "mouse-pad", label: "Mouse Pad", icon: "🟦",
    color: "bg-cyan-100", textColor: "text-cyan-800",
    borderColor: "border-cyan-300",
    description: "Mouse pads and desk mats",
  },
  {
    slug: "mobile-phone", label: "Mobile Phone", icon: "📱",
    color: "bg-green-100", textColor: "text-green-800",
    borderColor: "border-green-300",
    description: "Mobile phones and smartphones",
  },
  {
    slug: "usb-ext-hub", label: "USB EXT Hub", icon: "🔌",
    color: "bg-yellow-100", textColor: "text-yellow-800",
    borderColor: "border-yellow-300",
    description: "USB extension hubs and splitters",
  },
  {
    slug: "cleaning-kit", label: "Cleaning Kit", icon: "🧹",
    color: "bg-teal-100", textColor: "text-teal-800",
    borderColor: "border-teal-300",
    description: "Device cleaning kits and supplies",
  },
  {
    slug: "others", label: "Others", icon: "📦",
    color: "bg-gray-100", textColor: "text-gray-700",
    borderColor: "border-gray-300",
    description: "Miscellaneous assets",
  },
];

export function getCategoryBySlug(slug?: string): AssetCategory {
  return (
    ASSET_CATEGORIES.find((c) => c.slug === slug) ??
    ASSET_CATEGORIES[ASSET_CATEGORIES.length - 1]
  );
}

export const CATEGORY_SLUG_OPTIONS = ASSET_CATEGORIES.map((c) => ({
  value: c.slug,
  label: `${c.icon} ${c.label}`,
}));
