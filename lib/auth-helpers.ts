import { auth } from "@/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function canAccessDegree(degreeId: string) {
  const session = await requireAuth();
  
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
  const session = await requireAuth();
  
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
