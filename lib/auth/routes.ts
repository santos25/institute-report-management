export type StaffRole = "ADMIN" | "TEACHER";

export type AccessDecision =
  | { type: "next" }
  | { type: "redirect"; to: string };

const STAFF_PREFIXES = [
  "/planillas",
  "/boletines",
  "/avance",
  "/estudiantes",
  "/usuarios",
  "/acudientes",
] as const;

const ADMIN_PREFIXES = ["/usuarios", "/acudientes"] as const;

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isStaffPortalPath(pathname: string) {
  return STAFF_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

export function isAdminOnlyPath(pathname: string) {
  return ADMIN_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

export function isGuardianLoginPath(pathname: string) {
  return pathname === "/familias/login" || pathname.startsWith("/familias/login/");
}

export function isGuardianProtectedPath(pathname: string) {
  if (isGuardianLoginPath(pathname)) return false;
  return pathname === "/familias" || pathname.startsWith("/familias/");
}

/**
 * La cookie de acudiente no cuenta como sesión del personal, y la cookie del
 * personal no abre el portal de familias. Cada lado llega ya verificado por
 * su propio token.
 */
export function decideRequestAccess(input: {
  pathname: string;
  staffRole: StaffRole | null;
  guardianAuthenticated: boolean;
}): AccessDecision {
  const { pathname, staffRole, guardianAuthenticated } = input;

  if (pathname === "/login" && staffRole) {
    return { type: "redirect", to: "/planillas" };
  }

  if (isGuardianLoginPath(pathname) && guardianAuthenticated) {
    return { type: "redirect", to: "/familias" };
  }

  if (isStaffPortalPath(pathname) && !staffRole) {
    return { type: "redirect", to: "/login" };
  }

  if (isAdminOnlyPath(pathname) && staffRole !== "ADMIN") {
    return { type: "redirect", to: "/planillas" };
  }

  if (isGuardianProtectedPath(pathname) && !guardianAuthenticated) {
    return { type: "redirect", to: "/familias/login" };
  }

  return { type: "next" };
}
