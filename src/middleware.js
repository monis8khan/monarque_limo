import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth";

// NOTE: Middleware runs on the Edge runtime, which can't use the Node
// `jsonwebtoken` verify (it needs Node's crypto module). So this only checks
// that a session cookie is *present* and redirects obviously-logged-out users
// to /admin/login. Real signature verification happens server-side in every
// protected API route via requireAdmin() (see src/lib/auth.js), which is what
// actually guards the data.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/dashboard")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"]
};
