import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-in-production"
);

const publicPaths = ["/", "/products", "/about", "/contact"];
const authPaths = ["/login", "/register"];
const adminPaths = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  let payload: { role?: string; userId?: string } | null = null;
  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, JWT_SECRET);
      payload = p as { role?: string; userId?: string };
    } catch {
      payload = null;
    }
  }

  // Refresh token if access token expired but refresh token exists
  if (!payload && refreshToken) {
    const refreshSecret = new TextEncoder().encode(
      process.env.JWT_REFRESH_SECRET ?? "fallback-refresh-secret-change-in-production"
    );
    try {
      const { payload: rp } = await jwtVerify(refreshToken, refreshSecret);
      if (rp.userId) {
        // Token expired but refresh is valid — will be handled by API to issue new token
      }
    } catch {
      // Refresh token also invalid
    }
  }

  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p));
  const isPublicPath =
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/categories/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/login" ||
    pathname === "/register";

  // If accessing auth page while logged in, redirect
  if (isAuthPath && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing admin page while not logged in
  if (isAdminPath && !payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If accessing admin page as customer (not ADMIN or STAFF)
  if (isAdminPath && payload && payload.role === "CUSTOMER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
