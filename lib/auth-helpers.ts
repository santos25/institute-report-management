import { auth } from "@/auth";

export type AuthResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; code: "UNAUTHENTICATED" | "FORBIDDEN"; message: string };

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      code: "UNAUTHENTICATED",
      message: "No session found",
    } as const;
  }
  return { ok: true, data: session } as const;
}

export async function requireAuthOrThrow() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const result = await requireAuth();
  if (!result.ok) {
    return result;
  }
  
  const session = result.data;
  if (!allowedRoles.includes(session.user.role)) {
    return {
      ok: false,
      code: "FORBIDDEN",
      message: "Insufficient permissions",
    } as const;
  }
  return { ok: true, data: session } as const;
}

export async function canAccessDegree(degreeId: string) {
  const session = await auth();
  if (!session?.user) return false;
  
  // ADMIN can access everything
  if (session.user.role === "ADMIN") {
    return true;
  }
  
  // TEACHER can only access their assigned degrees
  if (session.user.role === "TEACHER") {
    return session.user.degreeIds.includes(degreeId);
  }
  
  return false;
}

export async function filterAccessibleDegrees(degreeIds: string[]) {
  const session = await auth();
  if (!session?.user) return [];
  
  // ADMIN can access all degrees
  if (session.user.role === "ADMIN") {
    return degreeIds;
  }
  
  // TEACHER can only access their assigned degrees
  if (session.user.role === "TEACHER") {
    return degreeIds.filter((id) => session.user.degreeIds.includes(id));
  }
  
  return [];
}
