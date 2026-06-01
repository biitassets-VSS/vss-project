// ================================================
// FOOTER
// ================================================

import { BRAND } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-5 mt-auto no-print">
      <div className="max-w-screen-xl mx-auto px-6
                      flex flex-col sm:flex-row items-center
                      justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center
                          justify-center text-white text-xs font-black">
            V
          </div>
          <span className="text-white text-sm font-semibold">{BRAND.name}</span>
        </div>
        <p className="text-xs">{BRAND.copyright}</p>
      </div>
    </footer>
  );
}
