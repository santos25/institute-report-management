import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/db/prisma";
import { isRole, type HeaderUser, type Role } from "@/lib/auth/roles";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth/token";

export type ActionUser = {
  id: string;
  name: string;
  username: string;
  role: Role;
  degreeIds: string[];
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function readSessionPayload(): Promise<SessionPayload | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token, secret);
}

async function loadUser(userId: string): Promise<ActionUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      degrees: { select: { id: true } },
    },
  });

  if (!user || !isRole(user.role)) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    degreeIds: user.degrees.map((degree) => degree.id),
  };
}

export async function getActionUser(): Promise<ActionUser | null> {
  const payload = await readSessionPayload();
  if (!payload) return null;
  return loadUser(payload.sub);
}

function isDynamicServerError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    (error as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE"
  );
}

export async function getHeaderUser(): Promise<HeaderUser | null> {
  try {
    const user = await getActionUser();
    if (!user) return null;
    return { name: user.name, role: user.role };
  } catch (error) {
    if (isDynamicServerError(error)) throw error;
    console.error("No se pudo leer la sesión:", error);
    return null;
  }
}

export async function requireUser(): Promise<ActionUser> {
  const payload = await readSessionPayload();
  if (!payload) redirect("/login");

  const user = await loadUser(payload.sub);
  if (!user) redirect("/api/auth/logout");
  return user;
}

export async function requireAdminPage(): Promise<ActionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/planillas");
  return user;
}

export async function createSession(user: {
  id: string;
  username: string;
  name: string;
  role: Role;
}) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado");
  }

  const token = await signSession(
    {
      sub: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    },
    secret
  );

  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(SESSION_MAX_AGE_SECONDS));
}

export async function clearSession() {
  (await cookies()).set(SESSION_COOKIE, "", cookieOptions(0));
}
