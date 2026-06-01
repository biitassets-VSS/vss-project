// ================================================
// NAVBAR
// ================================================

import Link      from "next/link";
import { BRAND } from "@/lib/constants";

type Props = { role?: string };

export default function Navbar({ role }: Props) {
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm
                    sticky top-0 z-30 no-print">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3.5
                      flex items-center justify-between gap-4">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br
                          from-blue-600 to-blue-700 flex items-center
                          justify-center text-white font-black text-sm
                          shadow-sm shadow-blue-200">
            VSS
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-gray-900 text-sm leading-tight">
              {BRAND.name}
            </p>
            <p className="text-xs text-gray-400">{BRAND.tagline}</p>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 flex-wrap">
          {role === "admin" && (
            <>
              <NavLink href="/admin/dashboard">📊 Dashboard</NavLink>
              <NavLink href="/admin/assets">📦 Assets</NavLink>
              <NavLink href="/admin/assets/add">➕ Add</NavLink>
              <NavLink href="/admin/staff">👥 Staff</NavLink>
            </>
          )}
          {role === "staff" && (
            <NavLink href="/staff/dashboard">📦 My Assets</NavLink>
          )}

          <form action="/api/auth/signout" method="POST" className="ml-1">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white text-xs
                         px-3.5 py-2 rounded-lg transition-colors font-semibold"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: {
  href: string; children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50
                 text-sm px-3 py-2 rounded-lg transition-colors
                 font-medium whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
