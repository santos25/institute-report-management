import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtectedRoute =
    pathname.startsWith("/planillas") || pathname.startsWith("/boletines");

  // Add Cache-Control headers for protected routes
  if (isProtectedRoute) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "private, no-store, max-age=0, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    return response;
  }

  return NextResponse.next();
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
