import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

function isPortalPath(pathname: string) {
  return (
    pathname === "/planillas" ||
    pathname.startsWith("/planillas/") ||
    pathname === "/boletines" ||
    pathname.startsWith("/boletines/") ||
    pathname === "/usuarios" ||
    pathname.startsWith("/usuarios/") ||
    pathname === "/banco" ||
    pathname.startsWith("/banco/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.AUTH_SECRET;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session =
    secret && token ? await verifySessionToken(token, secret) : null;

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/planillas", request.url));
  }

  if (isPortalPath(pathname) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (pathname === "/usuarios" || pathname.startsWith("/usuarios/")) &&
    session?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/planillas", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/planillas",
    "/planillas/:path*",
    "/boletines",
    "/boletines/:path*",
    "/usuarios",
    "/usuarios/:path*",
    "/banco",
    "/banco/:path*",
  ],
};
