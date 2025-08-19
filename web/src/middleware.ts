import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Refresh the session so server components (e.g., protected layout)
  // can read it from cookies on each /admin request.
  try {
    const supabase = createMiddlewareClient({ req, res });
    await supabase.auth.getSession();
  } catch {
    // ignore — if anything fails we continue without a session
  }

  return res;
}

// Only run this on admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
