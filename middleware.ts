import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse }           from "next/server";
import type { NextRequest }       from "next/server";

import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export async function middleware(req: NextRequest) {
  const res      = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname }           = req.nextUrl;

  const protectedPaths =
    pathname.startsWith("/admin")           ||
    pathname.startsWith("/staff/dashboard") ||
    pathname.startsWith("/staff/inspect");

  if (!session && protectedPaths) {
    return NextResponse.redirect(new URL("/staff/login", req.url));
  }

  if (!session) return res;

  const { data: profile } = await supabase
    .from("profiles").select("role, active")
    .eq("id", session.user.id).single();

  // Deactivated → sign out
  if (profile && !profile.active) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL("/staff/login?reason=deactivated", req.url)
    );
  }

  // Staff → block admin routes
  if (pathname.startsWith("/admin") && profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/staff/dashboard", req.url));
  }

  // Admin → block staff routes
  if (
    (pathname.startsWith("/staff/dashboard") ||
     pathname.startsWith("/staff/inspect")) &&
    profile?.role === "admin"
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/dashboard/:path*",
    "/staff/inspect/:path*",
  ],
};
