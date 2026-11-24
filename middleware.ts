import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GUARDIAN_SESSION_COOKIE, verifyGuardianToken } from "@/lib/auth/guardian-token";
import { decideRequestAccess } from "@/lib/auth/routes";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.AUTH_SECRET;
  const staffToken = request.cookies.get(SESSION_COOKIE)?.value;
  const guardianToken = request.cookies.get(GUARDIAN_SESSION_COOKIE)?.value;

  const staff =
    secret && staffToken ? await verifySessionToken(staffToken, secret) : null;
  const guardian =
    secret && guardianToken
      ? await verifyGuardianToken(guardianToken, secret)
      : null;

  const decision = decideRequestAccess({
    pathname,
    staffRole: staff?.role ?? null,
    guardianAuthenticated: Boolean(guardian),
  });

  if (decision.type === "redirect") {
    return NextResponse.redirect(new URL(decision.to, request.url));
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
    "/avance",
    "/avance/:path*",
    "/estudiantes",
    "/estudiantes/:path*",
    "/usuarios",
    "/usuarios/:path*",
    "/acudientes",
    "/acudientes/:path*",
    "/familias",
    "/familias/:path*",
  ],
};
